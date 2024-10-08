import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
import HowItWorks from "@/components/global/howitworks";
import Pricing from "@/components/global/pricing";
import FAQ from "@/components/global/faq";
import UrlForm from "@/components/UrlForm";
import { SafariDemo } from "@/components/global/safari";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import Comparison from "@/components/global/comparison";
import GradualSpacing from "@/components/ui/gradual-spacing";
import Community from "@/components/global/community";
import KeyBenefits from "@/components/global/benefits";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:from-neutral-950 dark:to-neutral-900">
      <Navbar />

      <main className="flex-grow">
        <section className="hero py-24 px-4 bg-white dark:from-neutral-900 dark:to-neutral-950">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-zinc-900 dark:text-white font-bold mt-14 mb-4 leading-tight">
              Chat with Any Website
            </h1>
            <GradualSpacing
              className="text-center font-display -tracking-widest dark:text-orange-400 md:leading-[5rem] text-orange-600 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold block animate-pulse"
              text="Instantly"
            />
            <p className="text-base sm:text-lg md:text-xl lg:text-1xl text-gray-700 dark:text-gray-300 mb-6 mt-4 font-light max-w-2xl mx-auto">
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

        <Community />

        <Comparison />

        <HowItWorks />

        <KeyBenefits />

        <Pricing />

        <FAQ />

        <BackgroundBeamsWithCollision>
          <section className="py-24 max-w-7xl w-full dark:bg-neutral-900">
            <div className="container mx-auto text-center">
              <h2 className="text-4xl font-bold mb-8 text-zinc-900 dark:text-white">Ready to Get Started?</h2>
              <UrlForm />
            </div>
          </section>
        </BackgroundBeamsWithCollision>
      </main>

      <Footer />
    </div>
  );
}