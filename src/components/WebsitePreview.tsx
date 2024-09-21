import React, { useState, useEffect } from 'react';
import { Skeleton } from "@nextui-org/react";

interface WebsitePreviewProps {
  url: string;
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [url]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="h-full relative">
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="w-full h-full rounded-none">
            <div className="h-full bg-default-300"></div>
          </Skeleton>
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