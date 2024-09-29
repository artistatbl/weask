import Image from "next/image";
import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
// import CallToAction from "@/components/CallToAction";
/// import SocialProof from "@/components/SocialProof";
// import Comparison from "@/components/Comparison";
import Benefits from "@/components/global/benefits";
import HowItWorks from "@/components/global/howitworks";
import Pricing from "@/components/global/pricing";
import FAQ from "@/components/global/faq";
import UrlForm from "@/components/UrlForm";
import { SafariDemo } from "@/components/global/safari";
import BentoCard from '@/components/global/bentoGrid';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-950">
      <Navbar />
      
      <main className="">



        
        <section className="hero py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold mt-14  mb-2">
              Chat with Any Website Instantly
            </h1>
            <p className="text-xl mb-8">
              Turn websites into interactive chats. Ask questions, get instant answers.
            </p>
            {/* <CallToAction /> */}
            <UrlForm />
            {/* <div className="mt-12">
            
            <SafariDemo/>
            </div> */}

<div className="mt-8 w-full flex justify-center">
          <SafariDemo />
        </div>
            {/* <VideoPlayer className="mt-12" /> */}
          </div>
        </section>

         {/* <SocialProof /> */}

        {/* <Comparison /> */}

        <Benefits />
        {/* <BentoCard /> */}

        <HowItWorks />

        <Pricing /> 

        <FAQ />

        <section className="final-cta py-20 bg-gray-100 dark:bg-neutral-900">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to Get Started?</h2>
            <UrlForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}