import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const CreatePostSchema = z.object({
  body: z.string().min(1).max(5000),
  postType: z.enum(["TEXT", "CLIP", "SCREENSHOT", "POLL", "ACHIEVEMENT"]).default("TEXT"),
  mediaUrls: z.array(z.string().url()).max(4).optional(),
  pollOptions: z.array(z.string().min(1).max(100)).min(2).max(6).optional(),
  communityId: z.string().cuid().optional(),
  flairId: z.string().cuid().optional(),
  gameTitleId: z.string().cuid().optional(),
  tags: z.array(z.string()).max(5).optional(),
});

/**
 * GET /api/feed
 * Returns a personalized social feed for the authenticated user:
 * - Posts from followed users
 * - Posts from joined communities
 * - Trending posts (fallback for new users)
 * Supports cursor-based pagination.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);
    const mode = searchParams.get("mode") ?? "following"; // "following" | "trending" | "community"
    const communityId = searchParams.get("communityId");
    const gameId = searchParams.get("gameId");

    const userId = (session?.user as any)?.id as string | undefined;

    let where: any = {
      isRemoved: false,
    };

    if (gameId) {
      where.gameTitleId = gameId;
    }

    if (mode === "community" && communityId) {
      where.communityId = communityId;
    } else if (mode === "following" && userId) {
      // Get the user's followed users
      const following = await db.user.findMany({
        where: {
          followers: { some: { followerId: userId } },
        },
        select: { id: true },
      });

      const followedIds = following.map((f) => f.id);

      // Get user's communities
      const memberships = await db.communityMember.findMany({
        where: { userId },
        select: { communityId: true },
      });
      const communityIds = memberships.map((m) => m.communityId);

      where.OR = [
        { authorId: { in: followedIds } },
        { communityId: { in: communityIds } },
      ];
    }
    // else "trending" mode — no user filter, sorted by score

    const posts = await db.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            gamerTag: true,
            displayName: true,
            avatarUrl: true,
            tier: true,
            isVerified: true,
            org: { select: { abbr: true } },
          },
        },
        community: { select: { id: true, name: true, slug: true } },
        gameTitle: { select: { id: true, title: true } },
        flair: { select: { id: true, label: true, color: true } },
        pollOptions: { include: { _count: { select: { votes: true } } } },
        _count: { select: { votes: true, comments: true, savedBy: true } },
      },
      orderBy: mode === "trending"
        ? { voteScore: "desc" }
        : { createdAt: "desc" },
      take: limit + 1, // fetch one extra to determine if there's a next page
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const hasMore = posts.length > limit;
    const data = hasMore ? posts.slice(0, limit) : posts;
    const nextCursor = hasMore ? data[data.length - 1].id : null;

    // If user is authenticated, fetch their votes for this batch
    let userVotes: Record<string, string> = {};
    if (userId && data.length > 0) {
      const postIds = data.map((p) => p.id);
      const votes = await db.postVote.findMany({
        where: { userId, postId: { in: postIds } },
        select: { postId: true, value: true },
      });
      votes.forEach((v) => {
        userVotes[v.postId] = v.value.toString();
      });
    }

    return NextResponse.json({
      posts: data.map((p) => ({
        ...p,
        userVote: userVotes[p.id] ?? null,
      })),
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("[GET /api/feed]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/feed
 * Create a new post
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CreatePostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const userId = (session.user as any).id as string;
    const { body: postBody, postType, mediaUrls, pollOptions, communityId, flairId, gameTitleId, tags } = parsed.data;

    // Verify community membership if posting to a community
    if (communityId) {
      const membership = await db.communityMember.findUnique({
        where: { userId_communityId: { userId, communityId } },
      });
      if (!membership) {
        return NextResponse.json({ error: "You must be a member to post in this community" }, { status: 403 });
      }
    }

    const post = await db.$transaction(async (tx) => {
      const newPost = await tx.post.create({
        data: {
          authorId: userId,
          body: postBody,
          postType,
          mediaUrls: mediaUrls ?? [],
          communityId: communityId ?? null,
          flairId: flairId ?? null,
          gameTitleId: gameTitleId ?? null,
          tags: tags ?? [],
          voteScore: 0,
        },
        include: {
          author: {
            select: {
              id: true,
              gamerTag: true,
              displayName: true,
              avatarUrl: true,
              tier: true,
              isVerified: true,
            },
          },
          community: { select: { id: true, name: true, slug: true } },
          _count: { select: { votes: true, comments: true, savedBy: true } },
        },
      });

      // Create poll options if this is a poll post
      if (postType === "POLL" && pollOptions && pollOptions.length >= 2) {
        await tx.pollOption.createMany({
          data: pollOptions.map((opt, idx) => ({
            postId: newPost.id,
            text: opt,
            order: idx,
          })),
        });
      }

      return newPost;
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/feed]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
