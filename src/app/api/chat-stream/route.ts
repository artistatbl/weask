// route.ts
import { ragChat } from "@/lib/rag-chat";
import { retryWithBackoff } from "@/lib/retry-backoff";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { aiUseChatAdapter } from "@upstash/rag-chat/nextjs";

import { currentUser } from "@clerk/nextjs/server";

export const POST = async (req: NextRequest) => {
  try {
    const { messages, sessionId } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // Get the current user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user in the database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    // Save user message to database
    await prisma.chatMessage.create({
      data: {
        sessionId,
        role: "user",
        content: lastMessage,
        userId: dbUser.id,
      },

    });
    console.log(lastMessage)

    // Process the chat with ragChat
    const response = await retryWithBackoff(() => ragChat.chat(lastMessage, { streaming: true, sessionId }));
    return aiUseChatAdapter(response);


    // Log the response type
    // console.log('Response type:', response.constructor.name);

    // // Ensure the response is a ReadableStream
    // if (!(response instanceof ReadableStream)) {
    //   console.error("Expected a ReadableStream from ragChat.chat()");
    //   return NextResponse.json({ error: "Invalid response from chat service" }, { status: 500 });
    // }

    // // Create a TransformStream to handle the bot's response
    // const { readable, writable } = new TransformStream({
    //   async transform(chunk, controller) {
    //     controller.enqueue(chunk);
    //   },
    //   async flush(controller) {
    //     // Save bot response to database after the stream is complete
    //     const fullResponse = await response.tee()[1].getReader().read().then(result => result.value);
    //     await prisma.chatMessage.create({
    //       data: {
    //         sessionId,
    //         role: "assistant",
    //         content: fullResponse,
    //         userId: dbUser.id,
    //       },
    //     });
    //     controller.terminate();
    //   },
    // });

    // // Fetch all messages for the session
    // const chatHistory = await prisma.chatMessage.findMany({
    //   where: { sessionId },
    //   orderBy: { createdAt: 'asc' },
    // });

    // // Stream the response
    // const stream = response.pipeThrough(new TextDecoderStream()).pipeTo(writable);

    // // Return the chat history along with the streaming response
    // return new Response(readable, {
    //   headers: { 'Content-Type': 'application/json' },
    // });

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