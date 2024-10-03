"use server";

import {prisma} from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { Message } from '../../../utils/types';

// Add this custom error type at the top of the file
type ChatError = Error & { status?: number };

export const fetchChatMessages = async (sessionId: string, userPlan: string) => {
  const user = await currentUser();
  if (!user) return { status: 401, messages: [] };  // Ensure user is authenticated

  try {
    // Fetch user from the database using Clerk's id
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return { status: 404, message: "User not found in database", messages: [] };
    }

    // Determine message limit based on user plan
    const messageLimit = userPlan === 'premium' ? undefined : 10;

    // Fetch messages using sessionId and userId
    const messages = await prisma.chatMessage.findMany({
      where: {
        sessionId: sessionId,
        userId: dbUser.id,  // Use dbUser here
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: messageLimit,  // Limit messages if not premium
    });

    // Map messages to the expected format
    const typedMessages: Message[] = messages.map(msg => ({
      id: msg.id.toString(),
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
      createdAt: msg.createdAt,
    }));

    return { status: 200, messages: typedMessages }; // Return messages

  } catch (error: unknown) {
    console.error("Error fetching messages:", error);
    const chatError = error as ChatError;
    return { status: 400, message: chatError.message, messages: [] };
  }
};

export const saveChatMessage = async (sessionId: string, message: Message) => {
  const user = await currentUser();
  if (!user) return { status: 401 };

  try {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return { status: 404, message: "User not found in database" };
    }

    // Ensure the role is valid
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
};

export const saveSearchHistory = async (url: string, sessionId: string) => {
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
        createdAt: new Date(), // Update the timestamp if the record exists
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
};