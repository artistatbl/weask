'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react"; // Import the spinner icon

export default function UrlForm() {
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      setIsSubmitting(true);
      toast({
        title: "Redirecting",
        description: "You're being redirected to the chatbox. Please wait...",
        variant: "success",
      });
      try {
        // Simulate a delay to show the spinner (remove this in production)
        await new Promise(resolve => setTimeout(resolve, 2000));
        await router.push(`/chat/${encodeURIComponent(url)}`);
      } catch (error) {
        console.error("Navigation error:", error);
        toast({
          title: "Error",
          description: "There was an error redirecting you. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
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
            disabled={isSubmitting}
          />
        </div>
        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading...
            </>
          ) : (
            'Chat'
          )}
        </Button>
      </div>
    </form>
  );
}