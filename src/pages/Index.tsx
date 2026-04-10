import { UploadZone } from '@/components/upload/UploadZone';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { ColumnProfilerPanel } from '@/components/profiler/ColumnProfilerPanel';
import { CorrelationPanel } from '@/components/dashboard/CorrelationPanel';
import { AIStoryCard } from '@/components/ai/AIStoryCard';
import { FilterBar } from '@/components/filters/FilterBar';
import { useDashboardStore } from '@/store/dashboardStore';
import { FileSpreadsheet, BarChart3, Columns3, Grid3X3, Sparkles, Upload } from 'lucide-react';
import { useState, useCallback } from 'react';
import { parseCSV } from '@/lib/csv/parser';
import { generateAutoCharts } from '@/lib/csv/autoLayout';
import { computeCorrelationMatrix } from '@/lib/correlation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';

type Tab = 'dashboard' | 'columns' | 'correlations' | 'ai';

const Index = () => {
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
  };

  if (!csv) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <BarChart3 className="h-4 w-4" />
            CSV Dashboard Builder
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Visualize any CSV instantly</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Drop a CSV file to auto-generate charts, column profiles, correlations, and AI-powered insights.
          </p>
        </div>
        <div className="w-full max-w-lg animate-fade-in" style={{ animationDelay: '100ms' }}>
          <UploadZone />
        </div>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl animate-fade-in" style={{ animationDelay: '200ms' }}>
          {[
            { icon: BarChart3, label: '6 Chart Types', desc: 'Auto-generated' },
            { icon: Columns3, label: 'Column Profiler', desc: 'Type detection' },
            { icon: Grid3X3, label: 'Correlations', desc: 'Pearson matrix' },
            { icon: Sparkles, label: 'AI Insights', desc: 'Data stories' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col items-center text-center p-3 rounded-lg bg-card border">
              <Icon className="h-5 w-5 text-primary mb-2" />
              <span className="text-xs font-medium">{label}</span>
              <span className="text-xs text-muted-foreground">{desc}</span>
            </div>
          ))}
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
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-sm font-semibold leading-none">{csv.fileName}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {csv.rowCount.toLocaleString()} rows · {csv.columns.length} columns
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border bg-card hover:bg-muted cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm">
              <Upload className="h-3.5 w-3.5 text-primary" />
              New CSV
              <input type="file" accept=".csv" className="hidden" onChange={handleUploadAnother} />
            </label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 overflow-hidden border">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold uppercase">
                      User
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-2xl p-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none">My Account</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      Manage your preferences
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem className="rounded-xl cursor-not-allowed opacity-50">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl cursor-not-allowed opacity-50">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem className="rounded-xl text-destructive focus:bg-destructive/10 cursor-pointer" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        {activeTab === 'dashboard' && (
          <div className="px-4 border-t">
            <FilterBar />
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 p-4">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <DashboardGrid />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
