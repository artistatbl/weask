import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

interface MessageProps {
  content: string;
  isUserMessage: boolean;
}

export const Message = ({ content, isUserMessage }: MessageProps) => {
  const { user } = useUser();
  const userAvatarUrl = user?.imageUrl;

  return (
    <div className="flex justify-center mb-2 ">
      <div className="w-full max-w-2xl px-4">
        <div className={cn(
          "px-2 pt-3 pb-2 rounded-lg text-sm max-w-[80%] inline-flex items-start text-white relative",
          {
            "bg-zinc-950 ml-4": isUserMessage,
            "bg-zinc-900": !isUserMessage
          }
        )}>
          {isUserMessage && (
            <div className="absolute left-2 top-2">
              <div className="size-6 rounded-full border border-zinc-600 bg-blue-950 flex justify-center items-center overflow-hidden">
                {userAvatarUrl ? (
                  <Image src={userAvatarUrl} alt="User" width={24} height={24} />
                ) : (
                  <User className="size-3 text-zinc-200" />
                )}
              </div>
            </div>
          )}
          <div className={cn("", { "ml-8": isUserMessage })}>{content}</div>
        </div>
      </div>
    </div>
  );
};