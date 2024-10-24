import { ChatWrapper } from "@/components/ChatWrapper";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";
// import { currentUser } from "@clerk/nextjs/server";
import { saveSearchHistory } from "@/app/actions/chat";
// import { RedirectToSignIn } from "@clerk/nextjs";
import { prisma } from "@/lib/db";
import { ragChat } from "@/lib/rag-chat";
import { Message } from "@/utils/types";
import { Prisma } from "@prisma/client";
import { onLoginUser } from "@/app/actions/auth"; 
import NoSubscription from "@/components/NoSubscription"; // Add this import



interface PageProps {
  params: {
    url: string | string[] | undefined;
  };
}

interface RecentUrl {
  id: string;
  url: string;
  title: string;
  visitedAt: Date;
}

function reconstructUrl({ url }: { url: string[] }) {
  const decodedComponents = url.map((component) => decodeURIComponent(component));
  const result = decodedComponents.join('/').replace(/^https:\/+/, 'https://');
  console.log("Reconstructed URL:", result);
  return result;
}

function generateUrlTitle(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostParts = urlObj.hostname.split('.');
    const domain = hostParts.length > 1 ? hostParts[hostParts.length - 2] : hostParts[0];
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    
    const prefix = domain.slice(0, 3).toUpperCase();

    let content = '';
    if (pathSegments.length > 0) {
      content = pathSegments[pathSegments.length - 1]
        .replace(/[-_]/g, ' ')
        .replace(/\.[^/.]+$/, '')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }

    const title = content ? `${prefix}: ${content}` : prefix;
    return title.length > 30 ? title.substring(0, 27) + '...' : title;
  } catch (error) {
    console.error("Error generating URL title:", error);
    return url.substring(0, 30);
  }
}

const Page = async ({ params }: PageProps) => {
  const loginResult = await onLoginUser();
  const sessionCookie = cookies().get("sessionId")?.value ?? 'default';
  const reconstructedUrl = reconstructUrl({ url: params.url as string[] });
  const sessionId = (reconstructedUrl + "--" + sessionCookie).replace(/[/:]/g, "");

  let chatContent = null;
  let noSubscriptionOverlay = null;

  try {
    const isAlreadyIndexed = await redis.sismember("indexed-urls", reconstructedUrl) === 1;

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

    if (!loginResult.user) {
      throw new Error("User authentication failed");
    }

    const recentSearchHistories = await prisma.searchHistory.findMany({
      where: { userId: loginResult.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        domain: true,
        createdAt: true,
      },
    });

    const normalizedUrls = new Map<string, RecentUrl>();
    recentSearchHistories.forEach(history => {
      const normalizedUrl = new URL(history.domain).toString();
      if (!normalizedUrls.has(normalizedUrl)) {
        normalizedUrls.set(normalizedUrl, {
          id: history.id,
          url: normalizedUrl,
          title: generateUrlTitle(normalizedUrl),
          visitedAt: history.createdAt,
        });
      }
    });

    const recentUrls: RecentUrl[] = Array.from(normalizedUrls.values()).slice(0, 5);

    if (!isAlreadyIndexed) {
      const RagChatComponent = await ragChat;
      if (RagChatComponent && RagChatComponent.context && RagChatComponent.context.add) {
        await RagChatComponent.context.add({
          type: "html",
          source: reconstructedUrl,
          config: { chunkOverlap: 50, chunkSize: 200 },
        });
        await redis.sadd("indexed-urls", reconstructedUrl);
      }
    }

    await saveSearchHistory(reconstructedUrl, sessionId);

    chatContent = (
      <>
      <ChatWrapper
        sessionId={sessionId}
        initialMessages={initialMessages}
        isAlreadyIndexed={isAlreadyIndexed}
        recentUrls={recentUrls}
        
        />
       
        </>

  
    );

    // Check if the user has an active subscription
    if (loginResult.status !== 200 || !loginResult.hasActiveSubscription) {
      let message, subscriptionStatus;
      switch (loginResult.status) {
        case 401:
          message = "Please sign in to access this feature.";
          subscriptionStatus = "Not signed in";
          break;
        case 403:
          message = loginResult.message;
          subscriptionStatus = loginResult.subscriptionStatus || "No active subscription";
          break;
        case 404:
          message = "User not found in database. Please contact support.";
          subscriptionStatus = "Account issue";
          break;
        case 400:
        default:
          message = loginResult.message || "Subscription required to access this feature.";
          subscriptionStatus = "No active subscription";
      }
      noSubscriptionOverlay = <NoSubscription message={message} subscriptionStatus={subscriptionStatus} />;
    }

  } catch (error: unknown) {
    console.error("Error in Page component:", error);
    console.error("Error stack:", (error as Error).stack);

    let errorMessage = "An unexpected error occurred. Please try again later.";
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = `Error with the database: ${error.message}. Please try again later.`;
    } else if (error instanceof TypeError) {
      errorMessage = `An unexpected type error occurred: ${error.message}. Please try again later.`;
    }
    
    noSubscriptionOverlay = <NoSubscription message={errorMessage} subscriptionStatus="Error" />;
  }

  return (
    <>
      {chatContent}
      {noSubscriptionOverlay}
    </>
  );
}

export default Page;

