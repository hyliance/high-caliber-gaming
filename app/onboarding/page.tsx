"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Target, CheckCircle2, XCircle, Loader2 } from "lucide-react";

const GAMERTAG_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;

type AvailabilityStatus = "idle" | "checking" | "available" | "taken" | "invalid";

export default function OnboardingPage() {
  const router = useRouter();
  const { update } = useSession();

  const [gamerTag, setGamerTag] = useState("");
  const [status, setStatus] = useState<AvailabilityStatus>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = useCallback(async (tag: string) => {
    if (!tag) { setStatus("idle"); return; }
    if (!GAMERTAG_REGEX.test(tag)) { setStatus("invalid"); return; }

    setStatus("checking");
    try {
      const res = await fetch(`/api/onboarding?tag=${encodeURIComponent(tag)}`);
      const data = await res.json();
      setStatus(data.available ? "available" : "taken");
    } catch {
      setStatus("idle");
    }
  }, []);

  // Debounced availability check
  useEffect(() => {
    const timeout = setTimeout(() => checkAvailability(gamerTag), 400);
    return () => clearTimeout(timeout);
  }, [gamerTag, checkAvailability]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strip spaces, keep everything else for the regex to validate
    setGamerTag(e.target.value.replace(/\s/g, ""));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "available" || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gamerTag }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      // Refresh the JWT so it picks up the new gamerTag from the DB
      await update();
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusIcon = {
    checking: <Loader2 className="w-4 h-4 animate-spin text-gray-500" />,
    available: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    taken: <XCircle className="w-4 h-4 text-hcg-red" />,
    invalid: <XCircle className="w-4 h-4 text-hcg-red" />,
    idle: null,
  }[status];

  const statusText = {
    checking: null,
    available: <span className="text-green-500">✓ Available</span>,
    taken: <span className="text-hcg-red">✗ Already taken</span>,
    invalid: <span className="text-hcg-red">✗ 3–20 chars: letters, numbers, _ or -</span>,
    idle: <span>3–20 characters: letters, numbers, _ or -</span>,
  }[status];

  return (
    <div className="min-h-screen bg-hcg-bg flex items-center justify-center px-4 py-12">
      {/* Background */}
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
          <div className="inline-flex items-center gap-3">
            <div className="w-10 h-10 bg-hcg-gold rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-hcg-bg" />
            </div>
            <div className="text-left">
              <p className="font-display font-bold text-lg leading-none tracking-wide">HIGH CALIBER</p>
              <p className="font-display font-bold text-lg leading-none tracking-wide text-hcg-gold">GAMING</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="hcg-card rounded-2xl border border-hcg-border p-8">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-hcg-gold/30 bg-hcg-gold/10 px-3 py-1 text-xs text-hcg-gold font-medium tracking-widest mb-4">
              ONE LAST STEP
            </div>
            <h1 className="font-display font-bold text-3xl text-white">Choose your GamerTag</h1>
            <p className="text-gray-500 text-sm mt-2">
              Your unique identity on HCG. This is how other players will know you in matches, ladders, and tournaments.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                GamerTag
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={gamerTag}
                  onChange={handleChange}
                  placeholder="xX_Sniper_Xx"
                  maxLength={20}
                  autoComplete="off"
                  autoFocus
                  className="hcg-input pr-10"
                />
                {statusIcon && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {statusIcon}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs text-gray-500">{statusText}</p>
                <p className="text-xs text-gray-600">{gamerTag.length}/20</p>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-hcg-red/30 bg-hcg-red/10 px-4 py-3 text-sm text-hcg-red">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={status !== "available" || isSubmitting}
              className="hcg-btn-primary w-full justify-center py-2.5 text-sm font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Setting up your account...
                </>
              ) : (
                "Enter the Arena →"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Your GamerTag can be changed later in settings.
        </p>
      </div>
    </div>
  );
}
