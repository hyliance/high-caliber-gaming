"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Search,
  Plus,
  X,
  User,
  ChevronLeft,
  MoreVertical,
  Circle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  online: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CURRENT_USER_ID = "me";

const conversations: Conversation[] = [
  {
    id: "conv1",
    userId: "u1",
    username: "ShadowStrike99",
    displayName: "Shadow Strike",
    online: true,
    lastMessage: "GG man, rematch tomorrow?",
    lastMessageTime: "2m ago",
    unreadCount: 2,
    messages: [
      { id: "msg1", senderId: "u1", text: "Hey, good game earlier!", timestamp: "3:42 PM", read: true },
      { id: "msg2", senderId: "me", text: "Thanks! You had some crazy shots in round 3.", timestamp: "3:43 PM", read: true },
      { id: "msg3", senderId: "u1", text: "Ha yeah, I was on fire. GG man, rematch tomorrow?", timestamp: "3:44 PM", read: false },
      { id: "msg4", senderId: "u1", text: "I'll run it back anytime.", timestamp: "3:44 PM", read: false },
    ],
  },
  {
    id: "conv2",
    userId: "u2",
    username: "CoachPro_Alex",
    displayName: "Coach Alex",
    online: true,
    lastMessage: "Your VOD review is ready for Wednesday",
    lastMessageTime: "18m ago",
    unreadCount: 1,
    messages: [
      { id: "msg5", senderId: "u2", text: "Hey! Just finished reviewing your last 5 matches.", timestamp: "2:10 PM", read: true },
      { id: "msg6", senderId: "me", text: "Awesome, what did you find?", timestamp: "2:12 PM", read: true },
      { id: "msg7", senderId: "u2", text: "A few positioning issues in pistol round. Nothing major though — you're improving fast.", timestamp: "2:14 PM", read: true },
      { id: "msg8", senderId: "me", text: "That makes sense. When can we schedule the next session?", timestamp: "2:15 PM", read: true },
      { id: "msg9", senderId: "u2", text: "Your VOD review is ready for Wednesday", timestamp: "3:26 PM", read: false },
    ],
  },
  {
    id: "conv3",
    userId: "u3",
    username: "GridironKing",
    displayName: "Gridiron King",
    online: false,
    lastMessage: "Yo accept my wager challenge when you're on",
    lastMessageTime: "1h ago",
    unreadCount: 0,
    messages: [
      { id: "msg10", senderId: "u3", text: "You play Madden?", timestamp: "1:00 PM", read: true },
      { id: "msg11", senderId: "me", text: "Yeah, been grinding it lately. Why?", timestamp: "1:02 PM", read: true },
      { id: "msg12", senderId: "u3", text: "Heard you're decent. Wanna run a $25 match?", timestamp: "1:04 PM", read: true },
      { id: "msg13", senderId: "me", text: "Send the challenge, I'll accept when I'm free.", timestamp: "1:05 PM", read: true },
      { id: "msg14", senderId: "u3", text: "Yo accept my wager challenge when you're on", timestamp: "2:30 PM", read: true },
    ],
  },
  {
    id: "conv4",
    userId: "u4",
    username: "TourneyAdmin_HCG",
    displayName: "HCG Tournament Admin",
    online: true,
    lastMessage: "Your bracket match is scheduled for 7PM EST",
    lastMessageTime: "3h ago",
    unreadCount: 0,
    messages: [
      { id: "msg15", senderId: "u4", text: "Welcome to the HCG Winter Valorant Open!", timestamp: "10:00 AM", read: true },
      { id: "msg16", senderId: "u4", text: "Your bracket match is scheduled for 7PM EST", timestamp: "11:30 AM", read: true },
      { id: "msg17", senderId: "me", text: "Got it. Will my opponent receive the same message?", timestamp: "11:35 AM", read: true },
      { id: "msg18", senderId: "u4", text: "Yes, both parties will be notified. Good luck!", timestamp: "11:36 AM", read: true },
    ],
  },
  {
    id: "conv5",
    userId: "u5",
    username: "NightOwlGamer",
    displayName: "Night Owl",
    online: false,
    lastMessage: "Disputing this one man, I had the W",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    messages: [
      { id: "msg19", senderId: "u5", text: "Bro why did you report a win? I clearly got the better score.", timestamp: "Yesterday 11:45 PM", read: true },
      { id: "msg20", senderId: "me", text: "Check the screenshot I uploaded to the report.", timestamp: "Yesterday 11:48 PM", read: true },
      { id: "msg21", senderId: "u5", text: "That's not the final screen. The connection dropped before results.", timestamp: "Yesterday 11:50 PM", read: true },
      { id: "msg22", senderId: "u5", text: "Disputing this one man, I had the W", timestamp: "Yesterday 11:51 PM", read: true },
    ],
  },
];

