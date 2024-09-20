'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UrlForm() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      router.push(`/chat/${encodeURIComponent(url)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow border-zinc-900 rounded-md border-1">
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
          />
        </div>
        <Button type="submit" className="w-full md:w-auto">
          Chat
        </Button>
      </div>
    </form>
  );
}