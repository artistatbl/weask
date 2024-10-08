import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

interface MessageProps {
  content: string;
  isUserMessage: boolean;
  aiState?: 'thinking' | 'responding' | null;
}

export const Message = ({ content, isUserMessage, aiState }: MessageProps) => {
  const { user } = useUser();
  const userAvatarUrl = user?.imageUrl;

  return (
    <div className="flex justify-center mb-2">
      <div className="w-full max-w-2xl px-4">
        <div
          className={cn(
            "px-2 pt-3 pb-2 rounded-lg text-sm max-w-[80%] inline-flex items-start text-white relative",
            {
              "bg-zinc-950 ml-4": isUserMessage,
              "bg-zinc-900": !isUserMessage
            }
          )}
        >
          {isUserMessage && (
            <div className="absolute left-2 top-2">
              <div className="size-6 rounded-full border border-zinc-600 bg-orange-800 flex justify-center items-center overflow-hidden">
                {userAvatarUrl ? (
                  <Image src={userAvatarUrl} alt="User" width={24} height={24} />
                ) : (
                  <User className="size-3 text-zinc-200" />
                )}
              </div>
            </div>
          )}
          <div className={cn("", { "ml-8": isUserMessage })}>
            {aiState && (
              <div className="flex items-center space-x-2 text-zinc-400 mb-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-orange-600  rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-orange-600  rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="font-medium text-orange-600">
                  {aiState === 'thinking' ? 'Thinking...' : 'Responding...'}
                </span>
              </div>
            )}
            <pre className="whitespace-pre-wrap">{content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};