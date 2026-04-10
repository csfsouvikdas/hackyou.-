import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Mail, Chrome, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin }
        });
        if (error) throw error;
        toast.success("Registration successful! Check your email for verification.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/");
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Button 
          variant="ghost" 
          className="mb-8 group" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Button>

        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="VIZI" className="h-12 w-auto mb-2" />
          <span className="text-2xl font-black tracking-tighter">VIZI</span>
        </div>

        <Card className="border-none shadow-2xl shadow-primary/5 bg-background/80 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1 text-center pt-8">
            <CardTitle className="text-3xl font-bold tracking-tight">
              {isSignUp ? "Create account" : "Welcome back"}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              {isSignUp ? "Join the premium data storyteller platform" : "Sign in to manage your dashboards"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 px-8">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-12 rounded-2xl border-muted-foreground/20 hover:bg-secondary transition-colors"
                onClick={() => handleOAuthLogin('github')}
              >
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </Button>
              <Button 
                variant="outline" 
                className="h-12 rounded-2xl border-muted-foreground/20 hover:bg-secondary transition-colors"
                onClick={() => handleOAuthLogin('google')}
              >
                <Chrome className="mr-2 h-5 w-5" />
                Google
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted-foreground/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-4 text-muted-foreground font-semibold">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleAuth} className="grid gap-4">
              <div className="grid gap-3">
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-2xl bg-secondary/50 border-none px-4 focus-visible:ring-primary"
                  required
                />
                <Input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-2xl bg-secondary/50 border-none px-4 focus-visible:ring-primary"
                  required
                  min={6}
                />
              </div>
              <Button 
                type="submit" 
                className="h-12 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Mail className="mr-2 h-5 w-5" />}
                {isSignUp ? "Sign Up" : "Sign In"}
              </Button>
            </form>

            <div className="text-center">
              <button 
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-primary hover:underline font-medium"
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/30 border-t flex flex-col items-center py-6">
            <p className="text-xs text-muted-foreground text-center max-w-[280px] leading-relaxed">
              By clicking continue, you agree to our <button onClick={() => navigate('/terms')} className="underline cursor-pointer hover:text-primary transition-colors">Terms of Service</button> and <span className="underline cursor-default">Privacy Policy</span>.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
