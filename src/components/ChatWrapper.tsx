"use client";

import { Message, useChat } from "ai/react";
import { Messages } from "./Messages";
import { HomeSidebar } from "@/components/home/sidebar";
import { ChatInput } from "./ChatInput";
import { useState, useEffect, useRef } from "react";
import { UserButton } from "@clerk/nextjs";
import WebsitePreview from './WebsitePreview';
import { useParams } from 'next/navigation';

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
  const websiteUrl = params && Array.isArray(params.url) ? decodeURIComponent(params.url.join('/')) : '';

  useEffect(() => {
    console.log("Params:", params);
    console.log("Website URL:", websiteUrl);
  }, [params, websiteUrl]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-screen">
      <HomeSidebar />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <div className="bg-zinc-800 p-4 flex justify-end">
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="flex-1 overflow-y-auto bg-zinc-800">
            <Messages messages={messages} />
            <div ref={messagesEndRef} />
          </div>
          <div className="bg-zinc-700 p-4 absolute bottom-0 left-0 right-0">
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
        {websiteUrl && (
          <div className="w-1/2 border-l">
            <WebsitePreview url={websiteUrl} />
          </div>
        )}
      </div>
    </div>
  );
};