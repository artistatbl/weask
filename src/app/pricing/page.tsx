import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
import React from "react";
import PricingComponent from "@/components/global/pricing";

export default function Pricing() {
  return (
    <>
    <Navbar/>
    <main className="flex items-center justify-center flex-col bg-white dark:bg-neutral-950 min-h-screen">
      
      <div className="flex-grow flex items-center justify-center">
        <PricingComponent/>
      </div>
     
    </main>
    <Footer/>
    </>
  );
}