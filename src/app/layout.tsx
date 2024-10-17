import type { Metadata } from "next";
// import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/Providers";
import { ClerkProvider } from "@clerk/nextjs";
// import { Toaster } from "@/components/ui/toaster"
import { CommandK } from "@/components/CommandK";
import dynamic from 'next/dynamic';
import CookieConsentPopup from "@/components/home/cookie";
import { Toaster } from "@/components/ui/sonner"


const OnboardingTour = dynamic(() => import('@/components/OnboardingTour').then(mod => mod.OnboardingTour), {
  ssr: false,
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export const metadata: Metadata = {
  title: 'WeAsk',
  description: 'WeAsk is an AI-powered question-answering platform.',
  themeColor: '#8936FF',
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
    title: 'WeAsk',
  },
  icons: {
    apple: '/icon512_maskable.png',
  },
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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={cn(geistSans.variable, geistMono.variable, "min-h-screen antialiased")}>
        <Providers>
          <main className="h-screen text-foreground bg-zinc-800 command-k-hint">
            {children}
            <CommandK />
            <OnboardingTour />
            <CookieConsentPopup/>
          </main>
       
        </Providers>
        <Toaster />
      </body>
    </html>
    </ClerkProvider>
  );
}