'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Menu} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

type NavItem = {
  name: string
  href: string
}

const navItems: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'Blog', href: '/blog' },
]

export default function Navbar() {
  const currentPath = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false); // Cleanup function to set it false when component unmounts
  }, []);

  const isActive = (href: string) => {
    if (href === '/') {
      return currentPath === href
    }
    return currentPath?.startsWith(href) || false
  }

  // Example usage in a hypothetical async function
  const fetchData = useCallback(async () => {
    if (!mounted) return; // Guard to check if component is still mounted
    // Perform fetch or other operations
  }, [mounted]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Include fetchData in the dependency array

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg backdrop-brightness-100 bg-background/80 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <svg className="h-8 w-8 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span className="ml-2 text-xl font-bold text-foreground">Konect</span>
          </Link>
          <nav className="hidden sm:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`inline-flex flex-col items-center px-1 pt-1 text-sm font-medium ${
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className=" h-1 w-1 mt-2 rounded-full bg-orange-600" aria-hidden="true" />
                )}
              </Link>
            ))}
          </nav>
          <div className="hidden sm:flex items-center space-x-4">
         
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="outline" className="border-gray-300 rounded-lg bg-orange-600 text-white">Get Started</Button>
              </Link>
            </SignedOut>
          </div>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon" className="sm:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>
                  <div className="flex items-center justify-center">
                    <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    <span className="ml-2 text-xl font-bold text-foreground">Konect</span>
                  </div>
                </DrawerTitle>
              </DrawerHeader>
              <div className="px-4 py-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex flex-col items-center justify-center px-3 py-2 rounded-md text-base font-medium ${
                      isActive(item.href)
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {item.name}
                    {isActive(item.href) && (
                      <span className="mt-1 h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
                    )}
                  </Link>
                ))}
              </div>
              <DrawerFooter>
                <div className="flex flex-col items-center space-y-4">
               
                  <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                  <SignedOut>
                    <Link href="/sign-in" className="w-full">
                      <Button variant="outline" className="w-full border-primary">Sign In</Button>
                    </Link>
                  </SignedOut>
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-full">Close</Button>
                  </DrawerClose>
                </div>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  )
}
