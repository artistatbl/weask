import { ChatWrapper } from "@/components/ChatWrapper";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";
import { saveSearchHistory } from "@/app/actions/chat";
import { RedirectToSignIn } from "@clerk/nextjs";
import { prisma } from "@/lib/db";
import { ragChat } from "@/lib/rag-chat";
import { Message } from "@/utils/types";
import { Prisma } from "@prisma/client";

interface PageProps {
  params: {
    url: string | string[] | undefined;
  };
}

function reconstructUrl({ url }: { url: string[] }) {
  const decodedComponents = url.map((component) => decodeURIComponent(component));
  const result = decodedComponents.join('/').replace(/^https:\//, 'https://');
  console.log("Reconstructed URL:", result);
  return result;
}

const Page = async ({ params }: PageProps) => {
  const user = await currentUser();
  console.log("Current user:", user ? user.id : "Not authenticated");

  if (!user) {
    console.log("Redirecting to sign in");
    return <RedirectToSignIn />;
  }

  const sessionCookie = cookies().get("sessionId")?.value ?? 'default';
  const reconstructedUrl = reconstructUrl({ url: params.url as string[] });
  const sessionId = (reconstructedUrl + "--" + sessionCookie).replace(/[/:]/g, "");

  try {
    console.log("Checking if URL is already indexed");
    const isAlreadyIndexed = await redis.sismember("indexed-urls", reconstructedUrl) === 1;
    console.log("Is URL already indexed:", isAlreadyIndexed);

    console.log("Fetching user from database");
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return { status: 404, message: "User not found in database", messages: [] };
    }

    console.log("Fetching messages for session");
    const dbMessages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    });

    const initialMessages: Message[] = dbMessages.map((msg) => ({
      id: msg.id.toString(),
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
      createdAt: msg.createdAt,
    }));

    if (!isAlreadyIndexed) {
      console.log("URL not indexed, starting indexing process");
      try {
        const RagChatComponent = await ragChat;
        if (RagChatComponent && RagChatComponent.context && RagChatComponent.context.add) {
          await RagChatComponent.context.add({
            type: "html",
            source: reconstructedUrl,
            config: { chunkOverlap: 50, chunkSize: 200 },
          });
          await redis.sadd("indexed-urls", reconstructedUrl);
          console.log("URL indexed successfully");
        } else {
          console.error("RagChat or its context is not available");
        }
      } catch (error) {
        console.error("Error during indexing:", error);
      }
    }

    console.log("Saving search history");
    await saveSearchHistory(reconstructedUrl, sessionId);

    console.log("Rendering ChatWrapper");
    return (
      <ChatWrapper
        sessionId={sessionId}
        initialMessages={initialMessages}
        isAlreadyIndexed={isAlreadyIndexed}
      />
    );
  } catch (error: any) {
    console.error("Error in Page component:", error);
    console.error("Error stack:", error.stack);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error:", error.code, error.message);
      return (
        <div>Error with the database: {error.message}. Please try again later.</div>
      );
    } else if (error instanceof TypeError) {
      console.error("Type error:", error.message);
      return (
        <div>An unexpected type error occurred: {error.message}. Please try again later.</div>
      );
    }
    return <div>An unexpected error occurred. Please check the server logs for more details.</div>;
  }
}

export default Page;
