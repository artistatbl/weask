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
import { Message } from '@/types';
import { ScrollArea } from "@/components/ui/scroll-area";
import { saveChatMessage } from "@/app/actions/chat";

interface ChatWrapperProps {
  sessionId: string;
  initialMessages: Message[];
}

export const ChatWrapper: FC<ChatWrapperProps> = ({ sessionId, initialMessages }) => {
  const { messages, handleInputChange, handleSubmit, input, setInput } = useChat({
    api: "/api/chat-stream",
    body: { sessionId },
    initialMessages,
    onFinish: async (message) => {
      await saveChatMessage(sessionId, message as Message);
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const [websiteUrl, setWebsiteUrl] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (params && Array.isArray(params.url)) {
      const decodedUrl = decodeURIComponent(params.url.join('/'));
      setWebsiteUrl(decodedUrl);
      console.log("Website URL:", decodedUrl);
    }
  }, [params]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  return (
    <div className="flex h-screen w-full">
      <HomeSidebar />
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={50} minSize={30}>
          <div className="flex flex-col h-full">
            <div className="bg-zinc-800 p-4 flex justify-end">
            </div>
            <ScrollArea ref={scrollAreaRef} className="flex-1 h-[calc(100vh-8rem)] bg-zinc-800">
              <div className="p-4">
                <Messages messages={messages} />
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
        <PanelResizeHandle className="ResizeHandleOuter">
          <div className="ResizeHandleInner" />
        </PanelResizeHandle>
        <Panel defaultSize={50} minSize={30}>
          <WebsitePreview url={websiteUrl} />
        </Panel>
      </PanelGroup>
    </div>
  );
};