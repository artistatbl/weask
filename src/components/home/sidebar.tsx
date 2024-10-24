import React from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconBrandTabler,
  IconLink,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreditCard, Info } from "lucide-react";

interface RecentUrl {
  id: string;
  url: string;
  title: string;
  visitedAt: Date;
}

interface HomeSidebarProps {
  recentUrls: RecentUrl[];
}

export function HomeSidebar({ recentUrls }: HomeSidebarProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  //const [portalUrl, setPortalUrl] = React.useState<string | null>(null);
  const { user } = useUser();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const router = useRouter();

  const fullName: string = user ? `${user.firstName} ${user.lastName}` : "";

  const handleUrlClick = (url: string, title: string) => {
    toast.success(`Redirecting to ${title}`);
    setTimeout(() => {
      if (router) {
        router.push(`/chat/${encodeURIComponent(url)}`);
      }
    }, 1000);
  };

  const handleBillingPortal = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/payment/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        console.error('Portal error:', data.error);
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Failed to access portal:', error);
      toast.error('Failed to access billing portal');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (isClient) {
      console.log("Client is active");
    }
  });

  return (
    <>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-6">
          <div className="flex flex-col flex-1 text-orange-600 overflow-y-auto overflow-x-hidden">
            <Logo />
            <nav className="mt-6 flex font-extralight text-orange-500 flex-col gap-2">
              <SidebarLink
                link={{
                  textColor: "text-orange-500",
                  label: "New Chat",
                  href: "/dashboard",
                  icon: (
                    <IconBrandTabler className="text-orange-600 h-5 w-5 flex-shrink-0" />
                  ),
                }}
              />
         
              <div className="mt-4 transition-all duration-300 ease-in-out">
                {open && (
                  <h3 className="text-xs text-white font-bold tracking-wider mb-1">Recents</h3>
                )}
                {recentUrls && recentUrls.map((recentUrl) => (
                  <div
                    key={recentUrl.id}
                    onClick={() => handleUrlClick(recentUrl.url, recentUrl.title)}
                    className="cursor-pointer"
                  >
                    <SidebarLink
                      className="rounded-md hover:bg-zinc-900 pl-1"
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
                    <UserButton>
                    <UserButton.MenuItems>
                      <UserButton.Action 
                        label={isLoading ? "Loading..." : "Billing"}
                        labelIcon={<CreditCard size={14} />}
                        onClick={handleBillingPortal}
                      />
                      <UserButton.Action 
                        label="Help & Support"
                        labelIcon={<Info size={14} />}
                        onClick={() => router.push('/help')}
                      />
                    </UserButton.MenuItems>
                  
                  
                  </UserButton>
                  ),
                }}
              />
            )}
          </div>
        </SidebarBody>
      </Sidebar>
    </>
  );
}

const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-white dark:text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-orange-600 dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
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
