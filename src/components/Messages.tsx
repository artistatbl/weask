import { Message as AIMessage } from "ai/react";
import { Message } from "./Message";
import { MessageSquare } from "lucide-react";

interface MessagesProps {
  messages: AIMessage[];
}

export const Messages = ({ messages }: MessagesProps) => {
  return (
    <div className="flex flex-col space-y-4 p-4 ai-response">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <MessageSquare className="size-16 text-blue-500" />
          <h3 className="font-semibold text-2xl text-white">Welcome to NectLink Chat!</h3>
          <p className="text-zinc-400 text-center max-w-sm">
            Start your conversation by asking a question about the website you're exploring.
            Our AI is ready to assist you!
          </p>
        </div>
      ) : (
        messages.map((message, index) => (
          <Message
            key={index}
            content={message.content}
            isUserMessage={message.role === "user"}
          />
        ))
      )}
    </div>
  );
};