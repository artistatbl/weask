import React from 'react';
import Footer from '@/components/global/footer'
import Navbar from '@/components/global/navbar'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-white min-h-screen ">
        <div className="text-center px-4 py-10">
          <AlertCircle className="mx-auto text-red-500 w-16 h-16 mb-6" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops! Page Not Found</h1>
          <p className="text-gray-600 mb-8">The page you&apos;re looking for seems to have wandered off. Don&apos;t worry, it happens to the best of us!</p>
          <Link href="/" className="inline-block bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition duration-300 ease-in-out hover:from-purple-600 hover:to-pink-600 transform hover:-translate-y-1 hover:shadow-lg">
            Return to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
