import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import TwitchProvider from "next-auth/providers/twitch";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) return null;
        if (user.isBanned) throw new Error("Account suspended");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!isValid) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.gamerTag = (user as any).gamerTag;
        token.globalRole = (user as any).globalRole;
        token.avatarUrl = (user as any).avatarUrl ?? (user as any).image;
      }
      // Re-fetch from DB if gamerTag is missing (e.g., new OAuth user completing onboarding)
      if (token.id && !token.gamerTag) {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
          select: { gamerTag: true, globalRole: true, avatarUrl: true, image: true },
        });
        if (dbUser) {
          token.gamerTag = dbUser.gamerTag ?? undefined;
          token.globalRole = dbUser.globalRole;
          token.avatarUrl = dbUser.avatarUrl ?? dbUser.image ?? undefined;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.gamerTag = token.gamerTag as string;
        session.user.globalRole = token.globalRole as string;
        session.user.avatarUrl = token.avatarUrl as string;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      try {
        await db.wallet.create({
          data: { userId: user.id },
        });
      } catch (e) {
        console.error("[auth] createUser wallet error:", e);
      }
    },
  },
};
