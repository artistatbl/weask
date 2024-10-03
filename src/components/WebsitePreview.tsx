// src/components/WebsitePreview.tsx

import React, { useState, useEffect } from 'react';
import { Skeleton } from "@nextui-org/react";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from 'lucide-react';

interface WebsitePreviewProps {
  url: string;
}

const CustomSkeleton: React.FC<React.ComponentProps<typeof Skeleton>> = (props) => (
  <Skeleton {...props} className={`bg-zinc-600 ${props.className || ''}`} />
);

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEmbeddable, setIsEmbeddable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkEmbeddability = async () => {
      if (url) {
        setIsLoading(true);
        setError(null);
        try {
          const [embeddabilityResponse] = await Promise.all([
            fetch(`/api/check-embeddability?url=${encodeURIComponent(url)}`, {
              method: 'GET',
            }),
            new Promise(resolve => setTimeout(resolve, 2000)) // 2-second minimum delay
          ]);

          if (!embeddabilityResponse.ok) {
            throw new Error(`HTTP error! status: ${embeddabilityResponse.status}`);
          }

          const data = await embeddabilityResponse.json();
          setIsEmbeddable(data.isEmbeddable);
        } catch (error) {
          console.error('Error checking embeddability:', error);
          setError('Failed to check if the website can be embedded.');
          setIsEmbeddable(false);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkEmbeddability();
  }, [url]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    if (!error) {
      setError("Failed to load the website preview.");
      toast({
        title: "Website Preview Issue",
        description: "Failed to load the website preview.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full relative website-preview">
      {isLoading && (
        <div className="absolute inset-0 p-4 bg-zinc-800">
          <div className="flex flex-col h-full">
            <CustomSkeleton className="w-full h-16 mb-4 rounded-lg" />
            <div className="flex flex-1">
              <div className="w-1/4 pr-4">
                <CustomSkeleton className="w-full h-full rounded-lg" />
              </div>
              <div className="w-3/4 flex flex-col">
                <CustomSkeleton className="w-3/4 h-8 mb-4 rounded-lg" />
                {[...Array(5)].map((_, i) => (
                  <CustomSkeleton key={i} className="w-full h-4 mb-2 rounded-lg" />
                ))}
                <CustomSkeleton className="w-full h-48 mb-4 rounded-lg" />
                {[...Array(6)].map((_, i) => (
                  <CustomSkeleton key={i} className="w-full h-4 mb-2 rounded-lg" />
                ))}
                  <CustomSkeleton className="w-full h-48 mb-4 rounded-lg" />
                {/* {[...Array(4)].map((_, i) => (
                  <CustomSkeleton key={i} className="w-full h-4 mb-2 rounded-lg" />
                ))} */}
                 <CustomSkeleton className="w-full h-48 mb-4 rounded-lg" />
                 {[...Array(5)].map((_, i) => (
                  <CustomSkeleton key={i} className="w-full h-4 mb-2 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {!isLoading && isEmbeddable && (
        <iframe
          src={url}
          title="Website Preview"
          className="w-full h-full  border-0"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      )}
      {!isLoading && (error || !isEmbeddable) && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-white p-4 text-center">
          <div className="flex flex-col items-center">
            <AlertCircle className="w-24 h-24 text-red-500 mb-4" />
            <p className='text-xl'>{error || "This website cannot be embedded."}</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="mt-2 text-blue-400 text-md hover:underline">
              Open website in new tab
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsitePreview;
