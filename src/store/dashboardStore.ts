import { create } from 'zustand';
import type { ParsedCSV, ChartConfig, FilterState, ColumnProfile } from '@/types/csv';

interface DashboardState {
  csv: ParsedCSV | null;
  charts: ChartConfig[];
  filters: FilterState;
  filteredRows: Record<string, any>[];
  aiStory: string | null;
  aiLoading: boolean;
  correlationMatrix: { cols: string[]; matrix: number[][] } | null;
  chartSummaries: Record<string, string>;

  setCsv: (csv: ParsedCSV) => void;
  setCharts: (charts: ChartConfig[]) => void;
  updateChart: (id: string, update: Partial<ChartConfig>) => void;
  setFilters: (filters: FilterState) => void;
  setFilteredRows: (rows: Record<string, any>[]) => void;
  setAiStory: (story: string | null) => void;
  setAiLoading: (loading: boolean) => void;
  setCorrelationMatrix: (m: { cols: string[]; matrix: number[][] } | null) => void;
  setChartSummary: (chartId: string, summary: string) => void;
  reset: () => void;
}

const initial = {
  csv: null,
  charts: [],
  filters: { columnFilters: {} },
  filteredRows: [],
  aiStory: null,
  aiLoading: false,
  correlationMatrix: null,
  chartSummaries: {},
};

export const useDashboardStore = create<DashboardState>((set) => ({
  ...initial,
  setCsv: (csv) => set({ csv, filteredRows: csv.rows }),
  setCharts: (charts) => set({ charts }),
  updateChart: (id, update) =>
    set((s) => ({ charts: s.charts.map((c) => (c.id === id ? { ...c, ...update } : c)) })),
  setFilters: (filters) => set({ filters }),
  setFilteredRows: (filteredRows) => set({ filteredRows }),
  setAiStory: (aiStory) => set({ aiStory }),
  setAiLoading: (aiLoading) => set({ aiLoading }),
  setCorrelationMatrix: (correlationMatrix) => set({ correlationMatrix }),
  setChartSummary: (chartId, summary) =>
    set((s) => ({ chartSummaries: { ...s.chartSummaries, [chartId]: summary } })),
  reset: () => set(initial),
}));
