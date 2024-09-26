import React, { useState, useEffect } from 'react';
import { Skeleton } from "@nextui-org/react";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle } from 'lucide-react'; // Import the error icon

interface WebsitePreviewProps {
  url: string;
}

const CustomSkeleton: React.FC<React.ComponentProps<typeof Skeleton>> = (props) => {
  return <Skeleton {...props} className={`bg-zinc-600 ${props.className || ''}`} />;
};

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canPreview, setCanPreview] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setCanPreview(false);

    const checkEmbeddability = async () => {
      const storedResult = localStorage.getItem(`embeddable_${url}`);
      
      if (storedResult) {
        const { embeddable, message } = JSON.parse(storedResult);
        if (!embeddable) {
          setError(message);
          showErrorToast(message);
        } else {
          setCanPreview(true);
          showSuccessToast();
        }
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/check-embeddability?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        localStorage.setItem(`embeddable_${url}`, JSON.stringify(data));

        if (!data.embeddable) {
          setError(data.message);
          showErrorToast(data.message);
        } else {
          setCanPreview(true);
          showSuccessToast();
        }
      } catch (err) {
        console.error("Error checking embeddability:", err);
        setError("Failed to check website preview availability.");
        showErrorToast("Failed to check website preview availability.");
      } finally {
        setIsLoading(false);
      }
    };

    checkEmbeddability();
  }, [url, toast]);

  const showErrorToast = (message: string) => {
    toast({
      title: "Website Preview Unavailable",
      description: message,
      variant: "destructive",
    });
  };

  const showSuccessToast = () => {
    toast({
      title: "Website Preview Available",
      description: "The website can be previewed successfully.",
      variant: "success",
    });
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setError("Failed to load the website preview.");
    showErrorToast("Failed to load the website preview.");
  };

  return (
    <div className="h-full relative ">
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
                {[...Array(3)].map((_, i) => (
                  <CustomSkeleton key={i} className="w-full h-4 mb-2 rounded-lg" />
                ))}
                <CustomSkeleton className="w-full h-48 mb-4 rounded-lg" />
                {[...Array(3)].map((_, i) => (
                  <CustomSkeleton key={i} className="w-full h-4 mb-2 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 text-white p-4 text-center">
          <div className="flex flex-col items-center">
            <AlertCircle className="w-20 h-20 text-red-500 mb-4" /> {/* Add the error icon */}
            <p>{error}</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="mt-2 text-blue-400 hover:underline block">
              Open website in new tab
            </a>
          </div>
        </div>
      ) : canPreview ? (
        <iframe 
          src={url} 
          title="Website Preview" 
          className="w-full h-full border-0 website-preview" 
          style={{ visibility: isLoading ? 'hidden' : 'visible' }}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      ) : null}
    </div>
  );
};

export default WebsitePreview;
