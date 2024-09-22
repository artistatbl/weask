'use client'

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CommandUrlFormProps {
  onSubmit: (url: string) => Promise<void>;
  initialUrl: string;
}

export default function CommandUrlForm({ onSubmit, initialUrl }: CommandUrlFormProps) {
  const [url, setUrl] = useState(initialUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      setIsSubmitting(true);
      try {
        await onSubmit(url);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <Input 
        type="url" 
        value={url} 
        onChange={(e) => setUrl(e.target.value)}
        required
        className="flex-grow"
        placeholder="Enter URL here"
        disabled={isSubmitting}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          'Chat'
        )}
      </Button>
    </form>
  );
}