import { ColumnCard } from '@/components/profiler/ColumnCard';
import { useDashboardStore } from '@/store/dashboardStore';

export function ColumnProfilerPanel() {
  const { csv } = useDashboardStore();
  if (!csv) return null;

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Column Profiles</h3>
        <p className="text-xs text-muted-foreground">{csv.columns.length} columns · {csv.rowCount.toLocaleString()} rows</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {csv.columns.map((col) => (
          <ColumnCard key={col.name} col={col} />
        ))}
      </div>
    </div>
  );
}
