"use server";

import { prisma } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { Message } from '@/utils/types';

 type ChatError = Error & { status?: number };


export async function incrementDailyChatCount(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        dailyChatCount: {
          increment: 1,
        },
        lastChatReset: {
          set: today,
        },
      },
    });

    if (updatedUser.lastChatReset < today) {
      // If it's a new day, reset the count to 1
      return await prisma.user.update({
        where: { clerkId: userId },
        data: {
          dailyChatCount: 1,
          lastChatReset: today,
        },
      });
    }

    return updatedUser;
  } catch (error: unknown) {
    const typedError = error as { code: string }; // Type assertion
    if (typedError.code === 'P2025') {
      throw new Error("User not found");
    }
    throw error;
  }
}

export async function fetchChatMessages(sessionId: string, userPlan: string) {
  const user = await currentUser();
  if (!user) return { status: 401, messages: [] };

  try {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return { status: 404, message: "User not found in database", messages: [] };
    }

    const messageLimit = userPlan === 'premium' ? undefined : 10;

    const messages = await prisma.chatMessage.findMany({
      where: {
        sessionId: sessionId,
        userId: dbUser.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: messageLimit,
    });

    const typedMessages: Message[] = messages.map(msg => ({
      id: msg.id.toString(),
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
      createdAt: msg.createdAt,
    }));

    return { status: 200, messages: typedMessages };

  } catch (error: unknown) {
    console.error("Error fetching messages:", error);
    const chatError = error as ChatError;
    return { status: 400, message: chatError.message, messages: [] };
  }
}

export async function saveChatMessage(sessionId: string, message: Message) {
  const user = await currentUser();
  if (!user) return { status: 401 };

  try {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return { status: 404, message: "User not found in database" };
    }

    if (message.role !== 'user' && message.role !== 'assistant' && message.role !== 'system') {
      throw new Error('Invalid message role');
    }

    await prisma.chatMessage.create({
      data: {
        sessionId: sessionId,
        role: message.role,
        content: message.content,
        userId: dbUser.id,
      },
    });

    return { status: 200 };
  } catch (error: unknown) {
    console.error("Error saving message:", error);
    const chatError = error as ChatError;
    return { status: 400, message: chatError.message };
  }
}

export async function saveSearchHistory(url: string, sessionId: string) {
  const user = await currentUser();
  if (!user) return { status: 401 };

  try {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return { status: 404, message: "User not found in database" };
    }

    await prisma.searchHistory.upsert({
      where: {
        userId_sessionId_domain: {
          userId: dbUser.id,
          sessionId: sessionId,
          domain: url,
        },
      },
      update: {
        createdAt: new Date(),
      },
      create: {
        userId: dbUser.id,
        domain: url,
        sessionId: sessionId,
      },
    });

    return { status: 200 };
  } catch (error: unknown) {
    console.error("Error saving search history:", error);
    const chatError = error as ChatError;
    return { status: 400, message: chatError.message };
  }
}
