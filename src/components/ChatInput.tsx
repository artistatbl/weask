"use client";

import { Button, Textarea } from "@nextui-org/react";
import { Send, Loader } from "lucide-react";
import { type useChat } from "ai/react";
import { FormEvent } from "react";

type HandleInputChange = ReturnType<typeof useChat>["handleInputChange"];
type SetInput = ReturnType<typeof useChat>["setInput"];

interface ChatInputProps {
  input: string;
  handleInputChange: HandleInputChange;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  setInput: SetInput;
  isLoading: boolean;
  isDisabled?: boolean; // Added this prop
}

export const ChatInput = ({ 
  handleInputChange, 
  handleSubmit, 
  input, 
  setInput, 
  isLoading, 
  isDisabled = false // Added this prop with a default value
}: ChatInputProps) => {
  return (
    <div className="z-10 bg-zinc-800 absolute bottom-0 left-0 w-full chat-input">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
              if (input.trim() && !isDisabled) {
                handleSubmit(e);
                setInput("");
              }
              e.preventDefault();
            }} className="relative">
              <Textarea
                minRows={4}
                autoFocus
                onChange={handleInputChange}
                value={input}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim() && !isDisabled) {
                      handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
                      setInput("");
                    }
                  }
                }}
                placeholder="Enter your question..."
                className="resize-none bg-zinc-800 hover:bg-zinc-800 rounded-xl text-base"
                disabled={isLoading || isDisabled}
              />

              <Button
                size="sm"
                type="submit"
                className="absolute z-10 border-2 border-black bg-gray-200 right-2 bottom-2"
                disabled={isLoading || !input.trim() || isDisabled}
              >
                {isLoading ? <Loader className="size-4 animate-spin" /> : <Send className="size-4" />}
              </Button>
            </form>

            <h1 className="text-center pt-2 text-gray-400 font-light text-xs">NectLink can make mistakes. Check important info.</h1>
          </div>
        </div>
      </div>
    </div>
  );
};