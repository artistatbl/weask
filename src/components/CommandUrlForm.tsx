'use client'

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';

interface CommandUrlFormProps {
  onSubmit: (url: string) => Promise<void>;
  initialUrl: string;
}

export default function CommandUrlForm({ onSubmit, initialUrl }: CommandUrlFormProps) {
  const [url, setUrl] = useState(initialUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

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

  const checkEmbeddability = useCallback(async (urlToCheck: string) => {
    if (!urlToCheck) return;

    setIsChecking(true);
    try {
      const response = await fetch(`/api/check-embeddability?url=${encodeURIComponent(urlToCheck)}`);
      const data = await response.json();

      if (!data.embeddable) {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error checking embeddability:', error);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const debouncedCheck = useDebouncedCallback(checkEmbeddability, 500);

  useEffect(() => {
    if (url && url !== initialUrl) {
      debouncedCheck(url);
    }
  }, [url, initialUrl, debouncedCheck]);

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
      <Button type="submit" disabled={isSubmitting || isChecking}>
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          'Chat'
        )}
      </Button>
    </form>
  );
}