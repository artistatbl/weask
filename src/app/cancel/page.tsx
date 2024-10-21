import { Button } from "@/components/ui/button"
import { MessageSquareIcon, ArrowLeftIcon, LifeBuoyIcon, SubscriptIcon } from "lucide-react"
import { Payments } from '../../validation/user.shemas'
import React from "react"
import Navbar from "@/components/global/navbar"
import Footer from "@/components/global/footer"
import Link from "next/link"

export default function CancellationPage() {
  return (
    <>
      <Navbar />
      <div className="h-[70vh] bg-white flex items-center justify-center p-4">
        <section className="w-full max-w-md">
          <div className="text-center">
            <div className="mx-auto mb-4 bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
              <MessageSquareIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">Payment Cancelled</h1>
          </div>
          <div className="text-center mt-6 max-w-6xl">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-4">
              We're sorry to see you go. Your subscription to our chatbot service has been cancelled.
            </p>
           
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-4">
              Don't worry, your data will be safely stored for 30 days. If you change your mind, you can reactivate your subscription at any time during this period.
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600">
              If you have any questions or need assistance, our support team is here to help.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link href="/#pricing">
              <Button variant="outline" className="w-full sm:w-auto hover:text-white bg-orange-500 hover:bg-zinc-800 text-xs sm:text-sm md:text-base lg:text-lg">
                <SubscriptIcon className="mr-2 h-4 w-4" /> Reactivate Subscription
              </Button>
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}