"use client";

import { useChat } from "ai/react";
import { Messages } from "./Messages";
import { HomeSidebar } from "@/components/home/sidebar";
import { ChatInput } from "./ChatInput";
import { useState, useEffect, useRef } from "react";
import WebsitePreview from './WebsitePreview';
import { useParams } from 'next/navigation';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { FC } from 'react';
import { Message } from '@/utils/types'
import { ScrollArea } from "@/components/ui/scroll-area";
import { saveChatMessage } from "@/app/actions/chat";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
import { GripVertical } from 'lucide-react'; 
import LoadingPage from "@/components/LoadingPage";

interface RecentUrl {
  id: string;
  url: string;
  title: string;
  visitedAt: Date;
}

interface ChatWrapperProps {
  sessionId: string;
  initialMessages: Message[];
  isAlreadyIndexed: boolean;
  recentUrls: RecentUrl[];
}

export const ChatWrapper: FC<ChatWrapperProps> = ({ sessionId, initialMessages, isAlreadyIndexed, recentUrls }) => {
  const [isLoading, setIsLoading] = useState(!isAlreadyIndexed);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isDailyLimitReached, setIsDailyLimitReached] = useState(false);

  const { messages, handleInputChange, handleSubmit, input, setInput } = useChat({
    api: "/api/chat-stream",
    body: { sessionId },
    initialMessages: initialMessages.map(msg => ({ ...msg, id: msg.id.toString() })),
    onFinish: async (message) => {
      await saveChatMessage(sessionId, { ...message, id: message.id || uuidv4() } as Message);
      setIsChatLoading(false);
    },
    onError: (error) => {
      console.error("Chat error:", error);
      if (error.message.includes("Daily chat limit reached")) {
        setIsDailyLimitReached(true);
        toast.error("You've reached your daily chat limit. Please upgrade your plan for more access.");
      } else {
        toast.error("An error occurred while sending your message");
      }
      setIsChatLoading(false);
    },
  });

  const params = useParams();
  const [websiteUrl, setWebsiteUrl] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (params && Array.isArray(params.url)) {
      const decodedUrl = decodeURIComponent(params.url.join('/'));
      setWebsiteUrl(decodedUrl);
    }
  }, [params]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initializeChat = async () => {
      if (!isAlreadyIndexed) {
        for (let i = 0; i < 5; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          setLoadingProgress(prev => Math.min(prev + 20, 100));
        }
      }
      setIsLoading(false);
    };

    initializeChat();
  }, [isAlreadyIndexed]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  const handleChatSubmit: typeof handleSubmit = (e, chatRequestOptions) => {
    if (isDailyLimitReached) {
      toast.error("You've reached your daily chat limit. Please upgrade your plan for more access.");
      return;
    }
    setIsChatLoading(true);
    handleSubmit(e, chatRequestOptions);
    setTimeout(scrollToBottom, 500);
  };

  if (isLoading && !isAlreadyIndexed) {
    return <LoadingPage progress={loadingProgress} />;
  }

  return (
    <div className="flex h-screen w-full body">
      <HomeSidebar recentUrls={recentUrls} />
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={50} minSize={30}>
          <div className="flex flex-col h-full">
            <div className="bg-zinc-800 p-4 flex justify-end">
            </div>
            <ScrollArea ref={scrollAreaRef} className="flex-1 h-[calc(100vh-8rem)] bg-zinc-800">
              <div className="p-2 mb-32">
                <Messages messages={messages} isLoading={isChatLoading} />
                {/* {isDailyLimitReached && (
                  <div className="bg-red-500 text-white p-4 rounded-md mt-4">
                    You&apos;ve reached your daily chat limit. Please upgrade your plan for more access.
                  </div>
                )} */}
              </div>
            </ScrollArea>
            <div className="bg-zinc-700 p-4 sticky bottom-0 left-0 right-0">
              <ChatInput
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleChatSubmit}
                setInput={setInput}
                isLoading={isChatLoading}
                isDisabled={isDailyLimitReached}
              />
            </div>
          </div>
        </Panel>
        <PanelResizeHandle className="resize-handle flex items-center justify-center">
          <div className="resize-handle-inner border border-orange-500 bg-zinc-700 hover:bg-zinc-500 transition-colors duration-200 flex items-center justify-center">
            <GripVertical className="text-orange-600 w-10 h-10 pr-3 text-center" />
          </div>
        </PanelResizeHandle>
        <Panel defaultSize={50} minSize={30}>
          <WebsitePreview url={websiteUrl} />
        </Panel>
      </PanelGroup>
    </div>
  );
};