import Papa from 'papaparse';
import { ParsedCSV, ColumnProfile } from '@/types/csv';
import { profileColumn } from './parser';

export async function mergeCSVFiles(files: File[]): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => {
    let allRows: Record<string, any>[] = [];
    let combinedHeaders = new Set<string>();
    let processedCount = 0;

    const processFile = (file: File) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          allRows = [...allRows, ...(results.data as Record<string, any>[])];
          results.meta.fields?.forEach(h => combinedHeaders.add(h));
          processedCount++;

          if (processedCount === files.length) {
            // Sort rows by the first column by default for "clear data sorting"
            const firstHeader = Array.from(combinedHeaders)[0];
            if (firstHeader) {
               allRows.sort((a, b) => {
                  if (a[firstHeader] < b[firstHeader]) return -1;
                  if (a[firstHeader] > b[firstHeader]) return 1;
                  return 0;
               });
            }

            const headers = Array.from(combinedHeaders);
            const columns: ColumnProfile[] = headers.map(header => 
              profileColumn(header, allRows.map(row => row[header]))
            );

            resolve({
              fileName: `merged_${files.length}_files.csv`,
              headers,
              rows: allRows,
              columns,
              rowCount: allRows.length
            });
          }
        },
        error: (err) => reject(err)
      });
    };

    files.forEach(processFile);
  });
}
