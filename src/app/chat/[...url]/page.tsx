import { ChatWrapper } from "@/components/ChatWrapper";
import { ragChat } from "@/lib/rag-chat";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";
// import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";
import { UserProfile } from "@clerk/nextjs";
import Sidebar from "@/components/global/Sidebar";

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
  console.log(user);
  if (!user) {
    // Redirect to login if user is not authenticated
    return <div>Please log in to access this page.</div>;
  }

  const sessionCookie = cookies().get("sessionId")?.value;
  const reconstructedUrl = reconstructUrl({ url: params.url as string[] });
  const sessionId = (reconstructedUrl + "--" + sessionCookie).replace(/\//g, "");

  const isAlreadyIndexed = await redis.sismember("indexed-urls", reconstructedUrl);
  const initialMessages = await ragChat.history.getMessages({ amount: 10, sessionId });

  if (!isAlreadyIndexed) {
    await ragChat.context.add({
      type: "html",
      source: reconstructedUrl,
      config: { chunkOverlap: 50, chunkSize: 200 },
    });
    await redis.sadd("indexed-urls", reconstructedUrl);
  }

  // Store user search history in Supabase
  // await supabase.from('search_history').insert({
  //   user_id: user.id,
  //   url: reconstructedUrl,
  //   session_id: sessionId,
  // });

  return (
    <div className="">

      {/* <Sidebar/> */}



      <ChatWrapper sessionId={sessionId} initialMessages={initialMessages} />
    </div>
  );
};

export default Page;