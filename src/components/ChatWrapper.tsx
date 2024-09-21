"use client";

import { Message, useChat } from "ai/react";
import { Messages } from "./Messages";
import Sidebar from "./global/Sidebar";
import { HomeSidebar } from "@/components/home/sidebar";

import { ChatInput } from "./ChatInput";
import { useState, useEffect, useRef } from "react";
import { UserButton } from "@clerk/nextjs";

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

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return (
    <div className="h-full flex justify-between">
      <HomeSidebar/>
      {/* <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} /> */}
      
      <div className="flex-1 flex flex-col h-full">
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
              // Scroll after a short delay to ensure the new message is rendered
              setTimeout(scrollToBottom, 100);
            }}
            setInput={setInput}
          />
        </div>
      </div>
    </div>
  );
};