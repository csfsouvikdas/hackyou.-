import type { ColumnProfile } from '@/types/csv';

export function computeCorrelationMatrix(
  rows: Record<string, any>[],
  columns: ColumnProfile[]
): { cols: string[]; matrix: number[][] } {
  const numCols = columns.filter((c) => c.type === 'numeric').map((c) => c.name);
  if (numCols.length < 2) return { cols: numCols, matrix: [] };

  const data: Record<string, number[]> = {};
  numCols.forEach((col) => {
    data[col] = rows.map((r) => Number(r[col])).filter((n) => !isNaN(n));
  });

  const matrix: number[][] = [];
  for (let i = 0; i < numCols.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < numCols.length; j++) {
      if (i === j) { matrix[i][j] = 1; continue; }
      matrix[i][j] = pearson(data[numCols[i]], data[numCols[j]]);
    }
  }

  return { cols: numCols, matrix };
}

function pearson(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 3) return 0;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += x[i]; sumY += y[i];
    sumXY += x[i] * y[i];
    sumX2 += x[i] * x[i]; sumY2 += y[i] * y[i];
  }
  const denom = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  if (denom === 0) return 0;
  return Math.round(((n * sumXY - sumX * sumY) / denom) * 100) / 100;
}
