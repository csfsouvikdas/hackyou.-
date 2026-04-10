import { Sparkles, BrainCircuit } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { Button } from '@/components/ui/button';
import { generateDataStory } from '@/lib/gemini';

export function AIStoryCard() {
  const { aiStory, aiLoading, csv, setAiStory, setAiLoading } = useDashboardStore();

  const generateStory = async () => {
    if (!csv) return;
    setAiLoading(true);
    
    try {
      const numericSummary = csv.columns
        .filter(c => c.type === 'numeric')
        .map(c => `- ${c.name}: [min: ${c.min}, max: ${c.max}, mean: ${c.mean}, median: ${c.median}]`)
        .join('\n');
      
      const categoricalSummary = csv.columns
        .filter(c => c.type === 'categorical')
        .map(c => `- ${c.name}: Top value "${c.top5?.[0]?.value}" (${c.top5?.[0]?.count} occurrences)`)
        .join('\n');

      const context = `
        File: ${csv.fileName}
        Total Rows: ${csv.rowCount}
        Columns: ${csv.headers.join(', ')}
        
        Numeric Distribution:
        ${numericSummary}
        
        Key Categories:
        ${categoricalSummary}
      `;

      const story = await generateDataStory(context);
      setAiStory(story);
    } catch (e) {
      console.error('AI generation failed', e);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border bg-card/50 backdrop-blur-sm overflow-hidden animate-fade-in shadow-xl shadow-primary/5">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-primary/5">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary animate-pulse" />
          <h3 className="font-bold tracking-tight">AI Analytical Narrative</h3>
        </div>
        <Button
          size="sm"
          className="rounded-xl shadow-lg shadow-primary/20"
          onClick={generateStory}
          disabled={aiLoading || !csv}
        >
          {aiLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 bg-white rounded-full animate-ping" />
              Thinking...
            </span>
          ) : 'Ask Gemini'}
        </Button>
      </div>
      <div className="p-6">
        {aiStory ? (
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-foreground/90 italic">
            "{aiStory}"
          </div>
        ) : (
          <div className="flex flex-col items-center py-8 text-center">
            <Sparkles className="h-10 w-10 text-muted-foreground/30 mb-4" />
            <p className="text-sm text-muted-foreground max-w-[280px]">
              Our Gemini-powered engine can synthesize complex data patterns into readable insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
