"use server"
import db from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { Message } from '../../../utils/types';
import { v4 as uuidv4 } from 'uuid';

export const fetchChatMessages = async (sessionId: string) => {
  const user = await currentUser();
  if (!user) return { status: 401, messages: [] };

  try {
    const dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return { status: 404, message: "User not found in database", messages: [] };
    }

    const messages = await db.chatMessage.findMany({
      where: {
        sessionId: sessionId,
        userId: dbUser.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Convert the database messages to the Message type
    const typedMessages: Message[] = messages.map(msg => ({
      id: msg.id.toString(),  // Convert id to string
      role: msg.role as 'user' | 'assistant' | 'system',  // Type assertion
      content: msg.content,
      createdAt: msg.createdAt
    }));

    return { status: 200, messages: typedMessages };
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    return { status: 400, message: error.message, messages: [] };
  }
};

export const saveChatMessage = async (sessionId: string, message: Message) => {
  const user = await currentUser();
  if (!user) return { status: 401 };

  try {
    const dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return { status: 404, message: "User not found in database" };
    }

    // Ensure the role is valid
    if (message.role !== 'user' && message.role !== 'assistant' && message.role !== 'system') {
      throw new Error('Invalid message role');
    }

    await db.chatMessage.create({
      data: {
        sessionId: sessionId,
        role: message.role,
        content: message.content,
        userId: dbUser.id,
      },
    });

    return { status: 200 };
  } catch (error: any) {
    console.error("Error saving message:", error);
    return { status: 400, message: error.message };
  }
};

export const saveSearchHistory = async (url: string, sessionId: string) => {
  const user = await currentUser();
  if (!user) return { status: 401 };

  try {
    const dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return { status: 404, message: "User not found in database" };
    }

    await db.searchHistory.create({
      data: {
        userId: dbUser.id,
        url: url,
        sessionId: sessionId,
      },
    });

    return { status: 200 };
  } catch (error: any) {
    console.error("Error saving search history:", error);
    return { status: 400, message: error.message };
  }
};