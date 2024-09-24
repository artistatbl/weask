import { ChatWrapper } from "@/components/ChatWrapper";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";
import { fetchChatMessages, saveSearchHistory } from "@/app/actions/chat";
import { RedirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
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

  // Fetch chat history from the database
  const dbMessages = await db.chatMessage.findMany({
    where: { 
      sessionId,
      
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
};

export default Page;