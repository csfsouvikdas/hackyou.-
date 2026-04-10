export type ColumnType = 'numeric' | 'categorical' | 'date' | 'boolean' | 'text';

export interface ColumnProfile {
  name: string;
  type: ColumnType;
  nullCount: number;
  uniqueCount: number;
  totalCount: number;
  min?: number | string;
  max?: number | string;
  mean?: number;
  median?: number;
  top5?: { value: string; count: number }[];
  distribution?: number[];
}

export interface ParsedCSV {
  fileName: string;
  headers: string[];
  rows: Record<string, any>[];
  columns: ColumnProfile[];
  rowCount: number;
}

export type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'heatmap' | 'treemap' | 'area' | 'spline' | 'radar' | 'radial';

export interface ChartConfig {
  id: string;
  type: ChartType;
  title: string;
  xCol: string;
  yCol: string;
  groupCol?: string;
}

export interface FilterState {
  dateRange?: { start: string; end: string };
  columnFilters: Record<string, string[] | [number, number] | boolean | null>;
}
