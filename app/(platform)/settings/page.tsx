"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User, Lock, Bell, Shield, CreditCard, Eye, Gamepad2,
  Trash2, CheckCircle, AlertTriangle, ChevronRight, Save
} from "lucide-react";

const SETTINGS_TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "gaming", label: "Gaming Accounts", icon: Gamepad2 },
  { id: "privacy", label: "Privacy", icon: Eye },
  { id: "security", label: "Security & 2FA", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "payment", label: "Payment & KYC", icon: CreditCard },
  { id: "danger", label: "Account", icon: Shield },
];

const GAMING_PLATFORMS = [
  { id: "PSN", label: "PlayStation Network", icon: "🎮", color: "bg-blue-600" },
  { id: "XBOX", label: "Xbox Live", icon: "🎮", color: "bg-green-600" },
  { id: "STEAM", label: "Steam", icon: "🎮", color: "bg-gray-600" },
  { id: "BATTLENET", label: "Battle.net", icon: "🎮", color: "bg-cyan-600" },
  { id: "RIOT", label: "Riot Games", icon: "🎮", color: "bg-red-600" },
  { id: "EPIC", label: "Epic Games", icon: "🎮", color: "bg-gray-500" },
];

const NOTIFICATION_SETTINGS = [
  { id: "match_challenge", label: "Match Challenges", description: "When someone challenges you to a match" },
  { id: "match_result", label: "Match Results", description: "When a match result is submitted" },
  { id: "wager_update", label: "Wager Updates", description: "Wager accepted, resolved, or disputed" },
  { id: "tournament_start", label: "Tournament Start", description: "Tournaments you're registered for start" },
  { id: "clan_invite", label: "Clan Invites", description: "When you're invited to join a clan" },
  { id: "post_reply", label: "Post Replies", description: "Replies and mentions on your posts" },
  { id: "coach_booking", label: "Coaching Sessions", description: "Booking confirmations and reminders" },
  { id: "system", label: "Platform Updates", description: "Important platform announcements" },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [notifSettings, setNotifSettings] = useState<Record<string, { inApp: boolean; email: boolean; push: boolean }>>(
    Object.fromEntries(
      NOTIFICATION_SETTINGS.map((n) => [n.id, { inApp: true, email: true, push: false }])
    )
  );
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    statsVisibility: "public",
    wagerHistoryVisible: true,
    onlineStatus: true,
    allowChallenges: "all",
    allowMessages: "friends",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex gap-6 max-w-5xl mx-auto">
      {/* Settings sidebar */}
      <div className="w-56 shrink-0">
        <Card className="sticky top-6">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {SETTINGS_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === tab.id
                        ? "bg-hcg-gold/10 text-hcg-gold border-l-2 border-hcg-gold font-medium"
                        : "text-hcg-muted hover:text-foreground hover:bg-hcg-card-hover"
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>
      </div>

      {/* Settings content */}
      <div className="flex-1 space-y-4">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-hcg-gold to-hcg-gold-dark flex items-center justify-center text-2xl font-bold text-hcg-bg">
                    {session?.user?.gamerTag?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">Upload Avatar</Button>
                    <Button variant="ghost" size="sm" className="text-hcg-red">Remove</Button>
                    <p className="text-xs text-hcg-muted">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-hcg-muted font-medium">Gamer Tag</label>
                    <input
                      className="hcg-input"
                      defaultValue={session?.user?.gamerTag ?? ""}
                      placeholder="Your gamer tag"
                    />
                    <p className="text-xs text-hcg-muted">Unique. 3–24 chars, alphanumeric.</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-hcg-muted font-medium">Display Name</label>
                    <input className="hcg-input" defaultValue={session?.user?.name ?? ""} placeholder="Display name" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-hcg-muted font-medium">Bio</label>
                  <textarea
                    className="hcg-input h-24 resize-none"
                    placeholder="Tell the community about yourself..."
                    maxLength={300}
                  />
                  <p className="text-xs text-hcg-muted text-right">0 / 300</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-hcg-muted font-medium">Country</label>
                    <select className="hcg-input">
                      <option value="">Select country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="BR">Brazil</option>
                      <option value="JP">Japan</option>
                      <option value="KR">South Korea</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-hcg-muted font-medium">Region</label>
                    <select className="hcg-input">
                      <option>North America</option>
                      <option>Europe</option>
                      <option>Asia Pacific</option>
                      <option>Latin America</option>
                      <option>Middle East</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-hcg-muted font-medium">Twitch URL</label>
                    <input className="hcg-input" placeholder="https://twitch.tv/..." />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-hcg-muted font-medium">YouTube URL</label>
                    <input className="hcg-input" placeholder="https://youtube.com/..." />
                  </div>
                </div>

                {/* Profile banner */}
                <div className="space-y-1">
                  <label className="text-xs text-hcg-muted font-medium">Profile Banner</label>
                  <div className="h-24 rounded-lg border border-dashed border-hcg-border bg-hcg-card flex items-center justify-center cursor-pointer hover:border-hcg-gold/40 transition-colors">
                    <span className="text-sm text-hcg-muted">Click to upload banner (1200×300px recommended)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave} className="gap-2">
                {saved ? <CheckCircle size={16} /> : <Save size={16} />}
                {saved ? "Saved!" : "Save Changes"}
              </Button>
            </div>
          </>
        )}

        {/* Gaming Accounts Tab */}
        {activeTab === "gaming" && (
          <Card>
            <CardHeader>
              <CardTitle>Linked Gaming Accounts</CardTitle>
              <p className="text-sm text-hcg-muted">Connect your gaming platform accounts for match verification.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {GAMING_PLATFORMS.map((platform) => (
                <div key={platform.id} className="flex items-center justify-between p-3 rounded-lg border border-hcg-border hover:bg-hcg-card-hover transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${platform.color} flex items-center justify-center text-lg`}>
                      {platform.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{platform.label}</p>
                      <p className="text-xs text-hcg-muted">Not connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Privacy Tab */}
        {activeTab === "privacy" && (
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: "profileVisibility", label: "Profile Visibility", options: ["public", "friends", "private"] },
                { key: "statsVisibility", label: "Stats & Match History", options: ["public", "friends", "private"] },
                { key: "allowChallenges", label: "Allow Challenges From", options: ["all", "friends", "none"] },
                { key: "allowMessages", label: "Allow Messages From", options: ["all", "friends", "none"] },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{setting.label}</p>
                  </div>
                  <select
                    className="hcg-input w-36"
                    value={privacySettings[setting.key as keyof typeof privacySettings] as string}
                    onChange={(e) =>
                      setPrivacySettings((p) => ({ ...p, [setting.key]: e.target.value }))
                    }
                  >
                    {setting.options.map((opt) => (
                      <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                    ))}
                  </select>
                </div>
              ))}

              {[
                { key: "wagerHistoryVisible", label: "Show Wager History on Profile" },
                { key: "onlineStatus", label: "Show Online Status" },
              ].map((toggle) => (
                <div key={toggle.key} className="flex items-center justify-between">
                  <p className="text-sm font-medium">{toggle.label}</p>
                  <button
                    onClick={() =>
                      setPrivacySettings((p) => ({
                        ...p,
                        [toggle.key]: !p[toggle.key as keyof typeof privacySettings],
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      privacySettings[toggle.key as keyof typeof privacySettings]
                        ? "bg-hcg-gold"
                        : "bg-hcg-border"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        privacySettings[toggle.key as keyof typeof privacySettings]
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
              <Button onClick={handleSave}>
                {saved ? "Saved!" : "Save Privacy Settings"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-hcg-muted font-medium">Current Password</label>
                  <input className="hcg-input" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-hcg-muted font-medium">New Password</label>
                  <input className="hcg-input" type="password" placeholder="Min 8 chars" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-hcg-muted font-medium">Confirm New Password</label>
                  <input className="hcg-input" type="password" placeholder="Repeat new password" />
                </div>
                <Button>Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={20} className="text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium">2FA Not Enabled</p>
                      <p className="text-xs text-hcg-muted">Required for wagering activity</p>
                    </div>
                  </div>
                  <Button size="sm">Enable 2FA</Button>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-hcg-border">
                    <div>
                      <p className="text-sm font-medium">Authenticator App</p>
                      <p className="text-xs text-hcg-muted">Google Authenticator, Authy, etc.</p>
                    </div>
                    <Button variant="outline" size="sm">Set Up</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-hcg-border">
                    <div>
                      <p className="text-sm font-medium">SMS Verification</p>
                      <p className="text-xs text-hcg-muted">Text message to your phone</p>
                    </div>
                    <Button variant="outline" size="sm">Set Up</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { device: "Chrome on Windows", location: "New York, US", current: true, lastSeen: "Now" },
                  { device: "Mobile App — iOS", location: "New York, US", current: false, lastSeen: "2 hours ago" },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-hcg-border">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{session.device}</p>
                        {session.current && <Badge variant="success">Current</Badge>}
                      </div>
                      <p className="text-xs text-hcg-muted">{session.location} · {session.lastSeen}</p>
                    </div>
                    {!session.current && (
                      <Button variant="ghost" size="sm" className="text-hcg-red hover:text-hcg-red">Revoke</Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <p className="text-sm text-hcg-muted">Control what notifications you receive and how.</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-4 text-xs font-medium text-hcg-muted px-4">
                <span>Event Type</span>
                <span className="text-center">In-App</span>
                <span className="text-center">Email</span>
                <span className="text-center">Push</span>
              </div>
              <div className="space-y-2">
                {NOTIFICATION_SETTINGS.map((notif) => (
                  <div key={notif.id} className="grid grid-cols-4 gap-4 items-center p-3 rounded-lg hover:bg-hcg-card-hover">
                    <div>
                      <p className="text-sm font-medium">{notif.label}</p>
                      <p className="text-xs text-hcg-muted">{notif.description}</p>
                    </div>
                    {["inApp", "email", "push"].map((channel) => (
                      <div key={channel} className="flex justify-center">
                        <button
                          onClick={() =>
                            setNotifSettings((prev) => ({
                              ...prev,
                              [notif.id]: {
                                ...prev[notif.id],
                                [channel]: !prev[notif.id][channel as keyof typeof prev[typeof notif.id]],
                              },
                            }))
                          }
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            notifSettings[notif.id]?.[channel as keyof typeof notifSettings[typeof notif.id]]
                              ? "bg-hcg-gold"
                              : "bg-hcg-border"
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              notifSettings[notif.id]?.[channel as keyof typeof notifSettings[typeof notif.id]]
                                ? "translate-x-5"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button onClick={handleSave}>{saved ? "Saved!" : "Save Preferences"}</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment & KYC Tab */}
        {activeTab === "payment" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Identity Verification (KYC)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20 mb-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={20} className="text-orange-400" />
                    <div>
                      <p className="text-sm font-semibold text-orange-300">Verification Required for Wagering</p>
                      <p className="text-xs text-hcg-muted mt-0.5">Identity verification is required before you can participate in money matches or withdraw earnings.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { step: 1, label: "Email Verified", done: true },
                    { step: 2, label: "Phone Number", done: false },
                    { step: 3, label: "Government ID", done: false },
                    { step: 4, label: "Age Verification (18+)", done: false },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        item.done ? "bg-green-500/20 text-green-400" : "bg-hcg-border text-hcg-muted"
                      }`}>
                        {item.done ? <CheckCircle size={14} /> : item.step}
                      </div>
                      <span className={`text-sm ${item.done ? "text-foreground" : "text-hcg-muted"}`}>{item.label}</span>
                      {!item.done && <Button size="sm" variant="outline" className="ml-auto">Complete</Button>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg border border-dashed border-hcg-border flex flex-col items-center justify-center gap-2 h-24">
                  <CreditCard size={24} className="text-hcg-muted" />
                  <p className="text-sm text-hcg-muted">No payment methods on file</p>
                  <Button size="sm">Add Payment Method</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Account</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg border border-dashed border-hcg-border flex flex-col items-center justify-center gap-2 h-24">
                  <p className="text-sm text-hcg-muted">No payout account linked</p>
                  <Button size="sm">Link Bank Account</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Danger Zone Tab */}
        {activeTab === "danger" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data & Privacy Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-hcg-border">
                  <div>
                    <p className="text-sm font-medium">Export Your Data</p>
                    <p className="text-xs text-hcg-muted">Download all your account data (GDPR Art. 20)</p>
                  </div>
                  <Button variant="outline" size="sm">Request Export</Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-hcg-border">
                  <div>
                    <p className="text-sm font-medium">Delete Account</p>
                    <p className="text-xs text-hcg-muted">Permanently delete your account and all data (GDPR Art. 17, 30 days)</p>
                  </div>
                  <Button variant="destructive" size="sm">
                    <Trash2 size={14} />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-400">Wagering Safety</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-orange-500/20 bg-orange-500/5">
                  <div>
                    <p className="text-sm font-medium">Self-Exclusion</p>
                    <p className="text-xs text-hcg-muted">Temporarily disable all wagering activity</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-orange-500/30 text-orange-400">Enable</Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-hcg-border">
                  <div>
                    <p className="text-sm font-medium">Daily Wager Cap</p>
                    <p className="text-xs text-hcg-muted">Current limit: $500/day</p>
                  </div>
                  <Button variant="outline" size="sm">Edit Limit</Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-hcg-border">
                  <div>
                    <p className="text-sm font-medium">Weekly Wager Cap</p>
                    <p className="text-xs text-hcg-muted">Current limit: $2,000/week</p>
                  </div>
                  <Button variant="outline" size="sm">Edit Limit</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
