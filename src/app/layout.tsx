import type { Metadata } from "next";
import { DM_Sans } from 'next/font/google'

import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/Providers";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster"
import { CommandK } from "@/components/CommandK";
import dynamic from 'next/dynamic';
import DiagnosticComponent from "@/hooks/DiagnosticComponent";

const OnboardingTour = dynamic(() => import('@/components/OnboardingTour').then(mod => mod.OnboardingTour), {
  ssr: false,
});

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
      <body className={cn(dmSans.className, "min-h-screen antialiased font-serif")}>
        <Providers>
          <main className="h-screen text-foreground bg-zinc-800 command-k-hint">
            {children}
            <CommandK />
            {/* <DiagnosticComponent/> */}
            <OnboardingTour />
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
    </ClerkProvider>
  );
}