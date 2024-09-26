import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import dynamic from 'next/dynamic';
import UrlForm from "@/components/UrlForm";
import { HomeSidebar } from "@/components/home/sidebar";
import Faq from "@/components/global/faq";
import BentoCard from "@/components/global/bentoGrid"; // Corrected import statement
import Safari from "@/components/magicui/safari";
import { SafariDemo } from "@/components/global/safari";
import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";

// const Navbar = dynamic(() => import('@/components/global/navbar'), { ssr: false });
// const Footer = dynamic(() => import('@/components/global/footer'), { ssr: false });

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-neutral-950">
      <Navbar />
      
      <section className="flex flex-col items-center justify-center w-full bg-white dark:bg-neutral-950 relative antialiased py-10 md:py-24"> {/* Adjusted height and padding */}
        <div className="text-center max-w-4xl mx-auto px-4 mt-24">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-t from-zinc-900 to-main mb-4">
            Chat with Any Website Instantly
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
            NexusFlow AI turns websites into interactive chats. Ask questions, get instant answers, and explore web content effortlessly.
          </p>
          <UrlForm />
        </div>
        
        <div className="mt-8 w-full flex justify-center">
          <SafariDemo />
        </div>
      </section>

      <div className="py-10">
        <BentoCard />
      </div>
      
      <div className="py-10">
        <Faq />
      </div>
      
      <Footer />
    </main>
  );
}
