import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BarChart3, Sparkles, Shield, Rocket, ArrowRight, Github, Mail } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 drop-shadow-sm">
          <div className="p-2 bg-primary rounded-xl">
            <BarChart3 className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">DataStoryteller</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/auth")}>Login</Button>
          <Button onClick={() => navigate("/auth")}>Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 overflow-hidden">
        <section className="relative pt-20 pb-32 px-6">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8"
            >
              <Sparkles className="h-4 w-4" />
              Now powered by Gemini AI
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent pb-1"
            >
              Turn Any CSV Into <br />
              <span className="text-primary">Stunning Visual Stories</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
            >
              The ultimate no-code dashboard builder. Automatically profile columns, 
              detect correlations, and generate AI insights in seconds.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
            >
              <Button size="lg" className="flex-1 h-14 text-lg rounded-2xl group" onClick={() => navigate("/auth")}>
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Feature Grid */}
            <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
              {[
                { icon: Rocket, title: "Instant Visuals", desc: "Drop a CSV and watch 12+ premium charts generate automatically." },
                { icon: Sparkles, title: "AI Narratives", desc: "Gemini AI analyzes your data to find the 'why' behind the numbers." },
                { icon: Shield, title: "Secure & Private", desc: "Enterprise-grade auth with Google, GitHub, and email protection." },
              ].map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="p-8 rounded-3xl bg-card border hover:border-primary/50 transition-colors text-left group"
                >
                  <div className="p-3 bg-secondary rounded-2xl w-fit mb-6 group-hover:bg-primary/10 transition-colors">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 grayscale brightness-50 opacity-50">
            <BarChart3 className="h-5 w-5" />
            <span className="font-bold">DataStoryteller</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2026 Premium Data Visualizer. Built with Supabase & Gemini.
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Github className="h-5 w-5 hover:text-foreground cursor-pointer" />
            <Mail className="h-5 w-5 hover:text-foreground cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
}
