
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import dynamic from 'next/dynamic';
import UrlForm from "@/components/UrlForm";
import Sidebar from "@/components/global/Sidebar";

const Navbar = dynamic(() => import('@/components/global/navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/global/footer'), { ssr: false });

export default function Home() {
  // Initialize state for Sidebar


  return (
    <main className="flex items-center justify-center flex-col bg-white dark:bg-neutral-950 min-h-screen">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        {/* Pass the required props to Sidebar */}
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Welcome to WeAsk</CardTitle>
            <CardDescription className="text-center mt-2">Enter a URL to start chatting with AI</CardDescription>
          </CardHeader>
          <CardContent>
            <UrlForm />
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
