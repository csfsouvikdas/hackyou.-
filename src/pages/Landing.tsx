import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BarChart3, Sparkles, Shield, Rocket, ArrowRight, Github } from "lucide-react";
import { useEffect, useRef } from "react";

// ── CSV → Chart animation component ──────────────────────────────────────────
function CsvToChartAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // Responsive sizing
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const DURATION = 4000; // total loop ms

    // CSV data
    const rows = ["Month,Revenue", "Jan,$12k", "Feb,$18k", "Mar,$24k", "Apr,$31k", "May,$42k"];
    const bars = [
      { label: "Jan", h: 0.29, color: "#378ADD" },
      { label: "Feb", h: 0.43, color: "#378ADD" },
      { label: "Mar", h: 0.57, color: "#1D9E75" },
      { label: "Apr", h: 0.74, color: "#1D9E75" },
      { label: "May", h: 1.00, color: "#1D9E75" },
    ];

    function easeInOut(t: number) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function draw(ts: number) {
      if (!startRef.current) startRef.current = ts;
      const elapsed = (ts - startRef.current) % DURATION;
      const rawT = elapsed / DURATION; // 0→1 loop

      ctx.clearRect(0, 0, W, H);

      const phase = rawT < 0.35 ? "csv" : rawT < 0.65 ? "morph" : "chart";
      const morphT = phase === "morph" ? easeInOut((rawT - 0.35) / 0.30) : phase === "chart" ? 1 : 0;

      const chartLeft = W * 0.1;
      const chartRight = W * 0.9;
      const chartBottom = H * 0.82;
      const chartTop = H * 0.12;
      const chartH = chartBottom - chartTop;
      const barCount = bars.length;
      const slotW = (chartRight - chartLeft) / barCount;
      const barW = slotW * 0.55;

      // ── Draw CSV rows ─────────────────────────────────────────────────────
      const textAlpha = phase === "csv" ? 1 : 1 - morphT;
      if (textAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = textAlpha;
        const rowH = H * 0.11;
        const startY = H * 0.08;

        rows.forEach((row, i) => {
          const y = startY + i * rowH;
          const isHeader = i === 0;

          // row background
          ctx.fillStyle = isHeader ? "rgba(55,138,221,0.12)" : i % 2 === 0 ? "rgba(128,128,128,0.05)" : "transparent";
          ctx.beginPath();
          ctx.roundRect(W * 0.08, y - rowH * 0.38, W * 0.84, rowH * 0.78, 4);
          ctx.fill();

          // row text
          const [col1, col2] = row.split(",");
          ctx.font = `${isHeader ? "600" : "400"} ${Math.round(H * 0.085)}px system-ui`;
          ctx.fillStyle = isHeader ? "#378ADD" : "#888";
          ctx.textAlign = "left";
          ctx.fillText(col1, W * 0.14, y + rowH * 0.1);
          ctx.fillStyle = isHeader ? "#378ADD" : "#1D9E75";
          ctx.textAlign = "right";
          ctx.fillText(col2, W * 0.88, y + rowH * 0.1);
        });
        ctx.restore();
      }

      // ── Draw bars ─────────────────────────────────────────────────────────
      if (morphT > 0) {
        ctx.save();
        ctx.globalAlpha = morphT;

        // axes
        ctx.strokeStyle = "rgba(128,128,128,0.25)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(chartLeft, chartTop);
        ctx.lineTo(chartLeft, chartBottom);
        ctx.lineTo(chartRight, chartBottom);
        ctx.stroke();

        bars.forEach((bar, i) => {
          const px = chartLeft + i * slotW + (slotW - barW) / 2;
          const targetH = bar.h * chartH;
          const currentH = targetH * morphT;
          const py = chartBottom - currentH;

          // Bar rect
          ctx.fillStyle = bar.color;
          ctx.beginPath();
          if (currentH > 4) {
            ctx.roundRect(px, py, barW, currentH, [4, 4, 0, 0]);
          } else {
            ctx.rect(px, py, barW, currentH);
          }
          ctx.fill();

          // Labels
          ctx.fillStyle = "#888";
          ctx.font = `400 ${Math.round(H * 0.06)}px system-ui`;
          ctx.textAlign = "center";
          ctx.fillText(bar.label, px + barW / 2, chartBottom + H * 0.08);
        });

        ctx.restore();
      }

      frameRef.current = requestAnimationFrame(draw);
    }

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="relative w-full aspect-[4/3] max-w-md mx-auto bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-10 border-b border-slate-100 flex items-center px-4 gap-2 bg-slate-50/50 backdrop-blur-sm">
        <div className="w-3 h-3 rounded-full bg-slate-200" />
        <div className="w-3 h-3 rounded-full bg-slate-200" />
        <div className="w-3 h-3 rounded-full bg-slate-200" />
      </div>
      <canvas ref={canvasRef} className="w-full h-full pt-10" />
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans overflow-x-hidden selection:bg-primary/20">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/5 blur-[100px] rounded-full mix-blend-multiply" />
      </div>

      {/* Decorative Logo in Top Right */}
      <div className="absolute top-0 right-0 p-8 z-0 opacity-[0.06] pointer-events-none overflow-hidden hidden lg:block">
        <img src="/logo.png" alt="" className="w-96 h-96 -mr-20 -mt-20 transform rotate-12" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-slate-200/50 sticky top-0 z-50 bg-white/70 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="VIZI" className="h-8 w-auto" />
            <span className="font-bold text-xl tracking-tighter text-slate-900 hover:text-primary transition-colors cursor-pointer">
              VIZI
            </span>
          </div>


          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              className="text-slate-600 font-bold hover:text-primary hover:bg-primary/5 rounded-xl px-4"
              onClick={() => navigate("/auth")}
            >
              Login
            </Button>
            <Button
              className="rounded-xl px-6 h-10 text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 bg-primary text-white"
              onClick={() => navigate("/auth")}
            >
              Sign up
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col justify-center px-6 pt-20 pb-32">
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">

            {/* Left Column: Copy */}
            <div className="flex flex-col items-start text-left max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600 mb-8 shadow-sm backdrop-blur-md"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="tracking-tight uppercase">Data Storting</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.05] text-slate-900"
              >
                From RAW CSV to <span className="text-primary bg-clip-text">Insights in 10s</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed max-w-lg font-medium"
              >
                Simply drop a CSV file and watch as our AI instantly generates interactive charts, profiles columns, and extracts key insights. No coding required.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="rounded-2xl px-10 h-16 text-base font-bold w-full sm:w-auto shadow-xl shadow-primary/25 transition-all hover:scale-105 active:scale-95 group"
                  onClick={() => navigate("/auth")}
                >
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>

              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="mt-12 flex flex-wrap items-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Secure Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Rocket className="h-4 w-4" />
                  <span>Instant Results</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:ml-auto w-full relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-emerald-500/10 blur-3xl rounded-full -z-10" />
              <div className="relative p-1 bg-gradient-to-br from-slate-200 to-transparent rounded-[32px] shadow-2xl">
                <CsvToChartAnimation />
              </div>
            </motion.div>

          </div>
        </main>

        <footer className="px-6 py-12 border-t border-slate-200/50 bg-white/50 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="VIZI" className="h-6 w-auto" />
              <span className="font-bold text-lg tracking-tighter text-slate-900">VIZI</span>
              <span className="text-xs text-slate-400 ml-2">© 2026 VIZI AI. All rights reserved.</span>
            </div>
            <div className="flex gap-8 text-sm font-semibold text-slate-500">
              <button onClick={() => navigate('/terms')} className="hover:text-primary transition-colors">Terms</button>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}