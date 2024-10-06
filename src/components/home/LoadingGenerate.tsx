"use client"

import React, { useState, useEffect } from 'react';
import { ReportType } from '@/types/report';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingPageProps {
  reportType: ReportType;
  onComplete: () => void;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ reportType, onComplete }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

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
    }, 1000);

    setTimeRemaining(reportType.estimatedTime);

    return () => clearInterval(interval);
  }, [reportType.estimatedTime, onComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold mb-2">Generating {reportType.name}</h2>
        <p className="text-zinc-400 mb-4">Please wait while we create your content</p>

        <div className="flex items-center justify-center space-x-2 text-zinc-400">
          <Loader2 className="w-8 h-8 animate-spin " />
          <span className='text-orange-600'>{timeRemaining} seconds remaining</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-6 text-center"
      >
      </motion.div>
    </div>
  );
};

export default LoadingPage;