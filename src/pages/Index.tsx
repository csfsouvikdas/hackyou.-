import { useNavigate } from 'react-router-dom';
import { UploadZone } from '@/components/upload/UploadZone';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { ColumnProfilerPanel } from '@/components/profiler/ColumnProfilerPanel';
import { CorrelationPanel } from '@/components/dashboard/CorrelationPanel';
import { AIStoryCard } from '@/components/ai/AIStoryCard';
import { FilterBar } from '@/components/filters/FilterBar';
import { useDashboardStore } from '@/store/dashboardStore';
import { FileSpreadsheet, BarChart3, Columns3, Grid3X3, Sparkles, Upload, LogOut, Download, Settings, User as UserIcon, MousePointer2, BrainCircuit } from 'lucide-react';
import { useState, useCallback } from 'react';
import { parseCSV } from '@/lib/csv/parser';
import Papa from 'papaparse';
import { toast } from 'sonner';
import { generateAutoCharts } from '@/lib/csv/autoLayout';
import { computeCorrelationMatrix } from '@/lib/correlation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

type Tab = 'dashboard' | 'columns' | 'correlations' | 'ai';

const Index = () => {
  const navigate = useNavigate();
  const { csv, setCsv, setCharts, setCorrelationMatrix } = useDashboardStore();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const handleUploadAnother = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const parsed = await parseCSV(file);
    setCsv(parsed);
    setCharts(generateAutoCharts(parsed.columns));
    setCorrelationMatrix(computeCorrelationMatrix(parsed.rows, parsed.columns));
  }, [setCsv, setCharts, setCorrelationMatrix]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleDownloadCSV = () => {
    if (!csv) return;
    const csvContent = Papa.unparse(csv.rows);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `cleaned_${csv.fileName}`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloading cleaned CSV...");
  };

  if (!csv) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#fafafa]">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="absolute top-6 right-6 z-10">
          <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground rounded-full px-5 bg-white/50 backdrop-blur-sm border shadow-sm"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border shadow-sm text-primary text-xs font-bold mb-6 hover:scale-105 transition-transform cursor-default">
            <Sparkles className="h-4 w-4 fill-primary/20" />
            The Future of Data Visualization
          </div>
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="VIZI" className="h-16 w-auto" />
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-4 text-slate-900 leading-[1.1]">
            Visualize any CSV <br/>
            <span className="text-primary bg-clip-text">instantly.</span>
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto text-lg font-medium leading-relaxed">
            Automatic data cleaning, intelligent chart generation, and Gemini-powered insights in one click.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-2xl z-10 group"
        >
          <div className="bg-white/70 backdrop-blur-2xl p-8 rounded-[40px] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-500 group-hover:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.15)] group-hover:-translate-y-1">
            <UploadZone />
            
            <div className="mt-10 pt-10 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: BarChart3, label: '12 Charts', color: 'bg-blue-500/10 text-blue-600' },
                { icon: Columns3, label: 'Profiling', color: 'bg-purple-500/10 text-purple-600' },
                { icon: Grid3X3, label: 'Matrix', color: 'bg-emerald-500/10 text-emerald-600' },
                { icon: BrainCircuit, label: 'AI Story', color: 'bg-orange-500/10 text-orange-600', fallback: Sparkles },
              ].map(({ icon: Icon, label, color, fallback: Fallback }) => (
                <div key={label} className="flex flex-col items-center text-center">
                  <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-3 transition-transform hover:scale-110", color)}>
                     {Icon ? <Icon className="h-6 w-6" /> : <Fallback className="h-6 w-6" />}
                  </div>
                  <span className="text-xs font-bold text-slate-700">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mt-12 flex items-center gap-2 text-slate-400 font-medium">
          <MousePointer2 className="h-4 w-4 animate-bounce" />
          <span className="text-sm">Drag and drop your file to begin</span>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
    { id: 'dashboard', label: 'Charts', icon: BarChart3 },
    { id: 'columns', label: 'Columns', icon: Columns3 },
    { id: 'correlations', label: 'Correlations', icon: Grid3X3 },
    { id: 'ai', label: 'Insights', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] relative overflow-hidden">
      {/* Decorative Logo Background */}
      <div className="absolute top-[-5%] right-[-5%] opacity-[0.06] pointer-events-none z-0">
        <img src="/logo.png" alt="" className="w-96 h-96 transform rotate-12" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4 truncate">
            <img src="/logo.png" alt="VIZI" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 truncate">{csv.fileName}</h2>
                {csv.fileName.startsWith('merged_') && (
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                    Merged Output
                  </span>
                )}
              </div>
              <p className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate">
                {csv.rowCount.toLocaleString()} Total Rows · {csv.columns.length} Merged Columns
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden lg:flex h-9 rounded-xl font-bold text-xs border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
              onClick={handleDownloadCSV}
            >
              <Download className="h-4 w-4 mr-2 text-primary" />
              Download
            </Button>
            
            <label className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 text-[10px] sm:text-xs font-bold rounded-xl border bg-white hover:bg-slate-50 cursor-pointer transition-all active:scale-95 shadow-sm border-slate-200">
              <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              <span className="hidden xs:inline">New CSV</span>
              <span className="xs:hidden">New</span>
              <input type="file" accept=".csv" className="hidden" onChange={handleUploadAnother} />
            </label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-xl p-0 overflow-hidden border border-slate-200">
                  <Avatar className="h-10 w-10 rounded-xl">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase rounded-xl">
                      User
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-2xl p-2 mt-2" align="end" forceMount shadow="xl">
                <DropdownMenuLabel className="font-normal px-2 py-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none">Active Session</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">
                      Personal Workspace
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="opacity-50" />
                <DropdownMenuItem className="rounded-xl cursor-default py-2" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4 text-destructive" />
                  <span className="text-destructive font-semibold">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pb-2 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-300 whitespace-nowrap flex-shrink-0',
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <tab.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        {activeTab === 'dashboard' && (
          <div className="px-6 border-t border-slate-100 bg-slate-50/30">
            <FilterBar />
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 p-6 max-w-[1600px] mx-auto w-full">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <DashboardGrid />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AIStoryCard />
              <CorrelationPanel />
            </div>
          </div>
        )}
        {activeTab === 'columns' && <ColumnProfilerPanel />}
        {activeTab === 'correlations' && <CorrelationPanel />}
        {activeTab === 'ai' && <AIStoryCard />}
      </main>
    </div>
  );
};

export default Index;
