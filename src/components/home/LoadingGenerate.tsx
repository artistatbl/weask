"use client"

import React, { useState, useEffect } from 'react';
import { ReportType } from '@/types/report';
import { Loader2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress"

interface LoadingPageProps {
  reportType: ReportType;
  onComplete: () => void;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ reportType, onComplete }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return newTime;
      });

      setProgress((prevProgress) => {
        const newProgress = prevProgress + (100 / reportType.estimatedTime);
        return Math.min(newProgress, 100);
      });
    }, 1000);

    setTimeRemaining(reportType.estimatedTime);

    return () => clearInterval(interval);
  }, [reportType.estimatedTime, onComplete]);


  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-800 text-white p-8">
   
       
        <h2 className="text-3xl font-bold mt-4 mb-2">Generating {reportType.name}</h2>
        <p className="text-zinc-400 mb-6">Please wait while we create your content</p>

        <div className="mb-4">
          <Progress value={progress} className="h-2 bg-zinc-700" />
        </div>

        <div className="flex items-center justify-center space-x-2 text-zinc-400">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          <span className="text-orange-500 font-medium">{timeRemaining} seconds remaining</span>
        </div>
  
    
    </div>
  );
};

export default LoadingPage;