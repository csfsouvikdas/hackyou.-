import { motion } from "framer-motion";
import { ArrowLeft, Shield, Lock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans p-6 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Button 
          variant="ghost" 
          className="mb-8 hover:bg-primary/5 transition-colors" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4 text-primary">
            <Shield className="h-8 w-8" />
            <h1 className="text-4xl font-black tracking-tight">Terms and Conditions</h1>
          </div>
          <p className="text-slate-500 font-medium">Last updated: April 10, 2026</p>
        </header>

        <div className="space-y-10 prose prose-slate max-w-none">
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              1. Acceptance of Terms
            </h2>
            <p className="text-slate-600 leading-relaxed">
              By accessing and using VIZI, you agree to be bound by these Terms and Conditions. Our platform provides AI-powered data visualization services ("Services") designed to help you analyze CSV data. If you do not agree with any part of these terms, you must not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              2. Data Privacy & Security
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We prioritize your data security. Most data processing occurs client-side in your browser. When you use AI features, snippets of your data are processed by Google Gemini AI. We do not store your CSV contents on our servers unless explicitly requested for persistent dashboard features.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>You retain all ownership rights to your data.</li>
              <li>We do not sell your personal or professional data to third parties.</li>
              <li>AI processing is subject to Google's generative AI terms of service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              3. User Responsibilities
            </h2>
            <p className="text-slate-600 leading-relaxed">
              You are responsible for the content of the data you upload. You must not upload sensitive personal data, prohibited content, or data that violates any third-party intellectual property rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">4. Limitation of Liability</h2>
            <p className="text-slate-600 leading-relaxed italic">
              VIZI provides analytical insights based on AI models. While we strive for accuracy, AI-generated narratives and summaries should be used for informational purposes only and are not a substitute for professional data analysis. We are not liable for any business decisions made based on these insights.
            </p>
          </section>

          <section className="pt-12 border-t border-slate-200 text-center">
            <p className="text-slate-500 text-sm">
              If you have any questions about these terms, please contact us at support@vizi.ai
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
