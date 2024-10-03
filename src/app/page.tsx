import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";

import HowItWorks from "@/components/global/howitworks";
import Pricing from "@/components/global/pricing";
import FAQ from "@/components/global/faq";
import UrlForm from "@/components/UrlForm";
import { SafariDemo } from "@/components/global/safari";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { TabsDemo } from "@/components/global/featureSection";
import Comparison from "@/components/global/comparison";
import { MarqueeDemo } from "@/components/global/marquee";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-950">
      <Navbar />

      <main className="">
        <section className="hero py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-6xl text-zinc-900 font-medium mt-14 mb-2">
              Chat with Any Website
            </h1>
            <span className="text-orange-600 md:text-6xl font-bold">
              Instantly
            </span>

            <p className="text-md text-gray-600 mb-8 mt-1 font-extralight">
              Turn websites into interactive chats. Ask questions, get instant
              answers.
            </p>
            <UrlForm />

            <div className="mt-8 w-full flex justify-center">
              <SafariDemo />
            </div>

            
          </div>
          
        </section>
        <MarqueeDemo/>

        <Comparison/>
        <TabsDemo/>

        <HowItWorks />

        <Pricing />

        <FAQ />

        <BackgroundBeamsWithCollision>
          <section className="py-20  dark:bg-neutral-900">
            <div className="container mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">Ready to Get Started?</h2>
              <UrlForm />
            </div>
          </section>
        </BackgroundBeamsWithCollision>
      </main>

      <Footer />
      {/* <TextHoverEffectDemo/> */}
    </div>
  );
}
