import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingPageProps {
  progress: number;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ progress }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-800 dark:bg-neutral-950">
      <Loader2 className="w-16 h-16 animate-spin text-white" />
      <h2 className="mt-4 text-2xl font-semibold text-white dark:text-gray-300">
        Indexing in Progress
      </h2>
      <p className="mt-2 text-gray-300 dark:text-gray-400">
        This may take a while. We&rsquo;re preparing your chat experience.
      </p>
      <div className="mt-4 w-64 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className="bg-blue-400 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-2 text-gray-300 dark:text-gray-400">
        {progress}% Complete
      </p>
    </div>
  );
};

export default LoadingPage;