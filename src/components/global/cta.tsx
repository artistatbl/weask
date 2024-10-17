import React from "react";
import GradualSpacing from "../ui/gradual-spacing";
import UrlForm from "../UrlForm";
import { SafariDemo } from "./safari";
// import { cn } from "@/lib/utils";
// import AnimatedShinyText from "@/components/ui/animated-shiny-text";
// import { ArrowRightIcon } from "lucide-react";

export default function CTA() {
  return (
     <section className="hero py-24 px-4 bg-white dark:from-neutral-900 dark:to-neutral-950">

{/* <div
        className={cn(
          "group rounded-full container mx-auto  text-center border max-w-xs border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
        )}
      >
        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
          <span>✨ Introducing Magic UI</span>
          <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedShinyText>
      </div> */}
          <div className="container mx-auto max-w-4xl text-center">

            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-zinc-900 dark:text-white font-bold mt-14 mb-4 leading-tight">
              Chat with Any Website
            </h1>
            <GradualSpacing
              className="text-center font-display -tracking-widest dark:text-orange-400 md:leading-[5rem] text-orange-600 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold block animate-pulse"
              text="Instantly"
              />
            <p className="text-sm sm:text-lg md:text-xl lg:text-1xl text-gray-700 dark:text-gray-300 mb-6 mt-4 font-light max-w-2xl mx-auto">
              Turn websites into interactive chats. Ask questions, get instant answers.
            </p>
            <UrlForm />
            <div className="mt-12 w-full flex justify-center">
              <div className="transform hover:scale-105 transition-transform duration-300">
                <SafariDemo />
              </div>
            </div>
          </div>
        </section> 
  );
}