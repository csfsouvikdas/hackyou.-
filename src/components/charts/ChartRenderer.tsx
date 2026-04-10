import { useMemo } from 'react';
import {
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart as ReLineChart, Line,
  PieChart as RePieChart, Pie, Cell,
  ScatterChart as ReScatterChart, Scatter,
  Treemap as ReTreemap,
  AreaChart as ReAreaChart, Area,
  RadarChart as ReRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  RadialBarChart as ReRadialBarChart, RadialBar, Legend as ReLegend,
} from 'recharts';
import { CHART_COLOR_VALUES } from '@/lib/chartColors';
import type { ChartConfig } from '@/types/csv';

interface ChartRendererProps {
  config: ChartConfig;
  rows: Record<string, any>[];
}

type HeatmapData = { xVals: string[]; yVals: string[]; grid: Record<string, Record<string, { sum: number; count: number }>> };

export function ChartRenderer({ config, rows }: ChartRendererProps) {
  const chartData = useMemo(() => {
    if (config.type === 'heatmap') return null;

    if (config.type === 'pie') {
      const freq: Record<string, number> = {};
      rows.forEach((r) => {
        const key = r[config.xCol] || 'N/A';
        const val = Number(r[config.yCol]);
        freq[key] = (freq[key] || 0) + (isNaN(val) ? 1 : val);
      });
      return Object.entries(freq).slice(0, 8).map(([name, value]) => ({ name, value }));
    }

    if (config.type === 'scatter') {
      return rows.map((r) => ({ x: Number(r[config.xCol]), y: Number(r[config.yCol]) }))
        .filter((d) => !isNaN(d.x) && !isNaN(d.y)).slice(0, 500);
    }

    if (config.type === 'treemap') {
      const freq: Record<string, number> = {};
      rows.forEach((r) => {
        const key = r[config.xCol] || 'N/A';
        const val = Number(r[config.yCol]);
        freq[key] = (freq[key] || 0) + (isNaN(val) ? 1 : val);
      });
      return Object.entries(freq).map(([name, size]) => ({ name, size, fill: CHART_COLOR_VALUES[Math.abs(name.charCodeAt(0)) % 6] }));
    }

    // bar, line
    const agg: Record<string, { sum: number; count: number }> = {};
    rows.forEach((r) => {
      const key = r[config.xCol] || 'N/A';
      const val = Number(r[config.yCol]);
      if (!agg[key]) agg[key] = { sum: 0, count: 0 };
      if (!isNaN(val)) { agg[key].sum += val; agg[key].count++; }
    });
    return Object.entries(agg).slice(0, 50)
      .map(([name, { sum, count }]) => ({ name, value: Math.round((sum / Math.max(count, 1)) * 100) / 100 }));
  }, [config, rows]);

  const heatmapData = useMemo((): HeatmapData | null => {
    if (config.type !== 'heatmap') return null;
    const xVals = [...new Set(rows.map((r) => r[config.xCol]))].slice(0, 15);
    const yVals = [...new Set(rows.map((r) => r[config.yCol]))].slice(0, 15);
    const grid: Record<string, Record<string, { sum: number; count: number }>> = {};
    rows.forEach((r) => {
      const x = r[config.xCol], y = r[config.yCol];
      if (!grid[y]) grid[y] = {};
      if (!grid[y][x]) grid[y][x] = { sum: 0, count: 0 };
      const val = config.groupCol ? Number(r[config.groupCol]) : 1;
      if (!isNaN(val)) { grid[y][x].sum += val; grid[y][x].count++; }
    });
    return { xVals, yVals, grid };
  }, [config, rows]);

  const tooltipStyle = {
    contentStyle: { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' },
  };

  if (config.type === 'heatmap' && heatmapData) {
    return <HeatmapViz data={heatmapData} config={config} />;
  }

  const gradientId = `grad-${config.id}`;

  if (!chartData || chartData.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No data to display</div>;
  }

  switch (config.type) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ReBarChart data={chartData} margin={{ top: 8, right: 8, bottom: 20, left: 8 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLOR_VALUES[0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={CHART_COLOR_VALUES[0]} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} cursor={{ fill: 'hsl(var(--primary)/0.05)' }} />
            <Bar dataKey="value" fill={`url(#${gradientId})`} stroke={CHART_COLOR_VALUES[0]} strokeWidth={1} radius={[4, 4, 0, 0]} />
          </ReBarChart>
        </ResponsiveContainer>
      );
    case 'line':
    case 'spline':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ReLineChart data={chartData} margin={{ top: 8, right: 8, bottom: 20, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} />
            <Line type={config.type === 'spline' ? "monotone" : "linear"} dataKey="value" stroke={CHART_COLOR_VALUES[0]} strokeWidth={3} dot={{ r: 4, fill: CHART_COLOR_VALUES[0], strokeWidth: 2, stroke: 'hsl(var(--background))' }} activeDot={{ r: 6, strokeWidth: 0 }} />
          </ReLineChart>
        </ResponsiveContainer>
      );
    case 'area':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ReAreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 20, left: 8 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLOR_VALUES[1]} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={CHART_COLOR_VALUES[1]} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} />
            <Area type="monotone" dataKey="value" stroke={CHART_COLOR_VALUES[1]} strokeWidth={3} fillOpacity={1} fill={`url(#${gradientId})`} />
          </ReAreaChart>
        </ResponsiveContainer>
      );
    case 'radar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ReRadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fontSize: 8 }} />
            <Radar name={config.yCol} dataKey="value" stroke={CHART_COLOR_VALUES[0]} fill={CHART_COLOR_VALUES[0]} fillOpacity={0.5} />
            <Tooltip {...tooltipStyle} />
          </ReRadarChart>
        </ResponsiveContainer>
      );
    case 'radial':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ReRadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={chartData}>
            <RadialBar background dataKey="value" cornerRadius={10} />
            <Tooltip {...tooltipStyle} />
          </ReRadialBarChart>
        </ResponsiveContainer>
      );
    case 'pie':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RePieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="75%"
              label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
              {chartData.map((_: any, i: number) => <Cell key={i} fill={CHART_COLOR_VALUES[i % 6]} />)}
            </Pie>
            <Tooltip {...tooltipStyle} />
          </RePieChart>
        </ResponsiveContainer>
      );
    case 'scatter':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ReScatterChart margin={{ top: 8, right: 8, bottom: 20, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="x" name={config.xCol} tick={{ fontSize: 11 }} />
            <YAxis dataKey="y" name={config.yCol} tick={{ fontSize: 11 }} />
            <Tooltip {...tooltipStyle} />
            <Scatter data={chartData} fill={CHART_COLOR_VALUES[0]} />
          </ReScatterChart>
        </ResponsiveContainer>
      );
    case 'treemap':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ReTreemap data={chartData} dataKey="size" nameKey="name" stroke="hsl(var(--background))" fill={CHART_COLOR_VALUES[0]} />
        </ResponsiveContainer>
      );
    default:
      return <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Unsupported chart type</div>;
  }
}

