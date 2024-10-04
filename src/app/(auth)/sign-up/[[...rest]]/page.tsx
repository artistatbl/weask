"use client"
import { SignUp } from '@clerk/nextjs'
import React, { useState, useEffect } from 'react'
import LoadingSpinner from '@/components/home/Loading'

export default function Page() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className=" flex items-center justify-center">
      <SignUp 
        appearance={{
          elements: {
            rootBox: 'w-full max-w-md',
            card: 'bg-white shadow-lg rounded-lg p-8 w-full',
            headerTitle: 'text-3xl font-semibold text-gray-800 mb-2 text-center',
            headerSubtitle: 'text-gray-500 mb-6 text-center',
            formButtonPrimary: 'w-full bg-orange-600 text-white font-medium py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50',
            formFieldInput: 'w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
            formFieldLabel: 'text-sm font-medium text-gray-700 mb-1',
            footerAction: 'mt-6 text-center text-sm text-gray-600',
            footerActionLink: 'text-orange-600 hover:text-orange-700 font-medium',
            dividerLine: 'bg-gray-200',
            dividerText: 'text-gray-500',
            socialButtonsBlockButton: 'w-full border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 mb-2',
            socialButtonsBlockButtonText: 'text-gray-700',
            identityPreviewEditButton: 'text-orange-600 hover:text-orange-700',
            formFieldWarningText: 'text-yellow-600',
            formFieldErrorText: 'text-red-600',
          },
          layout: {
            socialButtonsPlacement: 'top',
            socialButtonsVariant: 'blockButton',
          },
        }} 
      />
    </div>
  )
}