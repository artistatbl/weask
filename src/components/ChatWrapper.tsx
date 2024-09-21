"use client";

import { Message, useChat } from "ai/react";
import { Messages } from "./Messages";
import Sidebar from "./global/Sidebar";
import { ChatInput } from "./ChatInput";
import { useState } from "react";

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

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);

  return (
    <div className="flex h-screen">
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 text-black bg-zinc-800 overflow-y-auto">
          <Messages messages={messages} />
        </div>
        <div className="bg-zinc-700 p-4">
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            setInput={setInput}
          />
        </div>
      </div>
    </div>
  );
};