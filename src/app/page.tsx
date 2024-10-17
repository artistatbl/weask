import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";

import FAQ from "@/components/global/faq";

import { Container } from "@/components/global/container";
import BeforeAfter from "@/components/global/before-after";
import CTA from "@/components/global/cta";
import LogoClouds from "@/components/global/logo-clouds";
import Pricing from "@/components/global/pricing";
import Feature from "@/components/global/feature";
import BottomCTA from "@/components/global/bottomcta";


export default function LandingPage() {
  return (
    <Container>

      <Navbar />

    
       
        <CTA />

        <LogoClouds />

        <BeforeAfter />

        <Feature />

        <Pricing />
       

        <FAQ />

        <BottomCTA />

    
    

      <Footer />
     </Container>
  );
}