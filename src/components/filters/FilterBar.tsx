import { useDashboardStore } from '@/store/dashboardStore';
import { useMemo, useCallback } from 'react';
import { X } from 'lucide-react';

export function FilterBar() {
  const { csv, filters, setFilters, setFilteredRows } = useDashboardStore();

  const categoricalCols = useMemo(() => {
    if (!csv) return [];
    return csv.columns.filter((c) => c.type === 'categorical' && c.uniqueCount <= 20);
  }, [csv]);

  const applyFilters = useCallback(
    (newFilters: typeof filters) => {
      if (!csv) return;
      setFilters(newFilters);
      let rows = csv.rows;
      Object.entries(newFilters.columnFilters).forEach(([col, val]) => {
        if (val === null || val === undefined) return;
        if (Array.isArray(val) && typeof val[0] === 'string') {
          const vals = val as string[];
          if (vals.length > 0) rows = rows.filter((r) => vals.includes(String(r[col])));
        }
      });
      setFilteredRows(rows);
    },
    [csv, setFilters, setFilteredRows]
  );

  const toggleCategoryValue = useCallback((col: string, value: string) => {
    const current = (filters.columnFilters[col] as string[] | undefined) || [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    applyFilters({ ...filters, columnFilters: { ...filters.columnFilters, [col]: next } });
  }, [filters, applyFilters]);

  const clearFilter = useCallback((col: string) => {
    const next = { ...filters.columnFilters };
    delete next[col];
    applyFilters({ ...filters, columnFilters: next });
  }, [filters, applyFilters]);

  if (!csv) return null;

  const activeFilterCount = Object.values(filters.columnFilters).filter(
    (v) => v && Array.isArray(v) && v.length > 0
  ).length;

  return (
    <div className="flex items-center gap-3 overflow-x-auto py-2 px-1 scrollbar-none">
      {categoricalCols.map((col) => {
        const active = (filters.columnFilters[col.name] as string[] | undefined) || [];
        return (
          <div key={col.name} className="relative group flex-shrink-0">
            <select
              className="text-xs bg-secondary rounded-full px-3 py-1.5 border-none outline-none appearance-none cursor-pointer pr-6"
              value=""
              onChange={(e) => {
                if (e.target.value) toggleCategoryValue(col.name, e.target.value);
              }}
            >
              <option value="">
                {col.name} {active.length > 0 ? `(${active.length})` : ''}
              </option>
              {col.top5?.map((t) => (
                <option key={t.value} value={t.value}>
                  {active.includes(t.value) ? '✓ ' : ''}{t.value} ({t.count})
                </option>
              ))}
            </select>
            {active.length > 0 && (
              <button
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                onClick={() => clearFilter(col.name)}
              >
                <X className="h-2.5 w-2.5" />
              </button>
            )}
          </div>
        );
      })}
      {activeFilterCount > 0 && (
        <button
          className="text-xs text-destructive hover:underline flex-shrink-0"
          onClick={() => applyFilters({ ...filters, columnFilters: {} })}
        >
          Clear all
        </button>
      )}
    </div>
  );
}
