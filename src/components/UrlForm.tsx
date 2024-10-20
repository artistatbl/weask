'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import React from "react";

export default function UrlForm() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (url) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/check-embeddability?url=${encodeURIComponent(url)}`, {
          method: 'GET', // Ensure this is a GET request
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setTimeout(() => {
          if (data.isEmbeddable) {
            toast.success("Website preview is available. Starting chat...");
            router.push(`/chat/${encodeURIComponent(url)}`);
          } else {
            toast.error("This website cannot be embedded for preview.");
          }
        }, 4000); // 3-second delay for the toast
      } catch (error) {
        if (error instanceof Error) {
          toast.error("An error occurred: " + error.message);
        } else {
          toast.error("An error occurred and it's not an instance of Error");
        }
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 5000); // 3-second delay for the loader
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow border-black rounded-md border-1">
          <span className="absolute left-1 top-1/2 -translate-y-1/2 bg-zinc-900 text-white text-sm font-serif md:text-sm px-3 py-1 rounded">
            Url Link
          </span>
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="pl-20 md:pl-24 w-full"
            placeholder="Enter URL here"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Checking...
            </>
          ) : (
            'Start Chat'
          )}
        </Button>
      </div>
    </form>
  );
}
