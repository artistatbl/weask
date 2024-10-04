import Footer from "@/components/global/footer";
import Navbar from "@/components/global/navbar";
import React from "react";

type Props = {children: React.ReactNode}

const Layout = ({children}: Props) => {
  return (
    <div className="dark:text-white bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout