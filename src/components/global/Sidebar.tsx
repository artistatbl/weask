'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Home, DollarSign, BookOpen } from 'lucide-react'
import { usePathname } from 'next/navigation'

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true)
  const pathname = usePathname()

  const toggleSidebar = () => setIsExpanded(!isExpanded)

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/pricing', icon: DollarSign, label: 'Pricing' },
    { href: '/blog', icon: BookOpen, label: 'Blog' },
  ]

  return (
    <div className={`fixed top-16 left-0 h-screen bg-white dark:bg-zinc-800 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'} shadow-lg`}>
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-9 bg-white dark:bg-zinc-800 rounded-full p-1 shadow-md"
      >
        {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
      <nav className="mt-8">
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link href={item.href} className={`flex items-center p-2 ${pathname === item.href ? 'bg-gray-200 dark:bg-zinc-700' : ''}`}>
                <item.icon size={20} />
                {isExpanded && <span className="ml-4">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar