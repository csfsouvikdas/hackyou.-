import Papa from 'papaparse';
import type { ParsedCSV, ColumnProfile, ColumnType } from '@/types/csv';
import { cleanCSVData } from './cleaner';

function detectType(values: any[]): ColumnType {
  const nonEmpty = values.filter((v) => v !== '' && v !== null && v !== undefined);
  if (nonEmpty.length === 0) return 'text';

  const sample = nonEmpty.slice(0, 200);

  // boolean
  const boolSet = new Set(['true', 'false', '0', '1', 'yes', 'no']);
  if (sample.every((v) => {
    const s = String(v).toLowerCase();
    return boolSet.has(s);
  })) return 'boolean';

  // numeric
  if (sample.every((v) => {
    if (typeof v === 'number') return true;
    const s = String(v).trim();
    return s !== '' && !isNaN(Number(s));
  })) return 'numeric';

  // date
  const dateCount = sample.filter((v) => {
    if (typeof v === 'number') return false; // Usually dates are strings in CSV
    return !isNaN(Date.parse(String(v)));
  }).length;
  if (dateCount / sample.length > 0.8) return 'date';

  // categorical vs text
  const uniqueRatio = new Set(nonEmpty).size / nonEmpty.length;
  if (uniqueRatio < 0.5 || new Set(nonEmpty).size <= 30) return 'categorical';

  return 'text';
}

function profileColumn(name: string, values: any[]): ColumnProfile {
  const type = detectType(values);
  const nonEmpty = values.filter((v) => v !== '' && v !== null && v !== undefined);
  const nullCount = values.length - nonEmpty.length;
  const uniqueCount = new Set(nonEmpty).size;

  const profile: ColumnProfile = { name, type, nullCount, uniqueCount, totalCount: values.length };

  if (type === 'numeric') {
    const nums = nonEmpty.map(Number).filter((n) => !isNaN(n));
    if (nums.length > 0) {
      nums.sort((a, b) => a - b);
      profile.min = nums[0];
      profile.max = nums[nums.length - 1];
      profile.mean = Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100;
      profile.median = nums[Math.floor(nums.length / 2)];
      // distribution: 10 bins
      const range = (profile.max as number) - (profile.min as number);
      if (range > 0) {
        const bins = new Array(10).fill(0);
        nums.forEach((n) => {
          const idx = Math.min(Math.floor(((n - (profile.min as number)) / range) * 10), 9);
          bins[idx]++;
        });
        profile.distribution = bins;
      }
    }
  }

  if (type === 'categorical' || type === 'text') {
    const freq: Record<string, number> = {};
    nonEmpty.forEach((v) => { freq[v] = (freq[v] || 0) + 1; });
    profile.top5 = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([value, count]) => ({ value, count }));
  }

  if (type === 'date') {
    const dates = nonEmpty.map((v) => new Date(String(v)).getTime()).filter((d) => !isNaN(d));
    if (dates.length > 0) {
      dates.sort((a, b) => a - b);
      profile.min = new Date(dates[0]).toISOString().split('T')[0];
      profile.max = new Date(dates[dates.length - 1]).toISOString().split('T')[0];
    }
  }

  return profile;
}

export function parseCSV(file: File): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rawRows = results.data as Record<string, string>[];
        const headers = results.meta.fields || [];
        
        // Apply automatic cleaning
        const { cleanedRows } = cleanCSVData(rawRows, headers);
        
        const columns = headers.map((h) => profileColumn(h, cleanedRows.map((r) => r[h])));
        resolve({
          fileName: file.name,
          headers,
          rows: cleanedRows,
          columns,
          rowCount: cleanedRows.length,
        });
      },
      error: (err) => reject(err),
    });
  });
}
