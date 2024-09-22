"use client";

import { Message, useChat } from "ai/react";
import { Messages } from "./Messages";
import { HomeSidebar } from "@/components/home/sidebar";
import { ChatInput } from "./ChatInput";
import { useState, useEffect, useRef } from "react";
import { UserButton } from "@clerk/nextjs";
import WebsitePreview from './WebsitePreview';
import { useParams } from 'next/navigation';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export const ChatWrapper = ({
  sessionId,
  initialMessages,
}: {
  sessionId: string;
  initialMessages: Message[];
}) => {
  const { messages, handleInputChange, handleSubmit, input, setInput } = useChat({
    api: "/api/chat-stream",
    body: { sessionId },
    initialMessages,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const [websiteUrl, setWebsiteUrl] = useState('');

  useEffect(() => {
    if (params && Array.isArray(params.url)) {
      const decodedUrl = decodeURIComponent(params.url.join('/'));
      setWebsiteUrl(decodedUrl);
      console.log("Website URL:", decodedUrl);
    }
  }, [params]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-screen w-full">
      <HomeSidebar />
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={50} minSize={30}>
          <div className="flex flex-col h-full">
            <div className="bg-zinc-800 p-4 flex justify-end">
              {/* <UserButton afterSignOutUrl="/" /> */}
            </div>
            <div className="flex-1 overflow-y-auto bg-zinc-800">
              <Messages messages={messages} />
              <div ref={messagesEndRef} />
            </div>
            <div className="bg-zinc-700 p-4 sticky bottom-0 left-0 right-0">
              <ChatInput
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={(e) => {
                  handleSubmit(e);
                  setTimeout(scrollToBottom, 100);
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