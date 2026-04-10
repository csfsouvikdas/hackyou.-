import { GripHorizontal } from 'lucide-react';
import { ChartRenderer } from '@/components/charts/ChartRenderer';
import { useDashboardStore } from '@/store/dashboardStore';
import type { ChartConfig, ChartType } from '@/types/csv';
import { cn } from '@/lib/utils';

const chartTypes: { value: ChartType; label: string }[] = [
  { value: 'bar', label: 'Bar' },
  { value: 'line', label: 'Line' },
  { value: 'pie', label: 'Pie' },
  { value: 'scatter', label: 'Scatter' },
  { value: 'area', label: 'Area' },
  { value: 'spline', label: 'Spline' },
  { value: 'heatmap', label: 'Heatmap' },
  { value: 'treemap', label: 'Treemap' },
];

export function ChartPanel({ config }: { config: ChartConfig }) {
  const { filteredRows, csv, updateChart } = useDashboardStore();
  const columns = csv?.headers || [];

  return (
    <div className="flex flex-col h-full rounded-3xl border bg-card/60 backdrop-blur-md overflow-hidden shadow-lg shadow-primary/5 group transition-all hover:shadow-primary/10">
      <div className="flex items-center gap-3 px-5 py-3 border-b bg-muted/40 cursor-grab active:cursor-grabbing" style={{ touchAction: 'none' }}>
        <GripHorizontal className="h-4 w-4 text-muted-foreground/60 transition-colors group-hover:text-primary" />
        <input
          className="text-sm font-bold bg-transparent border-none outline-none flex-1 min-w-0 placeholder:text-muted-foreground/50 transition-colors focus:text-primary"
          value={config.title}
          onChange={(e) => updateChart(config.id, { title: e.target.value })}
        />
        <select
          className="text-[10px] font-bold uppercase tracking-wider bg-secondary/80 border-none rounded-full px-3 py-1 outline-none cursor-pointer hover:bg-secondary transition-colors"
          value={config.type}
          onChange={(e) => updateChart(config.id, { type: e.target.value as ChartType })}
        >
          {chartTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-4 px-5 py-2 border-b bg-muted/20 text-[10px] font-bold uppercase tracking-tight">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="text-muted-foreground/60">X-Axis:</span>
          <select className="bg-transparent border-none outline-none flex-1 truncate hover:text-primary transition-colors" value={config.xCol}
            onChange={(e) => updateChart(config.id, { xCol: e.target.value })}>
            {columns.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="text-muted-foreground/60">Y-Axis:</span>
          <select className="bg-transparent border-none outline-none flex-1 truncate hover:text-primary transition-colors" value={config.yCol}
            onChange={(e) => updateChart(config.id, { yCol: e.target.value })}>
            {columns.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="flex-1 min-h-0 p-4">
        <ChartRenderer config={config} rows={filteredRows} />
      </div>
    </div>
  );
}
