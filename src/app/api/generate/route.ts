import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { generateDocument } from "@/lib/documentGenerator";
import { prisma } from "@/lib/db";

export const POST = async (req: NextRequest) => {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, sessionId } = await req.json();

    // Fetch the chat history for the given sessionId
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    const chatMessages = await prisma.chatMessage.findMany({
      where: {
        sessionId: sessionId,
        userId: dbUser.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Combine chat messages into a single string
    const chatHistory = chatMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');

    const document = await generateDocument(type, chatHistory);
    if ('error' in document) {
      return NextResponse.json({ error: document.output }, { status: 400 });
    }
    console.log('Generated document:', document); // Add this line
    return NextResponse.json({ document });

  } catch (error: any) {
    console.error("Document generation error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred.", details: error.message },
      { status: 500 }
    );
  }
};