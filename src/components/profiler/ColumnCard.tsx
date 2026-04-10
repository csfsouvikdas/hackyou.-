import type { ColumnProfile } from '@/types/csv';
import { Hash, Calendar, Type, ToggleLeft, AlignLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeIcons = {
  numeric: Hash,
  date: Calendar,
  categorical: Type,
  boolean: ToggleLeft,
  text: AlignLeft,
};

const typeColors: Record<string, string> = {
  numeric: 'bg-chart-1/15 text-chart-1',
  date: 'bg-chart-3/15 text-chart-3',
  categorical: 'bg-chart-2/15 text-chart-2',
  boolean: 'bg-chart-5/15 text-chart-5',
  text: 'bg-chart-4/15 text-chart-4',
};

function MiniBar({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-px h-8">
      {data.map((v, i) => (
        <div key={i} className="flex-1 bg-primary/60 rounded-t-sm" style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  );
}

export function ColumnCard({ col }: { col: ColumnProfile }) {
  const Icon = typeIcons[col.type];
  const nullPct = Math.round((col.nullCount / col.totalCount) * 100);

  return (
    <div className="rounded-lg border bg-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', typeColors[col.type])}>
          <Icon className="h-3 w-3" />
          {col.type}
        </span>
        <h4 className="text-sm font-semibold truncate flex-1">{col.name}</h4>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
        <div>Unique: <span className="text-foreground font-medium">{col.uniqueCount.toLocaleString()}</span></div>
        <div>Nulls: <span className={cn('font-medium', nullPct > 20 ? 'text-destructive' : 'text-foreground')}>{nullPct}%</span></div>
        {col.type === 'numeric' && (
          <>
            <div>Min: <span className="text-foreground font-medium">{col.min?.toLocaleString()}</span></div>
            <div>Max: <span className="text-foreground font-medium">{col.max?.toLocaleString()}</span></div>
            <div>Mean: <span className="text-foreground font-medium">{col.mean?.toLocaleString()}</span></div>
            <div>Median: <span className="text-foreground font-medium">{col.median?.toLocaleString()}</span></div>
          </>
        )}
        {col.type === 'date' && (
          <>
            <div>From: <span className="text-foreground font-medium">{String(col.min)}</span></div>
            <div>To: <span className="text-foreground font-medium">{String(col.max)}</span></div>
          </>
        )}
      </div>

      {col.distribution && <MiniBar data={col.distribution} />}

      {col.top5 && col.top5.length > 0 && (
        <div className="mt-2 space-y-1">
          {col.top5.slice(0, 3).map((t) => (
            <div key={t.value} className="flex justify-between text-xs">
              <span className="truncate text-muted-foreground">{t.value}</span>
              <span className="text-foreground font-medium ml-2">{t.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
