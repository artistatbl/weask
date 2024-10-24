'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

const navItems = [
  { name: 'Features', href: '/#features' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'FAQs', href: '/#faq' },
  { name: 'Blog', href: '/blog' },
 
]

export default function Navbar() {
  const currentPath = usePathname()

  const isActive = (href: string) => {
    if (href === '/') {
      return currentPath === href
    }
    return currentPath?.startsWith(href) || false
  }

  return (
    <header className="fixed top-0 z-50 w-full bg-background">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <svg className="h-6 w-6 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span className="font-semibold text-lg">Konect</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                px-3 py-2 text-sm transition-colors hover:text-foreground
                ${isActive(item.href) 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground'
                }
              `}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button 
                                        className="w-full bg-orange-500 hover:bg-orange-700 text-white"

              >Dashboard</Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          
          <SignedOut>
            <Link href="/sign-in">
              <Button 
                variant="default" 
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Sign In
              </Button>
            </Link>
          </SignedOut>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <div className="flex flex-col space-y-4 mt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      px-2 py-1 text-sm transition-colors hover:text-foreground
                      ${isActive(item.href) 
                        ? 'text-foreground font-medium' 
                        : 'text-muted-foreground'
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t">
                  <SignedIn>
                    <div className="flex flex-col space-y-4">
                      <Link href="/dashboard">
                        <Button 
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          Dashboard
                        </Button>
                      </Link>
                      <div className="flex items-center space-x-2">
                        <UserButton afterSignOutUrl="/" />
                        <span className="text-sm text-muted-foreground">Account</span>
                      </div>
                    </div>
                  </SignedIn>
                  <SignedOut>
                    <Link href="/sign-in">
                      <Button 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </SignedOut>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}