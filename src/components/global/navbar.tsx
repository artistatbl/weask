'use client'
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MenuIcon } from 'lucide-react';
// import { UserButton } from '@clerk/nextjs';
// import Button from '../cartoon/Button'; 


// Adjust the path to where you save Button.tsx
// import { ModeToggle } from '@/components/global/mode-toggle';
import { usePathname } from 'next/navigation';
import classnames from "classnames"
// import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from '@clerk/nextjs';


type Props = {
  
};



const Navbar =  async  ( props: Props) => {

// const user = await currentUser()

   const currentPath = usePathname();
  return (
    <header className="fixed right-0 text-gray-500 dark:text-white  dark:bg-neutral-950 left-0 top-0 py-4 px-4 bg-white backdrop-blur-lg z-[100] flex items-center   justify-between">
      <aside className="flex ml-10 items-center gap-[2px] text-black dark:text-white">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>

        <p className="text-lg  font-extrabold">Nexus</p>
        {/* <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg> */}
        <p className="text-lg  font-extrabold">Flow</p>
      </aside>
      <nav className="absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] hidden md:block">
        <ul className="flex items-center gap-4 ml-12 list-none font-semibold">
          <li>
            <Link href="/"
              className={classnames({
                "text-black dark:text-white relative": currentPath === "/",
                "text-neutral-500 dark:text-neutral-400": currentPath !== "/",
              })}
            >
              Home
              {currentPath === "/" && <span className="absolute left-0 right-0 bottom-[-10px] h-1 w-1 bg-black dark:bg-white rounded-full mx-auto"></span>}
            </Link>
          </li>
          <li>
            <Link href="/pricing"
              className={classnames({
                "text-black dark:text-white relative": currentPath === "/pricing",
                "text-neutral-500 dark:text-neutral-400": currentPath !== "/pricing",
              })}
            >
              Pricing
              {currentPath === "/pricing" && <span className="absolute left-0 right-0 bottom-[-10px] h-1 w-1 bg-black dark:bg-white rounded-full mx-auto"></span>}
            </Link>
          </li>
          <li>
            <Link href="/blog"
              className={classnames({
                "text-black dark:text-white relative": currentPath === "/documentation",
                "text-neutral-500 dark:text-neutral-400": currentPath !== "/documentation",
              })}
            >
              Blog
              {currentPath === "/blog" && <span className="absolute left-0 right-0 bottom-[-10px] h-1 w-1 bg-black dark:bg-white rounded-full mx-auto"></span>}
            </Link>
          </li>
        </ul>
      </nav>
      <aside className="flex items-center gap-4">
        {/* <Button>
        </Button> */}
         
        {/* {user ? <UserButton afterSignOutUrl="/" /> : null} */}
        <MenuIcon className="md:hidden" />
        {/* <ModeToggle /> */}
        <UserButton/>


      </aside>
    </header>
  );
};

export default Navbar;