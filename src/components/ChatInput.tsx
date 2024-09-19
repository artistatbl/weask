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
    <div className="z-10 border rounded-md absolute bottom-4 left-0 w-full">
      <div className="mx-2 flex flex-row gap-3  md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full  flex-grow p-4">
            <form onSubmit={handleSubmit} className="relative">
              <Textarea
                minRows={3}
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
                className="resize-none text-black font-bold hover:bg-zinc-900  text-base"
              />

              <Button
                size="sm"
                type="submit"
                className="absolute z-10 border   bg-zinc-500 right-2 bottom-2"
              >
                <Send className="size-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};