function HeatmapViz({ data, config }: { data: HeatmapData; config: ChartConfig }) {
  const { xVals, yVals, grid } = data;
  const allVals: number[] = [];
  yVals.forEach((y) => xVals.forEach((x) => {
    if (grid[y]?.[x]) allVals.push(grid[y][x].sum / grid[y][x].count);
  }));
  const maxVal = Math.max(...allVals, 1);
  const minVal = Math.min(...allVals, 0);

  return (
    <div className="overflow-auto h-full p-2">
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="p-1 text-muted-foreground" />
            {xVals.map((x) => <th key={x} className="p-1 text-muted-foreground truncate max-w-[60px]">{x}</th>)}
          </tr>
        </thead>
        <tbody>
          {yVals.map((y) => (
            <tr key={y}>
              <td className="p-1 text-muted-foreground truncate max-w-[80px]">{y}</td>
              {xVals.map((x) => {
                const cell = grid[y]?.[x];
                const val = cell ? Math.round((cell.sum / cell.count) * 100) / 100 : 0;
                const norm = maxVal !== minVal ? (val - minVal) / (maxVal - minVal) : 0;
                return (
                  <td key={x} className="p-1 text-center rounded" style={{ backgroundColor: `rgba(55, 138, 221, ${norm * 0.8 + 0.1})`, color: norm > 0.5 ? 'white' : undefined }}>
                    {val || ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
