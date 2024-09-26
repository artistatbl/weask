import { NextRequest, NextResponse } from "next/server";
import { aiUseChatAdapter } from "@upstash/rag-chat/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { processChatStream } from "@/lib/chatStreamLogic";

export const POST = async (req: NextRequest) => {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages, sessionId, userPlan } = await req.json();
    const response = await processChatStream(user, messages, sessionId, userPlan);
    return aiUseChatAdapter(response);

  } catch (error: any) {
    console.error("Chat stream error:", error);

    if (error.status === 429) {
      return NextResponse.json(
        { 
          error: "Rate limit exceeded", 
          message: "You've reached the maximum number of requests. Please try again later.",
          isRateLimit: true,
          reset: error.reset
        },
        { status: 429, headers: { 'Retry-After': error.reset?.toString() } }
      );
    }

    if (error.status === 404) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.error("Detailed error:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: "An unexpected error occurred.", details: error.message },
      { status: 500 }
    );
  }
};