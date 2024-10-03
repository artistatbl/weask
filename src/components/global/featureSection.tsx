"use client";

import React from "react";
import Image from "next/image";
import { Tabs } from "../../components/ui/tabs";
import {Database, Zap, Cloud} from "lucide-react";

const tabs = [
  {
    title: "NextJS",
    value: "nextjs",
    icon: <Zap className="w-6 h-6" />,
    description: "Build blazing-fast web applications with server-side rendering",
    image: "/thumbnail.png",
    content: (
      <div className="w-full overflow-hidden relative h-full rounded-xl p-10 text-white bg-gradient-to-br from-orange-600 to-orange-800 border-2 border-black dark:border-white">
        <h2 className="text-2xl font-bold mb-4">Next.js: The React Framework</h2>
        <p className="text-lg mb-6">Elevate your web development with server-side rendering, static site generation, and more.</p>
        <Image src="/thumbnail.png" alt="Next.js illustration" width={800} height={600} className="rounded-lg shadow-lg border border-white" />
      </div>
    ),
  },
  {
    title: "Supabase",
    value: "supabase",
    icon: <Database className="w-6 h-6" />,
    description: "Open-source Firebase alternative with powerful database features",
    image: "/thumbnail.png",
    content: (
      <div className="w-full overflow-hidden relative h-full rounded-xl p-10 text-white bg-gradient-to-br from-orange-600 to-orange-800 border-2 border-black dark:border-white">
        <h2 className="text-2xl font-bold mb-4">Supabase: Your Backend Solution</h2>
        <p className="text-lg mb-6">Harness the power of PostgreSQL with real-time subscriptions, auth, and storage.</p>
        <Image src="/thumbnail.png" alt="Supabase illustration" width={800} height={600} className="rounded-lg shadow-lg border border-white" />
      </div>
    ),
  },
  {
    title: "Vercel",
    value: "vercel",
    icon: <Cloud className="w-6 h-6" />,
    description: "Deploy and scale your applications with ease",
    image: "/thumbnail.png",
    content: (
      <div className="w-full overflow-hidden relative h-full rounded-xl p-10 text-white bg-gradient-to-br from-orange-600 to-orange-800 border-2 border-black dark:border-white">
        <h2 className="text-2xl font-bold mb-4">Vercel: Deploy at the Edge</h2>
        <p className="text-lg mb-6">Experience seamless deployments, automatic scaling, and global CDN distribution.</p>
        <Image src="/thumbnail.png" alt="Vercel illustration" width={800} height={600} className="rounded-lg shadow-lg border border-white" />
      </div>
    ),
  },
];

export function TabsDemo() {
  return (
    <div className="h-[40rem] [perspective:1000px] relative flex flex-col max-w-4xl mx-auto w-full items-start justify-start my-40">
      <Tabs tabs={tabs} />
    </div>
  );
}

export default TabsDemo;