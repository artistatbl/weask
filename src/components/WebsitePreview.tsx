import React, { useState, useEffect } from 'react';
import { Skeleton } from "@nextui-org/react";

interface WebsitePreviewProps {
  url: string;
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, [url]);

  const handleIframeLoad = () => {
    // The iframe has loaded, but we'll keep the skeleton visible for at least 2 seconds
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="h-full relative">
      {isLoading && (
        <div className="absolute inset-0 p-4 bg-gray-100">
          <div className="flex flex-col h-full">
            {/* Header */}
            <Skeleton className="w-full h-16 mb-4 rounded-lg" />
            
            <div className="flex flex-1">
              {/* Sidebar */}
              <div className="w-1/4 pr-4">
                <Skeleton className="w-full h-full rounded-lg" />
              </div>
              
              {/* Main content */}
              <div className="w-3/4 flex flex-col">
                {/* Title */}
                <Skeleton className="w-3/4 h-8 mb-4 rounded-lg" />
                
                {/* Paragraphs */}
                <Skeleton className="w-full h-4 mb-2 rounded-lg" />
                <Skeleton className="w-full h-4 mb-2 rounded-lg" />
             
                
                {/* Image placeholder */}
                <Skeleton className="w-full h-48 mb-4 rounded-lg" />
                <Skeleton className="w-full h-48 mb-4 rounded-lg" />
               
                {/* Paragraphs */}
                <Skeleton className="w-full h-4 mb-2 rounded-lg" />
                <Skeleton className="w-full h-4 mb-2 rounded-lg" />
              

                   {/* Image placeholder */}
                   <Skeleton className="w-full h-48 mb-4 rounded-lg" />
                
                {/* More paragraphs */}
               
                <Skeleton className="w-full h-4 mb-2 rounded-lg" />
                <Skeleton className="w-4/5 h-4 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      )}
      <iframe 
        src={url} 
        title="Website Preview" 
        className="w-full h-full border-0" 
        onLoad={handleIframeLoad}
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
      />
    </div>
  );
};

export default WebsitePreview;