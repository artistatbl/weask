import { type Message as TMessage } from "ai/react";
import { Message } from "@/components/Message";
import { MessageSquare, AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MessagesProps {
  messages: TMessage[];
  error?: string;
}

export const Messages = ({ messages, error }: MessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {messages.length ? (
        <>
          <div className="flex-1">
            {messages.map((message, i) => (
              <Message key={i} content={message.content} isUserMessage={message.role === "user"} />
            ))}
          </div>
          <div ref={messagesEndRef} className="h-40" />
        </>
      ) : (
        <div className="h-full flex flex-col items-center justify-center gap-2">
          <MessageSquare className="size-8 text-blue-500" />
          <h3 className="font-semibold text-xl text-white">You're all set!</h3>
          <p className="text-zinc-500 text-sm">Ask your first question to get started.</p>
        </div>
      )}
      {showError && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg flex items-center">
          <AlertCircle className="mr-2" />
          {error}
        </div>
      )}
    </div>
  );
};