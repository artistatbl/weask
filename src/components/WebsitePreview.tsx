import React, { useState, useEffect } from 'react';
import { Skeleton } from "@nextui-org/react";

interface WebsitePreviewProps {
  url: string;
}

const CustomSkeleton: React.FC<React.ComponentProps<typeof Skeleton>> = (props) => {
  return <Skeleton {...props} className={`bg-zinc-600 ${props.className || ''}`} />;
};

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [url]);

  const handleIframeLoad = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="h-full relative">
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
                <CustomSkeleton className="w-full h-48 mb-4 rounded-lg" />
                {[...Array(3)].map((_, i) => (
                  <CustomSkeleton key={i} className="w-full h-4 mb-2 rounded-lg" />
                ))}
                <CustomSkeleton className="w-full h-48 mb-4 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      )}
      <iframe 
        src={url} 
        title="Website Preview" 
        className="w-full h-full border-0 website-preview" 
        onLoad={handleIframeLoad}
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
      />
    </div>
  );
};

export default WebsitePreview;