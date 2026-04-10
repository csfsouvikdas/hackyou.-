
/**
 * Data Cleaning Utility
 * 
 * Implements the following rules:
 * 1. Missing values: Fill numeric with median, categorical with mode.
 * 2. Duplicate rows: Remove exact duplicates (keep first).
 * 3. Inconsistent categories: Standardize to Title Case.
 * 4. Whitespace: Strip leading/trailing spaces.
 * 5. Data type mismatches: Convert numeric columns stored as text to numbers.
 */

export interface CleaningStats {
  rowsRemoved: number;
  cellsFilled: number;
  columnsFixed: number;
}

export function cleanCSVData(rows: Record<string, string>[], headers: string[]): { cleanedRows: Record<string, any>[], stats: CleaningStats } {
  let stats: CleaningStats = { rowsRemoved: 0, cellsFilled: 0, columnsFixed: 0 };
  const initialRowCount = rows.length;

  // 4. Whitespace & 3. Inconsistent Categories & 5. Numeric detection
  let processedRows = rows.map(row => {
    const newRow: Record<string, any> = {};
    headers.forEach(header => {
      let val = row[header];
      if (val === undefined || val === null) val = '';
      
      // Rule 4: Strip whitespace
      val = val.trim();
      
      // Rule 3: Title Case for categorical-looking strings
      // We'll apply this to all strings that aren't numeric
      if (val && isNaN(Number(val)) && typeof val === 'string') {
        const titleCased = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
        if (titleCased !== val) {
          val = titleCased;
        }
      }

      newRow[header] = val;
    });
    return newRow;
  });

  // 2. Duplicate rows
  const seen = new Set();
  const uniqueRows = [];
  for (const row of processedRows) {
    const str = JSON.stringify(row);
    if (!seen.has(str)) {
      seen.add(str);
      uniqueRows.push(row);
    }
  }
  stats.rowsRemoved = initialRowCount - uniqueRows.length;
  processedRows = uniqueRows;

  // 1. Missing values & 5. Type Conversion
  headers.forEach(header => {
    const values = processedRows.map(r => r[header]).filter(v => v !== '');
    
    // Detect column type
    const isNumeric = values.every(v => !isNaN(Number(v)));
    
    if (isNumeric && values.length > 0) {
      stats.columnsFixed++;
      const nums = values.map(Number).sort((a, b) => a - b);
      const median = nums[Math.floor(nums.length / 2)];
      
      processedRows.forEach(row => {
        if (row[header] === '') {
          row[header] = median;
          stats.cellsFilled++;
        } else {
          row[header] = Number(row[header]);
        }
      });
    } else if (values.length > 0) {
      // Categorical - Mode
      const counts: Record<string, number> = {};
      values.forEach(v => counts[v] = (counts[v] || 0) + 1);
      const mode = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      
      processedRows.forEach(row => {
        if (row[header] === '') {
          row[header] = mode;
          stats.cellsFilled++;
        }
      });
    }
  });

  return { cleanedRows: processedRows, stats };
}
