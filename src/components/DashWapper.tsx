'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, ChevronLeft, ChevronRight, Inbox } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import UrlForm from './UrlForm'
import { HomeSidebar } from '@/components/home/sidebar'
import { Skeleton } from "@/components/ui/skeleton"
import { serializeSubscription } from '@/utils/serializeSubscription'

interface RecentUrl {
  id: string
  url: string
  title: string
  visitedAt: Date
}

interface DashWrapperProps {
  recentUrls?: RecentUrl[]
  subscription?: ReturnType<typeof serializeSubscription> | null
}

function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-lg" />
      ))}
    </div>
  )
}

function NoRecentUrls() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Inbox className="h-12 w-12 text-zinc-400 mb-4" />
      <h3 className="text-xl font-semibold mb-2">No recent URLs</h3>
      <p className="text-zinc-400">Start by adding a URL to chat with.</p>
    </div>
  )
}

export default function Component({ 
  recentUrls = [],
  subscription 
}: DashWrapperProps) {
  const { user, isLoaded } = useUser()
  const [isContentVisible, setIsContentVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => setIsContentVisible(true), 300)
    }
  }, [isLoaded])

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return `${seconds} seconds ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    return `${Math.floor(seconds / 86400)} days ago`
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const firstName = user?.firstName || user?.username || ''
  const planName = subscription?.plan?.name || 'Professional Plan'

  const paginatedUrls = recentUrls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(recentUrls.length / itemsPerPage)

  return (
    <div className="flex h-screen w-full body text-zinc-100 bg-zinc-800">
      <HomeSidebar recentUrls={recentUrls} />
      <main className="flex-1 flex flex-col items-center overflow-y-auto">
        <div className="w-full max-w-xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-orange-50 backdrop-blur-lg text-black px-3 py-1 rounded-full text-sm mb-4">
              {planName}
            </div>
            <h1 className="text-4xl font-light mb-2 transition-opacity duration-300 ease-in-out" style={{ opacity: isLoaded ? 1 : 0 }}>
              <span className="text-orange-500 mr-2">✨</span>
              {getGreeting()} {firstName}
            </h1>
          </div>

          <div className="mb-12 w-full">
            <UrlForm />
          </div>

          <div className="space-y-4 w-full">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center text-zinc-400">
                <MessageSquare className="h-4 w-4 mr-2" />
                Your recent chats
              </div>
              <Button variant="ghost" className="text-zinc-400 text-sm">
                View all →
              </Button>
            </div>
            <div className="transition-opacity duration-300 ease-in-out" style={{ opacity: isContentVisible ? 1 : 0 }}>
              {isLoaded ? (
                recentUrls.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {paginatedUrls.map((url) => (
                        <Card 
                          key={url.id} 
                          className="hover:bg-zinc-700 transition-colors duration-200 cursor-pointer"
                          onClick={() => window.location.href = `/chat/${encodeURIComponent(url.url)}`}
                        >
                          <CardHeader>
                            <CardTitle className="text-lg">{url.title}</CardTitle>
                            <CardDescription className="text-sm text-zinc-400">
                              {getTimeAgo(url.visitedAt)}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center mt-6 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-zinc-400">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <NoRecentUrls />
                )
              ) : (
                <SkeletonLoader />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}