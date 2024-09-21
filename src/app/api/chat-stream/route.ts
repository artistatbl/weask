// route.ts
import { ragChat } from "@/lib/rag-chat";
import { retryWithBackoff } from "@/lib/retry-backoff";
import { aiUseChatAdapter } from "@upstash/rag-chat/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { messages, sessionId } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    const response = await retryWithBackoff(() => ragChat.chat(lastMessage, { streaming: true, sessionId }));
    return aiUseChatAdapter(response);

  } catch (error: any) {
    console.error("Chat stream error:", error);

    if (error.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
};
