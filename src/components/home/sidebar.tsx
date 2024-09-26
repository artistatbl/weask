"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconMessage,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserButton, useUser } from "@clerk/nextjs";

export function HomeSidebar() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const fullName: string = user ? `${user.firstName} ${user.lastName}` : ""; // Updated to provide type annotation and avoid self-reference

  // Placeholder for chat history
  const chatHistory = [
    { id: 1, title: "Recent Chat 1", date: "2023-04-15" },
    { id: 2, title: "Recent Chat 2", date: "2023-04-14" },
    { id: 3, title: "Older Chat 1", date: "2023-04-10" },
  ];

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-6">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Logo />
          <nav className="mt-6 flex flex-col gap-2">
            <SidebarLink
              link={{
                label: "New Chat",
                href: "#",
                icon: (
                  <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                ),
              }}
            />
         
            <div className="mt-4 transition-all duration-300 ease-in-out">
              {open && (
                <h3 className="px-3 text-xs font-semibold text-zinc-950  font-serif tracking-wider">Recent Chats</h3>
              )}
              {chatHistory.map((chat) => (
                <SidebarLink
                  key={chat.id}
                  link={{
                    label: chat.title,
                    href: `#${chat.id}`,
                    icon: (
                      <IconMessage className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                    ),
                  }}
                />
              ))}
            </div>
          </nav>
        </div>
        <div>
          <SidebarLink
            link={{
              label: fullName,
              href: "#",
              icon: (
                <UserButton/>
              ),
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-white dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre"
      >
        NectLink
      </motion.span>
    </Link>
  );
};