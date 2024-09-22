import { Message as AIMessage } from "ai/react";
import { Message } from "./Message";
import { MessageSquare } from "lucide-react";

interface MessagesProps {
  messages: AIMessage[];
}

export const Messages = ({ messages }: MessagesProps) => {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 ai-response">
        <MessageSquare className="size-16 text-blue-500" />
        <h3 className="font-semibold text-2xl text-white">Welcome to NectLink Chat!</h3>
        <p className="text-zinc-400 text-center max-w-sm">
          Start your conversation by asking a question about the website you're exploring.
          Our AI is ready to assist you!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 p-4 ai-response">
      {messages.map((message, index) => (
        <Message
          key={index}
          content={message.content}
          isUserMessage={message.role === "user"}
        />
      ))}
    </div>
  );
};