// pages/api/search-history.ts or app/api/search-history/route.ts (depending on your Next.js setup)

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    console.log("Fetching search history...");
    const user = await currentUser();
    if (!user) {
      console.log("Unauthorized: No user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      console.log("User not found in database");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const recentSearchHistories = await prisma.searchHistory.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' },
      take: 5, // Only pull the recent 3 URLs
      select: {
        id: true,
        domain: true,
        createdAt: true,
      },
    });

    console.log("Raw search histories:", recentSearchHistories);

    // Normalize URLs and remove duplicates
    const normalizedUrls = new Map();
    recentSearchHistories.forEach(history => {
      const normalizedUrl = new URL(history.domain).toString();
      if (!normalizedUrls.has(normalizedUrl)) {
        normalizedUrls.set(normalizedUrl, {
          id: history.id,
          url: normalizedUrl,
          title: generateUrlTitle(normalizedUrl),
          visitedAt: history.createdAt,
        });
      }
    });

    const recentUrls = Array.from(normalizedUrls.values());
    console.log("Processed recent URLs:", recentUrls);

    return NextResponse.json(recentUrls);

  } catch (error: unknown) {
    console.error("Error fetching search history:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred.", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

function generateUrlTitle(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostParts = urlObj.hostname.split('.');
    const domain = hostParts.length > 1 ? hostParts[hostParts.length - 2] : hostParts[0];
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    
    const prefix = domain.slice(0, 3).toUpperCase();

    let content = '';
    if (pathSegments.length > 0) {
      content = pathSegments[pathSegments.length - 1]
        .replace(/[-_]/g, ' ')
        .replace(/\.[^/.]+$/, '')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }

    const title = content ? `${prefix}: ${content}` : prefix;
    return title.length > 30 ? title.substring(0, 27) + '...' : title;
  } catch (error) {
    console.error("Error generating URL title:", error);
    return url.substring(0, 30);
  }
}