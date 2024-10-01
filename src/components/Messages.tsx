"use client";

import React, { useState, useEffect } from "react";
import { Message as TMessage } from "ai/react";
import { Message } from "./Message";
import { MessageSquare } from "lucide-react";

interface MessagesProps {
  messages: TMessage[];
  isLoading: boolean;
}

export const Messages: React.FC<MessagesProps> = ({ messages, isLoading }) => {
  const [aiState, setAiState] = useState<'thinking' | 'responding' | null>(null);

  useEffect(() => {
    if (isLoading) {
      // Set to 'thinking' immediately when loading starts
      setAiState('thinking');
      // After a short delay, change to 'responding'
      const timer = setTimeout(() => setAiState('responding'), 1500);
      return () => clearTimeout(timer);
    } else {
      setAiState(null);
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col space-y-4 p-4 ai-response">
      {messages.length ? (
        <>
          {messages.map((message, i) => (
            <Message 
              key={i} 
              content={message.content} 
              isUserMessage={message.role === "user"} 
              aiState={i === messages.length - 1 && message.role !== "user" ? aiState : null}
            />
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <Message 
              content="" 
              isUserMessage={false} 
              aiState={aiState}
            />
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <MessageSquare className="size-16 text-orange-600" />
          <h3 className="font-semibold text-2xl text-white">Welcome to NectLink Chat!</h3>
          <p className="text-zinc-400 text-center max-w-sm">
            Start your conversation by asking a question about the website you're exploring.
            Our AI is ready to assist you!
          </p>
        </div>
      )}
    </div>
  );
};