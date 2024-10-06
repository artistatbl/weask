"use client"
// LoadingPage.tsx

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { JobResult } from '@/utils/types';


interface LoadingPageProps {
  jobId: string;
  onComplete: (result: JobResult) => void;

}

const LoadingPage: React.FC<LoadingPageProps> = ({ jobId, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`/api/job/${jobId}`);
        const data = await response.json();

        if (data.status === 'completed') {
          setProgress(100);
          setStatus('Completed');
          onComplete(data.result);
        } else if (data.status === 'failed') {
          setStatus('Failed: ' + (data.error || 'Unknown error'));
        } else {
          // Simulate progress
          setProgress(prev => Math.min(prev + Math.random() * 10, 99));
          setStatus('Generating content...');
        }
      } catch (error) {
        console.error('Error fetching job status:', error);
        setStatus('Error: Unable to fetch status');
      }
    };

    const intervalId = setInterval(fetchProgress, 2000); // Poll every 2 seconds

    return () => clearInterval(intervalId);
  }, [jobId, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-800 dark:bg-neutral-950">
      <Loader2 className="w-16 h-16 animate-spin text-white" />
      <h2 className="mt-4 text-2xl font-semibold text-white dark:text-gray-300">
        Generating Content
      </h2>
      <p className="mt-2 text-gray-300 dark:text-gray-400">
        {status}
      </p>
      <div className="mt-4 w-64 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className="bg-blue-400 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-2 text-gray-300 dark:text-gray-400">
        {Math.round(progress)}% Complete
      </p>
    </div>
  );
};

export default LoadingPage;