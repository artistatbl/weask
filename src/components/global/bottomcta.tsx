import { Button } from "@/components/ui/button"


export default function BottomCTA() {
  return (
    <section className="bg-white relative">
      <div className="relative mx-auto max-w-7xl px-4 py-24 text-center md:py-32">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center text-center">
         
          <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Chat with AI About Any Website
          </h2>
          <p className="mb-8 max-w-md text-lg text-muted-foreground">
            Enter a URL, ask questions, and get instant insights. Experience the power of AI-driven web analysis with a live preview.
          </p>
          <Button className="h-12 px-8 text-lg bg-orange-600 text-white" size="lg">
            Start Chatting Now
          </Button>
        </div>
      </div>
    </section>
  )
}