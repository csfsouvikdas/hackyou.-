import { useDashboardStore } from '@/store/dashboardStore';
import { ChartPanel } from './ChartPanel';
import { motion } from 'framer-motion';

export function DashboardGrid() {
  const { charts } = useDashboardStore();

  if (charts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
      {charts.map((chart, i) => (
        <motion.div 
          key={chart.id} 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="h-[400px]"
        >
          <ChartPanel config={chart} />
        </motion.div>
      ))}
    </div>
  );
}
