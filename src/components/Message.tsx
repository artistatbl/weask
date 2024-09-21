import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

interface MessageProps {
  content: string;
  isUserMessage: boolean;
}

export const Message = ({ content, isUserMessage }: MessageProps) => {
  const { user } = useUser();
  const userName = user 
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || "User" 
    : "User";
  const userAvatarUrl = user?.imageUrl;

  return (
    <div
      className={cn({
        "bg-zinc-800": isUserMessage,
        "bg-zinc-900/25": !isUserMessage,
      })}
    >
      <div className="p-6">
        <div className="max-w-3xl mx-auto flex items-start gap-2.5">
          <div
            className={cn(
              "size-8 shrink-0 aspect-square rounded-full border border-zinc-700 bg-zinc-900 flex justify-center items-center overflow-hidden",
              {
                "bg-blue-950 border-blue-700": isUserMessage,
              }
            )}
          >
            {isUserMessage ? (
              userAvatarUrl ? (
                <Image src={userAvatarUrl} alt={userName} width={30} height={30} />
              ) : (
                <User className="size-4 text-zinc-200" />
              )
            ) : (
              <Bot className="size-4 text-white" />
            )}
          </div>

          <div className="flex flex-col ml-4 w-full">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-white dark:text-white">
                {isUserMessage ? userName : "Website"}
              </span>
            </div>

            <p className="text-sm font-normal py-2.5 text-white dark:text-white">{content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};