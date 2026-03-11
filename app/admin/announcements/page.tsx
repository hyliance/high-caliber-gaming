"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, Pencil, Trash2, Megaphone } from "lucide-react";

const MOCK_ANNOUNCEMENTS = [
  { id: 1, title: "Season 4 Starts March 15!", body: "The new season begins in 5 days. Get ready to compete!", type: "INFO", isActive: true, publishedAt: new Date("2026-03-10") },
  { id: 2, title: "Scheduled Maintenance", body: "Platform will be down 2–4 AM EST on March 12.", type: "MAINTENANCE", isActive: true, publishedAt: new Date("2026-03-09") },
  { id: 3, title: "New Game Title: Marvel Rivals", body: "Marvel Rivals has been added to the platform!", type: "INFO", isActive: false, publishedAt: new Date("2026-03-01") },
];

const TYPE_COLORS: Record<string, string> = {
  INFO: "info",
  WARNING: "warning",
  MAINTENANCE: "destructive",
};

export default function AnnouncementsPage() {
  const [composing, setComposing] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", type: "INFO", expiresAt: "" });

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Announcements</h1>
          <p className="text-sm text-hcg-muted mt-1">Send platform-wide or targeted notifications to users</p>
        </div>
        <Button onClick={() => setComposing(!composing)} className="gap-2">
          <Plus size={16} />
          New Announcement
        </Button>
      </div>

      {composing && (
        <Card className="border-hcg-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone size={18} className="text-hcg-gold" />
              Compose Announcement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-hcg-muted font-medium">Title</label>
                <input className="hcg-input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Announcement title" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-hcg-muted font-medium">Type</label>
                <select className="hcg-input" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                  <option value="INFO">Info</option>
                  <option value="WARNING">Warning</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-hcg-muted font-medium">Message</label>
              <textarea className="hcg-input h-24 resize-none" value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} placeholder="Announcement body..." />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-hcg-muted font-medium">Expires At (optional)</label>
              <input type="datetime-local" className="hcg-input w-64" value={form.expiresAt} onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <Button>Publish Now</Button>
              <Button variant="outline" onClick={() => setComposing(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {MOCK_ANNOUNCEMENTS.map((ann) => (
          <Card key={ann.id} className={!ann.isActive ? "opacity-60" : ""}>
            <CardContent className="p-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 rounded-lg bg-hcg-gold/10 mt-0.5">
                  <Bell size={14} className="text-hcg-gold" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold">{ann.title}</p>
                    <Badge variant={TYPE_COLORS[ann.type] as any} className="text-xs">{ann.type}</Badge>
                    {!ann.isActive && <Badge variant="secondary" className="text-xs">Expired</Badge>}
                  </div>
                  <p className="text-sm text-hcg-muted">{ann.body}</p>
                  <p className="text-xs text-hcg-muted mt-1">{ann.publishedAt.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button size="icon" variant="ghost" className="h-8 w-8"><Pencil size={14} /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-hcg-red hover:text-hcg-red"><Trash2 size={14} /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
