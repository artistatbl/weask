'use client'

import React from 'react'
import Link from 'next/link'
import { Home, DollarSign, BookOpen, Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, toggleSidebar }) => {
  const pathname = usePathname()

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/pricing', icon: DollarSign, label: 'Pricing' },
    { href: '/blog', icon: BookOpen, label: 'Blog' },
  ]

  return (
    <div className={`fixed inset-y-0 left-0 bg-zinc-900 text-white transition-all duration-300 ease-in-out ${isExpanded ? 'w-40' : 'w-16'} shadow-lg flex flex-col`}>
      <button
        onClick={toggleSidebar}
        className={`p-2 hover:bg-gray-800 rounded-md ${isExpanded ? 'mx-4 mt-4 w-10 h-10 flex items-center justify-center' : 'mx-auto mt-4'}`}
      >
        <Menu size={26} />
      </button>
      <nav className={`mt-4 ${isExpanded ? 'px-4' : 'hidden'}`}>
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="mb-2">
              {/* <Link href={item.href} className={`flex items-center p-2 rounded-md ${pathname === item.href ? 'bg-gray-800' : 'hover:bg-gray-900'}`}>
                <item.icon size={20} />
                <span className="ml-2 text-sm">{item.label}</span>
              </Link> */}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar