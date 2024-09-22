import { Message as AIMessage } from "ai/react";
import { Message } from "./Message";

interface MessagesProps {
  messages: AIMessage[];
}

export const Messages = ({ messages }: MessagesProps) => {
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