// ─── New Message Modal ────────────────────────────────────────────────────────

function NewMessageModal({ onClose, onSelect }: { onClose: () => void; onSelect: (username: string) => void }) {
  const [query, setQuery] = useState("");
  const results = query.trim()
    ? conversations
        .filter((c) => c.username.toLowerCase().includes(query.toLowerCase()))
        .map((c) => ({ username: c.username, displayName: c.displayName, online: c.online }))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="hcg-card w-full max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-display font-bold text-foreground">New Message</h3>
          <button onClick={onClose} className="text-hcg-muted hover:text-foreground">
            <X size={16} />
          </button>
        </div>
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-hcg-muted" />
          <input
            type="text"
            placeholder="Search gamer tag..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="hcg-input pl-9"
          />
        </div>
        {results.length > 0 ? (
          <div className="space-y-1">
            {results.map((r) => (
              <button
                key={r.username}
                onClick={() => { onSelect(r.username); onClose(); }}
                className="w-full flex items-center gap-3 rounded-lg p-2 hover:bg-hcg-card-hover transition-colors text-left"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-hcg-border flex items-center justify-center">
                    <User size={14} className="text-hcg-muted" />
                  </div>
                  {r.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border border-hcg-card" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{r.displayName}</div>
                  <div className="text-xs text-hcg-muted">@{r.username}</div>
                </div>
              </button>
            ))}
          </div>
        ) : query ? (
          <p className="text-xs text-hcg-muted text-center py-4">No users found</p>
        ) : null}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MessagesPage() {
  const [convList, setConvList] = useState(conversations);
  const [activeConvId, setActiveConvId] = useState<string | null>("conv1");
  const [inputText, setInputText] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = convList.find((c) => c.id === activeConvId) ?? null;

  const filteredConvs = convList.filter(
    (c) =>
      c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages.length]);

  function handleSelectConv(id: string) {
    setActiveConvId(id);
    setMobileView("thread");
    setConvList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  }

  function handleSend() {
    const text = inputText.trim();
    if (!text || !activeConvId) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: CURRENT_USER_ID,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: true,
    };
    setConvList((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: text, lastMessageTime: "Just now" }
          : c
      )
    );
    setInputText("");
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-display font-bold hcg-gradient-text">Messages</h1>
      </div>

      <div className="flex flex-1 gap-0 rounded-lg border border-hcg-border overflow-hidden min-h-0">
        {/* Left Panel — Conversation List */}
        <div
          className={`w-full md:w-72 lg:w-80 flex-shrink-0 border-r border-hcg-border bg-hcg-card flex flex-col ${
            mobileView === "thread" ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Panel Header */}
          <div className="p-3 border-b border-hcg-border flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-hcg-muted" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hcg-input text-xs pl-8 py-1.5"
              />
            </div>
            <button
              onClick={() => setShowNewModal(true)}
              className="hcg-btn-primary p-2 rounded-lg flex-shrink-0"
              title="New Message"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConvs.length === 0 ? (
              <p className="text-xs text-hcg-muted text-center py-8">No conversations found</p>
            ) : (
              filteredConvs.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConv(conv.id)}
                  className={`w-full flex items-start gap-3 p-3 border-b border-hcg-border/50 transition-colors text-left hover:bg-hcg-card-hover ${
                    activeConvId === conv.id ? "bg-hcg-gold/5 border-l-2 border-l-hcg-gold" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-hcg-border flex items-center justify-center">
                      <User size={18} className="text-hcg-muted" />
                    </div>
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-hcg-card" />
                    )}
                  </div>
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground truncate">{conv.displayName}</span>
                      <span className="text-xs text-hcg-muted flex-shrink-0 ml-1">{conv.lastMessageTime}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-hcg-muted truncate">{conv.lastMessage}</p>
                      {conv.unreadCount > 0 && (
                        <span className="ml-1 flex-shrink-0 w-4 h-4 rounded-full bg-hcg-gold text-hcg-bg text-xs font-bold flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Panel — Thread */}
        <div
          className={`flex-1 flex flex-col bg-hcg-bg min-w-0 ${
            mobileView === "list" ? "hidden md:flex" : "flex"
          }`}
        >
          {activeConv ? (
            <>
              {/* Thread Header */}
              <div className="px-4 py-3 border-b border-hcg-border bg-hcg-card flex items-center gap-3">
                <button
                  onClick={() => setMobileView("list")}
                  className="md:hidden text-hcg-muted hover:text-foreground"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-hcg-border flex items-center justify-center">
                    <User size={16} className="text-hcg-muted" />
                  </div>
                  {activeConv.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-hcg-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{activeConv.displayName}</div>
                  <div className="flex items-center gap-1 text-xs text-hcg-muted">
                    <Circle
                      size={6}
                      className={activeConv.online ? "fill-green-400 text-green-400" : "fill-hcg-muted text-hcg-muted"}
                    />
                    {activeConv.online ? "Online" : "Offline"}
                  </div>
                </div>
                <button className="text-hcg-muted hover:text-foreground">
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeConv.messages.map((msg) => {
                  const isMe = msg.senderId === CURRENT_USER_ID;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      {!isMe && (
                        <div className="w-7 h-7 rounded-full bg-hcg-border flex items-center justify-center mr-2 flex-shrink-0 self-end">
                          <User size={12} className="text-hcg-muted" />
                        </div>
                      )}
                      <div className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                        <div
                          className={`rounded-2xl px-3 py-2 text-sm ${
                            isMe
                              ? "bg-hcg-gold text-hcg-bg rounded-tr-sm font-medium"
                              : "bg-hcg-card border border-hcg-border text-foreground rounded-tl-sm"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-xs text-hcg-muted px-1">{msg.timestamp}</span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-hcg-border bg-hcg-card">
                <div className="flex items-end gap-2">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={`Message ${activeConv.displayName}...`}
                    rows={1}
                    className="hcg-input flex-1 resize-none min-h-[38px] max-h-24"
                    style={{ overflowY: "auto" }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className="hcg-btn-primary p-2 rounded-lg flex-shrink-0 disabled:opacity-40"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <p className="text-xs text-hcg-muted mt-1 pl-1">Press Enter to send · Shift+Enter for new line</p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col gap-3 text-center p-6">
              <div className="w-16 h-16 rounded-full bg-hcg-card border border-hcg-border flex items-center justify-center">
                <Send size={24} className="text-hcg-muted" />
              </div>
              <div>
                <p className="text-base font-medium text-foreground">Your Messages</p>
                <p className="text-sm text-hcg-muted mt-1">Select a conversation or start a new one</p>
              </div>
              <button onClick={() => setShowNewModal(true)} className="hcg-btn-primary">
                <Plus size={14} />
                New Message
              </button>
            </div>
          )}
        </div>
      </div>

      {showNewModal && (
        <NewMessageModal
          onClose={() => setShowNewModal(false)}
          onSelect={(username) => {
            const found = convList.find((c) => c.username === username);
            if (found) handleSelectConv(found.id);
          }}
        />
      )}
    </div>
  );
}
