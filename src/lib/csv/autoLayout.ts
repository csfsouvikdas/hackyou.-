import type { ColumnProfile, ChartConfig, ChartType } from '@/types/csv';

let _id = 0;
const nextId = () => `chart-${++_id}`;

export function generateAutoCharts(columns: ColumnProfile[]): ChartConfig[] {
  _id = 0;
  const charts: ChartConfig[] = [];
  const numeric = columns.filter((c) => c.type === 'numeric');
  const categorical = columns.filter((c) => c.type === 'categorical');
  const date = columns.filter((c) => c.type === 'date');

  // Bar: categorical x + numeric y
  if (categorical.length > 0 && numeric.length > 0) {
    charts.push({ id: nextId(), type: 'bar', title: `${numeric[0].name} by ${categorical[0].name}`, xCol: categorical[0].name, yCol: numeric[0].name });
  }

  // Line: date x + numeric y
  if (date.length > 0 && numeric.length > 0) {
    charts.push({ id: nextId(), type: 'line', title: `${numeric[0].name} over time`, xCol: date[0].name, yCol: numeric[0].name });
  }

  // Pie: categorical with ≤8 unique values
  const pieCat = categorical.find((c) => c.uniqueCount <= 8);
  if (pieCat) {
    charts.push({ id: nextId(), type: 'pie', title: `${pieCat.name} distribution`, xCol: pieCat.name, yCol: numeric.length > 0 ? numeric[0].name : pieCat.name });
  }

  // Scatter: two numeric columns
  if (numeric.length >= 2) {
    charts.push({ id: nextId(), type: 'scatter', title: `${numeric[0].name} vs ${numeric[1].name}`, xCol: numeric[0].name, yCol: numeric[1].name });
  }

  // Heatmap: two categoricals (or fallback)
  if (categorical.length >= 2 && numeric.length > 0) {
    charts.push({ id: nextId(), type: 'heatmap', title: `${categorical[0].name} × ${categorical[1].name}`, xCol: categorical[0].name, yCol: categorical[1].name, groupCol: numeric[0].name });
  }

  // Treemap: categorical + numeric
  if (categorical.length > 0 && numeric.length > 0) {
    const catIdx = charts.some((c) => c.type === 'bar' && c.xCol === categorical[0].name) && categorical.length > 1 ? 1 : 0;
    const numIdx = numeric.length > 1 ? 1 : 0;
    charts.push({ id: nextId(), type: 'treemap', title: `${categorical[catIdx].name} treemap`, xCol: categorical[catIdx].name, yCol: numeric[numIdx].name });
  }

  // Area: date or categorical x + numeric y
  if ((date.length > 0 || categorical.length > 0) && numeric.length > 0) {
    const xCol = date.length > 0 ? date[0].name : categorical[0].name;
    const yCol = numeric.length > 1 ? numeric[1].name : numeric[0].name;
    charts.push({ id: nextId(), type: 'area', title: `${yCol} Area Trend`, xCol, yCol });
  }

  // Spline: line with smooth curve
  if (numeric.length > 0 && (date.length > 0 || categorical.length > 0)) {
    const xCol = date.length > 0 ? date[0].name : categorical[0].name;
    const yCol = numeric[0].name;
    charts.push({ id: nextId(), type: 'spline', title: `${yCol} Smooth Trend`, xCol, yCol });
  }

  // Fallback...
  while (charts.length < 4 && numeric.length > charts.length) {
    const n = numeric[charts.length];
    const cat = categorical[0]?.name || columns[0]?.name || '';
    charts.push({ id: nextId(), type: 'bar', title: `${n.name}`, xCol: cat, yCol: n.name });
  }

  return charts.slice(0, 12);
}
