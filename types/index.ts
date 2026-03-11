import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      gamerTag: string;
      globalRole: string;
      avatarUrl?: string | null;
    };
  }
}

export type GlobalRole =
  | "GUEST"
  | "MEMBER"
  | "VERIFIED_MEMBER"
  | "MODERATOR"
  | "ADMIN"
  | "SUPER_ADMIN";

export type TierName =
  | "BRONZE"
  | "SILVER"
  | "GOLD"
  | "PLATINUM"
  | "DIAMOND"
  | "MASTER";

export interface LadderEntryWithUser {
  id: string;
  rank: number;
  elo: number;
  wins: number;
  losses: number;
  streak: number;
  points: number;
  tier: TierName;
  user: {
    id: string;
    gamerTag: string;
    avatarUrl: string | null;
    country: string | null;
    clanMembership?: {
      clan: { tag: string; name: string };
    } | null;
  };
}

export interface TournamentWithEntries {
  id: string;
  name: string;
  bannerUrl: string | null;
  format: string;
  status: string;
  entryFeeCents: number;
  prizePoolCents: number;
  maxCapacity: number;
  currentEntrants: number;
  startDate: Date;
  gameTitle: { officialName: string; iconUrl: string | null };
  gameMode: { name: string };
}

export interface PostWithAuthor {
  id: string;
  title: string;
  content: string | null;
  type: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  createdAt: Date;
  community?: { slug: string; name: string } | null;
  author: {
    id: string;
    gamerTag: string;
    avatarUrl: string | null;
  };
  tags: string[];
}

export interface CoachCardData {
  id: string;
  displayName: string;
  bannerUrl: string | null;
  tier: string;
  overallRating: number;
  reviewCount: number;
  sessionCount: number;
  isCredVerified: boolean;
  user: { avatarUrl: string | null; country: string | null };
  games: Array<{
    gameTitle: { officialName: string; iconUrl: string | null };
  }>;
  sessions: Array<{ type: string; durationMin: number; priceCents: number }>;
}

export interface WalletData {
  balanceCents: number;
  escrowCents: number;
  creditsCents: number;
  totalEarnedCents: number;
  totalWagered: number;
}

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: number;
  adminOnly?: boolean;
}
