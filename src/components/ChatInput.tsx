"use client";

import { Button, Textarea } from "@nextui-org/react";
import { Send } from "lucide-react";
import { type useChat } from "ai/react";

type HandleInputChange = ReturnType<typeof useChat>["handleInputChange"];
type HandleSubmit = ReturnType<typeof useChat>["handleSubmit"];
type SetInput = ReturnType<typeof useChat>["setInput"];

interface ChatInputProps {
  input: string;
  handleInputChange: HandleInputChange;
  handleSubmit: HandleSubmit;
  setInput: SetInput;
}

export const ChatInput = ({ handleInputChange, handleSubmit, input, setInput }: ChatInputProps) => {
  return (
    <div className="z-10 bg-zinc-800 absolute bottom-0 left-0 w-full chat-input">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <form onSubmit={handleSubmit} className="relative">
              <Textarea
                minRows={4}
                autoFocus
                onChange={handleInputChange}
                value={input}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                    setInput("");
                  }
                }}
                placeholder="Enter your question..."
                className="resize-none bg-zinc-800 hover:bg-zinc-800 rounded-xl text-base"
              />

              <Button
                size="sm"
                type="submit"
                className="absolute z-10 border-2 border-black bg-gray-200 right-2 bottom-2"
              >
                <Send className="size-4" />
              </Button>
            </form>

            <h1 className="text-center pt-2 text-gray-400 font-light text-xs">NectLink can make mistakes. Check important info. </h1>
          </div>
        </div>
      </div>
    </div>
  );
};