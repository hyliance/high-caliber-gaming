"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle, ChevronRight, ChevronLeft, Clock, DollarSign, Star, Shield } from "lucide-react";

const STEPS = ["Personal Info", "Game Expertise", "Coaching Profile", "Review & Submit"];

const GAMES = ["Call of Duty", "Valorant", "Apex Legends", "Rocket League", "CS2", "Fortnite", "League of Legends", "Overwatch 2", "Halo Infinite", "Warzone"];
const SESSION_TYPES = [
  { id: "VOD_REVIEW", label: "VOD Review", desc: "Analyze recorded gameplay footage" },
  { id: "LIVE_1ON1", label: "Live 1-on-1", desc: "Real-time coaching during gameplay" },
  { id: "GROUP_SESSION", label: "Group Session", desc: "Coach multiple students at once" },
  { id: "STRATEGY_BREAKDOWN", label: "Strategy Breakdown", desc: "Deep-dive into game strategies" },
  { id: "REPLAY_ANALYSIS", label: "Replay Analysis", desc: "Review competitive match replays" },
];
const EXPERIENCE_LEVELS = ["Amateur", "Semi-Pro", "Professional", "Former Pro"];

export default function BecomeACoachPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullLegalName: "", country: "", gamingAccounts: [] as string[],
    primaryTitles: [] as string[],
    titleExperience: {} as Record<string, string>,
    achievements: "",
    biography: "",
    sessionTypes: [] as string[],
    portfolioUrls: [""],
    agreedToTerms: false,
    agreedToRevShare: false,
  });

  const updateForm = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));
  const toggleArray = (key: string, val: string) => {
    setForm((f) => {
      const arr = f[key as keyof typeof f] as string[];
      return { ...f, [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] };
    });
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-400" />
        </div>
        <h2 className="text-2xl font-display font-bold mb-2">Application Submitted!</h2>
        <p className="text-hcg-muted mb-6">Your coach application has been received. Our Head Administrators will review your credentials and respond within 5–7 business days. You'll receive an in-app notification and email once a decision is made.</p>
        <div className="hcg-card text-left space-y-2 mb-6">
          <p className="text-xs text-hcg-muted font-semibold uppercase">What Happens Next</p>
          {["Application reviewed by Head Admin", "Credential verification (1–3 days)", "Decision notified via email & in-app", "Coach profile activated upon approval"].map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 rounded-full border border-hcg-gold/30 text-hcg-gold text-xs flex items-center justify-center">{i + 1}</div>
              {s}
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={() => window.location.href = "/coaching"}>Back to Marketplace</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Program benefits */}
      <Card className="border-hcg-gold/20 bg-gradient-to-br from-hcg-gold/5 to-hcg-bg">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Award size={18} className="text-hcg-gold" />
            <h2 className="font-display font-bold text-lg">Become a High Caliber Coach</h2>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            {[
              { icon: DollarSign, label: "80% Revenue Share", desc: "Keep the majority of every session" },
              { icon: Shield, label: "Verified Status", desc: "Credential badge on your profile" },
              { icon: Star, label: "Top Placement", desc: "Featured in the coaching marketplace" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="text-center">
                <div className="w-8 h-8 rounded-lg bg-hcg-gold/10 flex items-center justify-center mx-auto mb-1">
                  <Icon size={14} className="text-hcg-gold" />
                </div>
                <p className="font-semibold">{label}</p>
                <p className="text-hcg-muted">{desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step progress */}
      <div className="flex items-center gap-1">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-1 flex-1">
            <div className={`flex items-center gap-1.5 text-xs font-medium ${i <= step ? "text-hcg-gold" : "text-hcg-muted"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${i < step ? "bg-hcg-gold border-hcg-gold text-hcg-bg" : i === step ? "border-hcg-gold text-hcg-gold" : "border-hcg-border text-hcg-muted"}`}>
                {i < step ? <CheckCircle size={12} /> : i + 1}
              </div>
              <span className="hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 ${i < step ? "bg-hcg-gold/50" : "bg-hcg-border"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[step]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step 0: Personal Info */}
          {step === 0 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-hcg-muted font-medium">Full Legal Name *</label>
                  <input className="hcg-input" value={form.fullLegalName} onChange={(e) => updateForm("fullLegalName", e.target.value)} placeholder="As on government ID" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-hcg-muted font-medium">Country of Residence *</label>
                  <select className="hcg-input" value={form.country} onChange={(e) => updateForm("country", e.target.value)}>
                    <option value="">Select country</option>
                    {["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "South Korea", "Brazil", "Mexico", "Japan"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-hcg-muted font-medium">Linked Gaming Accounts</label>
                <p className="text-xs text-hcg-muted">Connecting accounts helps verify your credentials.</p>
                <div className="grid grid-cols-2 gap-2">
                  {["PlayStation Network", "Xbox Live", "Steam", "Battle.net", "Riot Games", "Epic Games"].map((platform) => (
                    <div key={platform} className="flex items-center justify-between p-2 rounded-lg border border-hcg-border hover:bg-hcg-card-hover text-sm">
                      <span>{platform}</span>
                      <Button size="sm" variant="ghost" className="text-xs h-6">Connect</Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 1: Game Expertise */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <label className="text-xs text-hcg-muted font-medium">Primary Game Titles * (select all that apply)</label>
                <div className="grid grid-cols-2 gap-2">
                  {GAMES.map((g) => (
                    <button
                      key={g}
                      onClick={() => toggleArray("primaryTitles", g)}
                      className={`p-2 rounded-lg border text-sm text-left transition-colors ${form.primaryTitles.includes(g) ? "border-hcg-gold/40 bg-hcg-gold/10 text-hcg-gold" : "border-hcg-border hover:border-hcg-gold/20"}`}
                    >
                      {form.primaryTitles.includes(g) && <CheckCircle size={12} className="inline mr-1.5" />}
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              {form.primaryTitles.length > 0 && (
                <div className="space-y-3">
                  <label className="text-xs text-hcg-muted font-medium">Experience Level per Title *</label>
                  {form.primaryTitles.map((title) => (
                    <div key={title} className="flex items-center justify-between">
                      <span className="text-sm">{title}</span>
                      <select
                        className="hcg-input w-44 h-8 text-xs"
                        value={form.titleExperience[title] ?? ""}
                        onChange={(e) => updateForm("titleExperience", { ...form.titleExperience, [title]: e.target.value })}
                      >
                        <option value="">Select level...</option>
                        {EXPERIENCE_LEVELS.map((l) => <option key={l}>{l}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-1">
                <label className="text-xs text-hcg-muted font-medium">Proof of Achievement *</label>
                <p className="text-xs text-hcg-muted">Tournament placements, ladder rankings, team history, or verified platform records.</p>
                <textarea
                  className="hcg-input h-28 resize-none"
                  placeholder="Describe your competitive achievements (e.g., 'Reached Radiant rank Top 50 in NA in 2025, placed 3rd in HCG Pro League Season 2...')"
                  value={form.achievements}
                  onChange={(e) => updateForm("achievements", e.target.value)}
                />
              </div>
            </>
          )}

          {/* Step 2: Coaching Profile */}
          {step === 2 && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-hcg-muted font-medium">Coaching Biography * (100–1000 words)</label>
                <textarea
                  className="hcg-input h-40 resize-none"
                  placeholder="Describe your coaching philosophy, specialization, what students will learn, and your teaching approach..."
                  value={form.biography}
                  onChange={(e) => updateForm("biography", e.target.value)}
                />
                <p className={`text-xs text-right ${form.biography.length < 100 ? "text-hcg-muted" : "text-green-400"}`}>
                  {form.biography.split(/\s+/).filter(Boolean).length} words
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-hcg-muted font-medium">Session Types You'll Offer *</label>
                <div className="grid grid-cols-1 gap-2">
                  {SESSION_TYPES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => toggleArray("sessionTypes", t.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${form.sessionTypes.includes(t.id) ? "border-hcg-gold/40 bg-hcg-gold/10" : "border-hcg-border hover:border-hcg-gold/20"}`}
                    >
                      <div className={`w-4 h-4 rounded border flex-shrink-0 ${form.sessionTypes.includes(t.id) ? "bg-hcg-gold border-hcg-gold" : "border-hcg-border"}`}>
                        {form.sessionTypes.includes(t.id) && <CheckCircle size={14} className="text-hcg-bg" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t.label}</p>
                        <p className="text-xs text-hcg-muted">{t.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-hcg-muted font-medium">Portfolio Links (optional)</label>
                {form.portfolioUrls.map((url, i) => (
                  <input
                    key={i}
                    className="hcg-input"
                    value={url}
                    onChange={(e) => {
                      const urls = [...form.portfolioUrls];
                      urls[i] = e.target.value;
                      updateForm("portfolioUrls", urls);
                    }}
                    placeholder="YouTube VOD, Twitch clip, or social link..."
                  />
                ))}
                <Button size="sm" variant="ghost" onClick={() => updateForm("portfolioUrls", [...form.portfolioUrls, ""])}>
                  + Add Another Link
                </Button>
              </div>
            </>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Application Summary</h3>
                {[
                  { label: "Name", value: form.fullLegalName || "—" },
                  { label: "Country", value: form.country || "—" },
                  { label: "Games", value: form.primaryTitles.join(", ") || "—" },
                  { label: "Session Types", value: form.sessionTypes.map((t) => SESSION_TYPES.find((s) => s.id === t)?.label).join(", ") || "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm border-b border-hcg-border/50 pb-2">
                    <span className="text-hcg-muted">{label}</span>
                    <span className="font-medium text-right max-w-xs">{value}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-2">
                {[
                  { key: "agreedToTerms", label: "I agree to the High Caliber Gaming Coach Code of Conduct and Terms of Service" },
                  { key: "agreedToRevShare", label: "I acknowledge the 80/20 revenue share (I receive 80% of session fees, platform takes 20%)" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form[key as keyof typeof form] as boolean}
                      onChange={(e) => updateForm(key, e.target.checked)}
                      className="mt-0.5 accent-yellow-400"
                    />
                    <span className="text-sm text-hcg-muted">{label}</span>
                  </label>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
          <ChevronLeft size={16} /> Back
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-hcg-muted">Save Draft</Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>
              Continue <ChevronRight size={16} />
            </Button>
          ) : (
            <Button
              disabled={!form.agreedToTerms || !form.agreedToRevShare}
              onClick={() => setSubmitted(true)}
            >
              Submit Application
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
