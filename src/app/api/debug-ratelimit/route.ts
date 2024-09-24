import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { ratelimitConfig } from "@/lib/rateLimiter";

export const GET = async (req: NextRequest) => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (ratelimitConfig.enabled && ratelimitConfig.ratelimit) {
    try {
      const result = await ratelimitConfig.ratelimit.limit(user.id);
      return NextResponse.json(result);
    } catch (error) {
      console.error("Rate limiting error:", error);
      return NextResponse.json({ error: "Rate limiting error" }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: "Rate limiting not enabled" }, { status: 400 });
  }
};