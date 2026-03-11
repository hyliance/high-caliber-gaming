"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Target, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Check } from "lucide-react";
import { z } from "zod";

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Brazil", "Mexico", "South Korea", "Japan", "Sweden",
  "Norway", "Denmark", "Netherlands", "Poland", "Spain", "Italy",
  "Portugal", "Argentina", "Chile", "Other",
];

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  username: z
    .string()
    .min(3, "Gamer tag must be at least 3 characters")
    .max(20, "Gamer tag must be 20 characters or less")
    .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, underscores, and hyphens allowed"),
  displayName: z.string().min(2, "Display name must be at least 2 characters").max(32, "Display name too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  country: z.string().min(1, "Please select a country"),
  terms: z.literal(true, { error: "You must accept the terms of service" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof registerSchema>;
type FieldErrors = Partial<Record<keyof FormData, string>>;

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
    { label: "Special character", pass: /[^a-zA-Z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const strengthColor =
    score <= 1 ? "bg-hcg-red" : score === 2 ? "bg-orange-500" : score === 3 ? "bg-yellow-500" : "bg-green-500";

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${i <= score ? strengthColor : "bg-hcg-border"}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {checks.map((c) => (
          <span key={c.label} className={`text-xs flex items-center gap-1 ${c.pass ? "text-green-400" : "text-gray-600"}`}>
            {c.pass ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 inline-block" />}
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    displayName: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    country: "",
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setErrors({});

    const parsed = registerSchema.safeParse({
      ...formData,
      terms: formData.terms as true,
    });

    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      parsed.error.errors.forEach((err) => {
        const key = err.path[0] as keyof FormData;
        if (!fieldErrors[key]) fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          displayName: formData.displayName,
          password: formData.password,
          dateOfBirth: formData.dateOfBirth,
          country: formData.country,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Registration failed. Please try again.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: string) => {
    setOauthLoading(provider);
    setServerError(null);
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch {
      setServerError(`Failed to sign up with ${provider}.`);
      setOauthLoading(null);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-hcg-bg flex items-center justify-center px-4">
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="font-display font-bold text-2xl text-white mb-2">Account Created!</h2>
          <p className="text-gray-400">Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hcg-bg flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-hcg-gold/5 blur-[120px]" />
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

        <div className="hcg-card rounded-2xl border border-hcg-border p-8">
          <div className="mb-6">
            <h1 className="font-display font-bold text-3xl text-white">Join the ranks.</h1>
            <p className="text-gray-500 text-sm mt-2">Create your free HCG account and start competing today.</p>
          </div>

          {serverError && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-hcg-red/30 bg-hcg-red/10 px-4 py-3 text-sm text-hcg-red">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {serverError}
            </div>
          )}

          {/* OAuth */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuth("discord")}
              disabled={!!oauthLoading}
              className="w-full flex items-center justify-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-white border border-[#5865F2]/40 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 transition-all disabled:opacity-50"
            >
              {oauthLoading === "discord" ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <svg className="w-4 h-4 fill-[#5865F2]" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
              )}
              Sign up with Discord
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleOAuth("google")}
                disabled={!!oauthLoading}
                className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white border border-hcg-border bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50"
              >
                {oauthLoading === "google" ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                Google
              </button>
              <button
                onClick={() => handleOAuth("twitch")}
                disabled={!!oauthLoading}
                className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white border border-[#9146FF]/40 bg-[#9146FF]/10 hover:bg-[#9146FF]/20 transition-all disabled:opacity-50"
              >
                {oauthLoading === "twitch" ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <svg className="w-4 h-4 fill-[#9146FF]" viewBox="0 0 24 24">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
                  </svg>
                )}
                Twitch
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-hcg-border" />
            <span className="text-xs text-gray-600">or register with email</span>
            <div className="flex-1 h-px bg-hcg-border" />
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="your@email.com"
                className={`hcg-input ${errors.email ? "border-hcg-red/50 focus:ring-hcg-red/30" : ""}`}
                autoComplete="email"
              />
              {errors.email && <p className="mt-1 text-xs text-hcg-red">{errors.email}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Gamer Tag <span className="text-gray-600 text-xs font-normal">(unique username)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">@</span>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => update("username", e.target.value)}
                  placeholder="ProSniper"
                  className={`hcg-input pl-7 ${errors.username ? "border-hcg-red/50" : ""}`}
                  autoComplete="username"
                  maxLength={20}
                />
              </div>
              {errors.username && <p className="mt-1 text-xs text-hcg-red">{errors.username}</p>}
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Display Name <span className="text-gray-600 text-xs font-normal">(shown publicly)</span>
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => update("displayName", e.target.value)}
                placeholder="Pro Sniper"
                className={`hcg-input ${errors.displayName ? "border-hcg-red/50" : ""}`}
                maxLength={32}
              />
              {errors.displayName && <p className="mt-1 text-xs text-hcg-red">{errors.displayName}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="••••••••"
                  className={`hcg-input pr-10 ${errors.password ? "border-hcg-red/50" : ""}`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-hcg-red">{errors.password}</p>}
              <PasswordStrength password={formData.password} />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  placeholder="••••••••"
                  className={`hcg-input pr-10 ${errors.confirmPassword ? "border-hcg-red/50" : ""}`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-hcg-red">{errors.confirmPassword}</p>}
            </div>

            {/* DOB + Country */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => update("dateOfBirth", e.target.value)}
                  className={`hcg-input ${errors.dateOfBirth ? "border-hcg-red/50" : ""}`}
                  max={new Date(Date.now() - 13 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                />
                {errors.dateOfBirth && <p className="mt-1 text-xs text-hcg-red">{errors.dateOfBirth}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => update("country", e.target.value)}
                  className={`hcg-input ${errors.country ? "border-hcg-red/50" : ""}`}
                >
                  <option value="">Select...</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.country && <p className="mt-1 text-xs text-hcg-red">{errors.country}</p>}
              </div>
            </div>

            {/* Terms */}
            <div>
              <div className="flex items-start gap-3">
                <input
                  id="terms"
                  type="checkbox"
                  checked={formData.terms}
                  onChange={(e) => update("terms", e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-hcg-border bg-hcg-card text-hcg-gold focus:ring-hcg-gold/50 cursor-pointer"
                />
                <label htmlFor="terms" className="text-sm text-gray-400 cursor-pointer leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-hcg-gold hover:underline" target="_blank">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-hcg-gold hover:underline" target="_blank">Privacy Policy</Link>.
                  I confirm I am at least 13 years old.
                </label>
              </div>
              {errors.terms && <p className="mt-1 text-xs text-hcg-red">{errors.terms}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="hcg-btn-primary w-full justify-center py-2.5 text-sm font-semibold rounded-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account — Free"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-hcg-gold hover:text-hcg-gold-light font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
