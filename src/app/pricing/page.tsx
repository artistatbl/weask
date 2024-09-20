import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";

export default function Pricing() {
  return (
    <main className="flex items-center justify-center flex-col bg-white dark:bg-neutral-950 min-h-screen">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <h1 className="text-3xl font-bold">Pricing Page</h1>
        {/* Add your pricing content here */}
      </div>
      <Footer />
    </main>
  );
}