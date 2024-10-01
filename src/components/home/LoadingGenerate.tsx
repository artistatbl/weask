import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Generating content..." }) => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{message}</p>
    </div>
  );
};

export default LoadingSpinner;