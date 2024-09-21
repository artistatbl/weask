'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Home, DollarSign, BookOpen, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, toggleSidebar }) => {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/pricing', icon: DollarSign, label: 'Pricing' },
    { href: '/blog', icon: BookOpen, label: 'Blog' },
  ]

  return (
    <>
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className={`fixed top-4 left-4 z-50 p-2 rounded-md text-white ${isExpanded ? 'bg-zinc-900' : 'bg-zinc-800'}`}
        >
          <Menu size={24} />
        </button>
      )}
      <div className={`fixed inset-0 text-white transition-all duration-300 ease-in-out 
        ${isExpanded ? 'bg-zinc-900' : 'bg-zinc-800'}
        ${isMobile 
          ? (isExpanded ? 'translate-x-0' : '-translate-x-full') 
          : (isExpanded ? 'w-40' : 'w-16')
        } 
        ${isMobile ? 'z-40' : ''} md:relative md:translate-x-0 md:h-screen`}>
        <div className="flex flex-col h-full">
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-md ${isMobile ? 'absolute top-4 right-4' : (isExpanded ? 'mx-4 mt-4 w-10 h-10 flex items-center justify-center' : 'mx-auto mt-4')}
            ${isExpanded ? 'hover:bg-zinc-900' : 'hover:bg-gray-800'}`}
          >
            {isMobile ? <X size={24} /> : <Menu size={26} />}
          </button>
          <nav className={`mt-16 px-4 ${!isExpanded && !isMobile ? 'hidden' : ''}`}>
            <ul>
              {navItems.map((item) => (
                <li key={item.href} className="mb-4">
                  <Link href={item.href} className={`flex items-center p-2 rounded-md 
                    ${pathname === item.href 
                      ? (isExpanded ? 'bg-gray-800' : 'bg-gray-800') 
                      : (isExpanded ? 'hover:bg-gray-800' : 'hover:bg-gray-800')}`}>
                    <item.icon size={20} />
                    {(isExpanded || isMobile) && <span className="ml-2 text-sm">{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Sidebar