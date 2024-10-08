import React, { useState, useCallback } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { IconBrandTabler, IconLink } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useToast } from '@/hooks/use-toast';

interface RecentUrl {
  id: string;
  url: string;
  title: string;
  visitedAt: Date;
}

interface HomeSidebarProps {
  initialRecentUrls: RecentUrl[];
}

export function HomeSidebar({ initialRecentUrls }: HomeSidebarProps) {
  const [open, setOpen] = useState(false);
  const [recentUrls, setRecentUrls] = useState<RecentUrl[]>(() => 
    [...initialRecentUrls].sort((a, b) => 
      new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime()
    )
  );
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const fullName: string = user ? `${user.firstName}` : "";

  const handleRecentUrlClick = useCallback((clickedUrl: RecentUrl) => {
    const now = new Date();
    
    setRecentUrls(prevUrls => {
      const updatedUrls = prevUrls.filter(url => url.id !== clickedUrl.id);
      return [{ ...clickedUrl, visitedAt: now }, ...updatedUrls];
    });
    
    router.push(`/chat/${encodeURIComponent(clickedUrl.url)}`);
    toast({
      title: "Navigating",
      description: `Going to: ${clickedUrl.title}`,
      variant: 'success',
    });
  }, [router, toast]);

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-6">
        <div className="flex flex-col flex-1 text-orange-600 overflow-y-auto overflow-x-hidden">
          <Logo />
          <nav className="mt-6 flex font-extralight text-orange-500 flex-col gap-2">
            <SidebarLink
              link={{
                textColor: "text-orange-500",
                label: "New Chat",
                href: "#",
                icon: (
                  <IconBrandTabler className="text-orange-600 h-5 w-5 flex-shrink-0" />
                ),
              }}
            />
         
            <div className="mt-4 transition-all duration-300 ease-in-out">
              {open && (
                <h3 className="text-xs text-white font-bold tracking-wider mb-1">Recents</h3>
              )}
              {recentUrls.map((recentUrl) => (
                <div
                  key={recentUrl.id}
                  className="rounded-md hover:bg-zinc-900 pl-1 cursor-pointer"
                  onClick={() => handleRecentUrlClick(recentUrl)}
                >
                  <SidebarLink
                    link={{
                      label: recentUrl.title,
                      textColor: "text-xs text-gray-300 font-extralight",
                      href: "#",
                      icon: (
                        <IconLink className="text-gray-300 h-4 w-4 flex-shrink-0" />
                      ),
                    }}
                  />
                </div>
              ))}
            </div>
          </nav>
        </div>
        <div>
          {user && (
            <SidebarLink
              link={{
                label: fullName,
                href: "#",
                icon: (
                  <UserButton/>
                ),
              }}
            />
          )}
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-white dark:text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-orange-600 dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre"
      >
        Konect
      </motion.span>
    </Link>
  );
};