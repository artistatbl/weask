'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import Link from 'next/link'
import { LockIcon, XIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface NoSubscriptionProps {
  message?: string
  subscriptionStatus?: string
  onClose?: () => void
}

export default function NoSubscription({
  message = "Subscription required to access this feature.",
  subscriptionStatus = "No active subscription",
  onClose
}: NoSubscriptionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-[90vw] sm:max-w-md"
      >
        <Card className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-zinc-800 text-white relative py-6 sm:py-8">
            {onClose && (
              <button
                onClick={onClose}
                className="absolute top-2 right-2 text-black hover:text-white transition-colors"
                aria-label="Close"
              >
                <XIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            )}
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="bg-white/20 p-2 sm:p-3 rounded-full">
                <LockIcon className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-center">Subscription Required</CardTitle>
            <CardDescription className="text-white text-sm sm:text-base text-center mt-2">
              Your current status: {subscriptionStatus}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <p className="text-center text-zinc-900 dark:text-gray-300 text-base sm:text-lg">{message}</p>
          </CardContent>
          <CardFooter className="flex justify-center pb-6 sm:pb-8">
            <Link href="/#pricing" className="w-full max-w-xs">
              <Button 
                variant="default" 
                className="w-full bg-orange-500 hover:zinc-600 text-white font-bold  py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
              >
                Upgrade
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  )
}