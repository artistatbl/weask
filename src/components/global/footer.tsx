import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full border-t  border-slate-950 bg-white dark:bg-zinc-400 text-gray dark:text-black py-6 px-4  ">
      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-4 lg:space-y-0 lg:flex-row lg:justify-between rounded-lg ">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap">
            <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
          </svg>
          <p className="ml-1 font-extrabold">NexusFlow</p>
        </div>
        
        <div className="text-center text-black text-sm my-4 lg:my-0">
          <p>Copyright © 2024 By NexusFlow • All rights reserved</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-black text-sm">
          <a href="mailto:contact@nexusflow.io" className="hover:text-gray-600">contact@nexusflow.io</a>
          <a href="/privacy-policy" className="hover:text-gray-600">Privacy Policy</a>
          <a href="/terms-of-service" className="hover:text-gray-600">Terms Of Service</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
