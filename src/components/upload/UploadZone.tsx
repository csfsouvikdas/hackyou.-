import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseCSV } from '@/lib/csv/parser';
import { generateAutoCharts } from '@/lib/csv/autoLayout';
import { computeCorrelationMatrix } from '@/lib/correlation';
import { useDashboardStore } from '@/store/dashboardStore';
import { cn } from '@/lib/utils';

export function UploadZone() {
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setCsv, setCharts, setCorrelationMatrix } = useDashboardStore();

  const handleFile = useCallback(async (file: File) => {
    // Reset state
    setError(null);

    if (!file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }

    setParsing(true);
    try {
      const parsed = await parseCSV(file);

      // Update global state
      setCsv(parsed);
      setCharts(generateAutoCharts(parsed.columns));
      setCorrelationMatrix(computeCorrelationMatrix(parsed.rows, parsed.columns));
    } catch (e) {
      console.error('Parse error', e);
      setError('Failed to parse the file. Check your CSV formatting.');
    } finally {
      setParsing(false);
    }
  }, [setCsv, setCharts, setCorrelationMatrix]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <motion.div
        layout
        onClick={() => !parsing && document.getElementById('csv-file-input')?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'relative group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-16 transition-all duration-300 ease-out cursor-pointer',
          dragging
            ? 'border-primary bg-primary/10 scale-[1.02] shadow-xl shadow-primary/10'
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30',
          parsing && 'cursor-wait opacity-80'
        )}
      >
        <input
          id="csv-file-input"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={onFileInput}
          disabled={parsing}
        />

        <AnimatePresence mode="wait">
          {parsing ? (
            <motion.div
              key="parsing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative mb-6">
                <FileSpreadsheet className="h-16 w-16 text-primary" />
                <Loader2 className="absolute -bottom-2 -right-2 h-8 w-8 text-primary animate-spin bg-background rounded-full p-1" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">Crunching Numbers...</h3>
              <p className="text-muted-foreground mt-2 max-w-[250px]">
                Mapping dimensions and calculating correlations.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center text-center"
            >
              <div className={cn(
                "mb-6 p-4 rounded-full bg-secondary transition-colors duration-300",
                dragging ? "bg-primary/20" : "group-hover:bg-primary/10"
              )}>
                <Upload className={cn(
                  "h-10 w-10 transition-colors duration-300",
                  dragging ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                )} />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">
                {dragging ? 'Drop it here!' : 'Import Dataset'}
              </h3>
              <p className="text-muted-foreground mt-2">
                Drag and drop your <span className="font-mono text-foreground font-medium">.csv</span> file
              </p>
              <p className="text-xs text-muted-foreground/60 mt-4 uppercase tracking-widest font-bold">
                Max file size 50MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Toast-style overlay */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-12 flex items-center gap-2 text-destructive text-sm font-medium"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}