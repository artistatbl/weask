import type { Metadata } from "next";
import { DM_Sans } from 'next/font/google'

import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/Providers";
import { ClerkProvider } from "@clerk/nextjs";


const dmSans = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "NectLink",
  description: "Easily Chat with website with NectLink AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
    publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >

    <html lang="en">
      <body className={cn(dmSans.className, "min-h-screen antialiased")}>
        <Providers>
          <main className="h-screen  text-foreground bg-white">{children}</main>
        </Providers>
      </body>
    </html>
    </ClerkProvider>
  );
}