"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Target, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: string) => {
    setOauthLoading(provider);
    setError(null);
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch {
      setError(`Failed to sign in with ${provider}.`);
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-hcg-bg flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-hcg-gold/5 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,184,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,184,0,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 bg-hcg-gold rounded-xl flex items-center justify-center group-hover:bg-hcg-gold-light transition-colors">
              <Target className="w-6 h-6 text-hcg-bg" />
            </div>
            <div className="text-left">
              <p className="font-display font-bold text-lg leading-none tracking-wide">HIGH CALIBER</p>
              <p className="font-display font-bold text-lg leading-none tracking-wide text-hcg-gold">GAMING</p>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="hcg-card rounded-2xl border border-hcg-border p-8">
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl text-white">Welcome back, soldier.</h1>
            <p className="text-gray-500 text-sm mt-2">Sign in to your HCG account to continue competing.</p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-hcg-red/30 bg-hcg-red/10 px-4 py-3 text-sm text-hcg-red">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            {/* Discord */}
            <button
              onClick={() => handleOAuth("discord")}
              disabled={!!oauthLoading}
              className="w-full flex items-center justify-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-white border border-[#5865F2]/40 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oauthLoading === "discord" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg className="w-4 h-4 fill-[#5865F2]" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
              )}
              Continue with Discord
            </button>

            {/* Google */}
            <button
              onClick={() => handleOAuth("google")}
              disabled={!!oauthLoading}
              className="w-full flex items-center justify-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-white border border-hcg-border bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oauthLoading === "google" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              Continue with Google
            </button>

            {/* Twitch */}
            <button
              onClick={() => handleOAuth("twitch")}
              disabled={!!oauthLoading}
              className="w-full flex items-center justify-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-white border border-[#9146FF]/40 bg-[#9146FF]/10 hover:bg-[#9146FF]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oauthLoading === "twitch" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg className="w-4 h-4 fill-[#9146FF]" viewBox="0 0 24 24">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
                </svg>
              )}
              Continue with Twitch
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-hcg-border" />
            <span className="text-xs text-gray-600">or sign in with email</span>
            <div className="flex-1 h-px bg-hcg-border" />
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="soldier@example.com"
                className="hcg-input"
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <Link href="/forgot-password" className="text-xs text-hcg-gold hover:text-hcg-gold-light transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="hcg-input pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-hcg-border bg-hcg-card text-hcg-gold focus:ring-hcg-gold/50 cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="hcg-btn-primary w-full justify-center py-2.5 text-sm font-semibold rounded-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-hcg-gold hover:text-hcg-gold-light font-medium transition-colors">
              Create account
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-600 mt-6">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-gray-400 transition-colors">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="underline hover:text-gray-400 transition-colors">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
