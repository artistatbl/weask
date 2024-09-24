import { ragChat } from "@/lib/rag-chat";
import { db } from "@/lib/db";
import { ratelimitConfig } from "@/lib/rateLimiter";
import { User } from "@clerk/nextjs/server";

export async function processChatStream(user: User, messages: any[], sessionId: string, userPlan: string) {
  // Apply rate limiting
  if (ratelimitConfig.enabled && ratelimitConfig.ratelimit) {
    try {
      const { success, reset, remaining } = await ratelimitConfig.ratelimit.limit(user.id);
      const resetInMinutes = Math.ceil((reset - Date.now()) / 60000);
      console.log(`Rate limit check for user ${user.id}: success=${success}, remaining=${remaining}, reset in ${resetInMinutes} minutes`);
      if (!success) {
        throw { 
          status: 429, 
          message: `Rate limit exceeded. Please try again in ${resetInMinutes} minutes.`, 
          reset: resetInMinutes 
        };
      }
    } catch (error) {
      console.error("Rate limiting error:", error);
      // If there's an error with rate limiting, we'll log it but allow the request to proceed
    }
  }

  const lastMessage = messages[messages.length - 1].content;

  // Find the user in the database
  const dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser) {
    throw { status: 404, message: "User not found in database" };
  }

  // Save user message to database
  await db.chatMessage.create({
    data: {
      sessionId,
      role: "user",
      content: lastMessage,
      userId: dbUser.id,
    },
  });

  // Process the chat with ragChat
  const aiOptions = userPlan === 'premium' ? { advanced: true } : { basic: true };
  return ragChat.chat(lastMessage, { streaming: true, sessionId, ...aiOptions });
}