import { useDashboardStore } from '@/store/dashboardStore';
import { cn } from '@/lib/utils';

export function CorrelationPanel() {
  const { correlationMatrix } = useDashboardStore();

  if (!correlationMatrix || correlationMatrix.cols.length < 2) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
        Need at least 2 numeric columns for correlation analysis
      </div>
    );
  }

  const { cols, matrix } = correlationMatrix;

  return (
    <div className="rounded-lg border bg-card overflow-hidden animate-fade-in">
      <div className="px-4 py-3 border-b">
        <h3 className="text-sm font-semibold">Correlation Matrix</h3>
        <p className="text-xs text-muted-foreground">Pearson r between numeric columns · ★ = |r| &gt; 0.7</p>
      </div>
      <div className="overflow-auto p-3">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="p-2" />
              {cols.map((c) => (
                <th key={c} className="p-2 text-muted-foreground font-medium truncate max-w-[80px]">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cols.map((row, i) => (
              <tr key={row}>
                <td className="p-2 text-muted-foreground font-medium truncate max-w-[80px]">{row}</td>
                {cols.map((_, j) => {
                  const r = matrix[i][j];
                  const abs = Math.abs(r);
                  const isStrong = abs > 0.7 && i !== j;
                  const bg = i === j
                    ? 'bg-muted'
                    : r > 0
                      ? `rgba(55, 138, 221, ${abs * 0.6})`
                      : `rgba(226, 75, 74, ${abs * 0.6})`;
                  return (
                    <td
                      key={j}
                      className={cn('p-2 text-center rounded-sm font-mono', isStrong && 'font-bold')}
                      style={i !== j ? { backgroundColor: bg, color: abs > 0.4 ? 'white' : undefined } : undefined}
                    >
                      {i === j ? '1.00' : r.toFixed(2)}
                      {isStrong && ' ★'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
