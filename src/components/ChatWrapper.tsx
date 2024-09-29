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
import { useToast } from "@/hooks/use-toast";
import { GripVertical } from 'lucide-react'; 
import ErrorBoundary from "@/hooks/Error-Boundary";
import LoadingPage from "@/components/LoadingPage";

interface ChatWrapperProps {
  sessionId: string;
  initialMessages: Message[];
  isAlreadyIndexed: boolean;
}

export const ChatWrapper: FC<ChatWrapperProps> = ({ sessionId, initialMessages, isAlreadyIndexed }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(!isAlreadyIndexed);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { messages, handleInputChange, handleSubmit, input, setInput } = useChat({
    api: "/api/chat-stream",
    body: { sessionId },
    initialMessages: initialMessages.map(msg => ({ ...msg, id: msg.id.toString() })),
    onFinish: async (message) => {
      await saveChatMessage(sessionId, { ...message, id: message.id || uuidv4() } as Message);
    },
    onError: (error) => {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "An error occurred while sending your message",
        variant: "destructive",
      });
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
    console.log('isAlreadyIndexed:', isAlreadyIndexed);
    console.log('isLoading:', isLoading);

    const initializeChat = async () => {
      if (!isAlreadyIndexed) {
        for (let i = 0; i < 5; i++) {
          await new Promise(resolve => setTimeout(resolve, 800));
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

  console.log('Render - isLoading:', isLoading, 'isAlreadyIndexed:', isAlreadyIndexed);

  if (isLoading && !isAlreadyIndexed) {
    return <LoadingPage progress={loadingProgress} />;
  }

  return (
    <div className="flex h-screen w-full">
      <HomeSidebar />
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={50} minSize={30}>
          <div className="flex flex-col h-full">
            <div className="bg-zinc-800 p-4 flex justify-end">
            </div>
            <ScrollArea ref={scrollAreaRef} className="flex-1 h-[calc(100vh-8rem)] bg-zinc-800">
              <div className="p-2 mb-32">
                <ErrorBoundary fallback={<div>Error rendering messages</div>}>
                  <Messages messages={messages} />
                </ErrorBoundary>
              </div>
            </ScrollArea>
            <div className="bg-zinc-700 p-4 sticky bottom-0 left-0 right-0">
              <ChatInput
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={(e) => {
                  handleSubmit(e);
                  setTimeout(scrollToBottom, 500);
                }}
                setInput={setInput}
              />
            </div>
          </div>
        </Panel>
        <PanelResizeHandle className="resize-handle flex items-center justify-center">
          <div className="resize-handle-inner bg-zinc-700 hover:bg-zinc-500 transition-colors duration-200 flex items-center justify-center">
            <GripVertical className="text-zinc-950 w-10 h-10 pr-3 text-center" />
          </div>
        </PanelResizeHandle>
        <Panel defaultSize={50} minSize={30}>
          <WebsitePreview url={websiteUrl} />
        </Panel>
      </PanelGroup>
    </div>
  );
};
