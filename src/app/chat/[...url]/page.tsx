import { ChatWrapper } from "@/components/ChatWrapper";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";
import { saveSearchHistory } from "@/app/actions/chat";
import { RedirectToSignIn } from "@clerk/nextjs";
import { prisma } from "@/lib/db";
import { ragChat } from "@/lib/rag-chat"; 
import { Message } from "@/utils/types";

interface PageProps {
  params: {
    url: string | string[] | undefined;
  };
}

function reconstructUrl({ url }: { url: string[] }) {
  const decodedComponents = url.map((component) => decodeURIComponent(component));
  return decodedComponents.join("//");
}

const Page = async ({ params }: PageProps) => {
  const user = await currentUser();
  if (!user) {
    return <RedirectToSignIn />;
  }

  const sessionCookie = cookies().get("sessionId")?.value;
  const reconstructedUrl = reconstructUrl({ url: params.url as string[] });
  const sessionId = (reconstructedUrl + "--" + sessionCookie).replace(/\//g, "");

  const isAlreadyIndexed = await redis.sismember("indexed-urls", reconstructedUrl);

  try {
    // Fetch the user from the database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return { status: 404, message: "User not found in database", messages: [] };
    }

    // Fetch chat history from the database using the existing db client
    const dbMessages = await prisma.chatMessage.findMany({
      where: { 
        sessionId,
        userId: dbUser.id, // Ensure you fetch the messages of the current user
      },
      orderBy: { createdAt: 'asc' },
    });

    // Convert database messages to the expected Message type
    const initialMessages: Message[] = dbMessages.map(msg => ({
      id: msg.id.toString(),
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
      createdAt: msg.createdAt
    }));

    console.log("Fetched messages:", initialMessages.length);

    if (!isAlreadyIndexed) {
      await ragChat.context.add({
        type: "html",
        source: reconstructedUrl,
        config: { chunkOverlap: 50, chunkSize: 200 },
      });
      await redis.sadd("indexed-urls", reconstructedUrl);
    }

    await saveSearchHistory(reconstructedUrl, sessionId);

    return (
      <ChatWrapper sessionId={sessionId} initialMessages={initialMessages} />
    );
  } catch (error) {
    console.error("Error in Page component:", error);
    throw error; // Re-throw the error to be caught by Next.js error boundary
  }
};

export default Page;
