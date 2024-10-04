"use client";

import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsentPopup: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('user-consent');
    if (!consent) {
      setShowPopup(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('user-consent', 'accepted');
    setShowPopup(false);
  };

  const handleDecline = () => {
    localStorage.setItem('user-consent', 'declined');
    setShowPopup(false);
  };

  if (!showPopup) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-5 right-5 left-5 md:left-auto md:w-[448px] z-50"
        >
          <Alert variant="default" className="bg-white border border-gray-200 text-gray-800 shadow-2xl rounded-xl overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300"></div>
            <div className="flex items-start">
              <Cookie className="h-6 w-6 text-orange-500 mt-1" />
              <div className="ml-3 flex-1">
                <AlertTitle className="text-xl font-bold text-gray-900 mb-2">Cookie Settings</AlertTitle>
                <AlertDescription className="text-sm text-gray-600">
                  We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies.
                </AlertDescription>
                <div className="mt-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button variant="outline" onClick={handleDecline} className="text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900">
                    Decline
                  </Button>
                  <Button 
                    onClick={handleAccept} 
                    className="bg-orange-500 text-white hover:bg-orange-300 hover:text-gray-800 transition-colors"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 text-zinc-900 hover:text-zinc-950 hover:bg-orange-300"
              onClick={handleDecline}
            >
              <X className="h-4 w-4" />
            </Button>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentPopup;