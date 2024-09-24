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

const Navbar = dynamic(() => import('@/components/global/navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/global/footer'), { ssr: false });

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-neutral-950">
      <Navbar />
     
     
      <section className="h-screen w-full  dark:bg-neutral-950 !overflow-visible relative flex flex-col items-center antialiased bg-white dark:bg-neutral">
        {/* <div className="absolute inset-0  h-full w-full items-center px-5 py-32"></div> */}

        <div className="relative flex h-full  w-full  mt-1 flex-col items-center justify-center">


            <div className="text-center max-w-4xl mx-auto">


              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-t from-zinc-900 to-main mb-4">
                Chat with Any Website Instantly
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                NexusFlow AI turns websites into interactive chats. Ask questions, get instant answers, and explore web content effortlessly.
              </p>
              <UrlForm />
            </div>


           
            </div>

          
       


            <SafariDemo />
          </section>
       <BentoCard />

          <Faq />
       
      <Footer />
    </main>
  );
}
