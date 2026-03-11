/**
 * Socket.IO client singleton + typed event system for High Caliber Gaming
 *
 * Usage:
 *   import { useSocket } from "@/lib/socket";
 *   const { socket, isConnected } = useSocket();
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { io, type Socket } from "socket.io-client";

// ─── Event type definitions ───────────────────────────────────────────────────

export interface MatchUpdatedPayload {
  matchId: string;
  status: string;
  challengerScore?: number;
  challengedScore?: number;
  updatedAt: string;
}

export interface DisputeUpdatedPayload {
  disputeId: string;
  matchId: string;
  status: string;
  resolution?: string;
}

export interface WagerAcceptedPayload {
  wagerId: string;
  matchId: string;
  opponentGamerTag: string;
  amountCents: number;
}

export interface NotificationPayload {
  id: string;
  type: string;
  title: string;
  body: string;
  relatedId?: string;
  createdAt: string;
}

export interface ChatMessagePayload {
  id: string;
  matchId: string;
  senderId: string;
  senderGamerTag: string;
  senderAvatarUrl?: string;
  body: string;
  createdAt: string;
}

export interface UserStatusPayload {
  userId: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface LadderRankChangePayload {
  userId: string;
  ladderId: string;
  oldRank: number;
  newRank: number;
  points: number;
}

// Typed server-to-client events
export interface ServerToClientEvents {
  "match:updated": (payload: MatchUpdatedPayload) => void;
  "match:chat": (payload: ChatMessagePayload) => void;
  "dispute:updated": (payload: DisputeUpdatedPayload) => void;
  "wager:accepted": (payload: WagerAcceptedPayload) => void;
  "notification": (payload: NotificationPayload) => void;
  "user:status": (payload: UserStatusPayload) => void;
  "ladder:rank_change": (payload: LadderRankChangePayload) => void;
}

// Typed client-to-server events
export interface ClientToServerEvents {
  "match:join_room": (matchId: string) => void;
  "match:leave_room": (matchId: string) => void;
  "match:send_chat": (payload: { matchId: string; body: string }) => void;
  "user:auth": (token: string) => void;
}

export type HCGSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

// ─── Singleton ────────────────────────────────────────────────────────────────

let socketSingleton: HCGSocket | null = null;

function getSocket(): HCGSocket {
  if (!socketSingleton) {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL ?? (
      typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
    );

    socketSingleton = io(url, {
      path: "/api/socket",
      transports: ["websocket", "polling"],
      autoConnect: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    }) as HCGSocket;

    // Global error logging
    socketSingleton.on("connect_error", (err) => {
      console.warn("[HCG Socket] Connection error:", err.message);
    });
  }

  return socketSingleton;
}

// ─── React hook ───────────────────────────────────────────────────────────────

interface UseSocketOptions {
  /** JWT session token for server-side user identification */
  token?: string;
  /** Auto-connect on mount. Default: true */
  autoConnect?: boolean;
}

interface UseSocketReturn {
  socket: HCGSocket;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  joinMatchRoom: (matchId: string) => void;
  leaveMatchRoom: (matchId: string) => void;
  sendMatchChat: (matchId: string, body: string) => void;
}

export function useSocket({ token, autoConnect = true }: UseSocketOptions = {}): UseSocketReturn {
  const socket = getSocket();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const tokenRef = useRef(token);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      // Authenticate with server once connected
      if (tokenRef.current) {
        socket.emit("user:auth", tokenRef.current);
      }
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    if (autoConnect && !socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket, autoConnect]);

  const connect = useCallback(() => {
    if (!socket.connected) socket.connect();
  }, [socket]);

  const disconnect = useCallback(() => {
    if (socket.connected) socket.disconnect();
  }, [socket]);

  const joinMatchRoom = useCallback((matchId: string) => {
    socket.emit("match:join_room", matchId);
  }, [socket]);

  const leaveMatchRoom = useCallback((matchId: string) => {
    socket.emit("match:leave_room", matchId);
  }, [socket]);

  const sendMatchChat = useCallback((matchId: string, body: string) => {
    socket.emit("match:send_chat", { matchId, body });
  }, [socket]);

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    joinMatchRoom,
    leaveMatchRoom,
    sendMatchChat,
  };
}

// ─── Event listener hook ──────────────────────────────────────────────────────

/**
 * Attach a typed Socket.IO event listener within a component lifecycle.
 *
 * @example
 * useSocketEvent("notification", (payload) => {
 *   toast.info(payload.title);
 * });
 */
export function useSocketEvent<K extends keyof ServerToClientEvents>(
  event: K,
  handler: ServerToClientEvents[K]
): void {
  const socket = getSocket();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const stableHandler = (...args: Parameters<ServerToClientEvents[K]>) => {
      (handlerRef.current as (...a: typeof args) => void)(...args);
    };

    socket.on(event as string, stableHandler as any);
    return () => {
      socket.off(event as string, stableHandler as any);
    };
  }, [socket, event]);
}
