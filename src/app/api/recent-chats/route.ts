import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
// import { auth } from "@clerk/nextjs";
import { auth } from '@clerk/nextjs/server'


// Add this line to make the route dynamic
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recentUrls = await prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        domain: true,
        createdAt: true,
      },
      distinct: ['domain'],
    });

    const formattedUrls = recentUrls.map(history => {
      const url = new URL(history.domain);
      return {
        id: history.id,
        url: history.domain,
        title: url.hostname,
        visitedAt: history.createdAt,
      };
    });

    return NextResponse.json(formattedUrls);

  } catch (error: unknown) {
    console.error("Error fetching recent URLs:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      { error: "An unexpected error occurred.", details: errorMessage },
      { status: 500 }
    );
  }
}
