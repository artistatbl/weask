'use client'

import { useState , useEffect} from 'react'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Stripe, loadStripe } from '@stripe/stripe-js'
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


type Plan = {
  title: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  buttonLink: string;
  description: string;
  isFeatured?: boolean;
  stripePriceIdMonthly: string;
  stripePriceIdYearly: string;
};

const plans: Plan[] = [
  {
    title: "Basic Plan",
    monthlyPrice: 9.99,
    yearlyPrice: 107.88, // 9.99 * 12 - 10% discount
    features: [
      "100 chat messages a day",
      "Basic customization options",
      "Email support",
    ],
    buttonLink: "/sign-up?plan=basic",
    description: "Perfect for getting started with QuillMinds",
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || '',
    stripePriceIdYearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID || '',
  },
  {
    title: "Pro Plan",
    monthlyPrice: 19.99,
    yearlyPrice: 215.88, // 19.99 * 12 - 10% discount
    features: [
      "200 chat messages a day",
      "Advanced customization options",
      "Priority support",
      "Collaboration tools",
      "Premium templates",
    ],
    buttonLink: "/sign-up?plan=pro",
    description: "For educators who want more from QuillMinds",
    isFeatured: true,
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID2 || '',
    stripePriceIdYearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID2 || '',
  },
]

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const { isSignedIn, user } = useUser()
  const router = useRouter()

  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null)

  useEffect(() => {
    setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!))
  }, [])


  const handleCheckout = async (plan: Plan) => {
    if (!isSignedIn) {
      toast.info("Please login or sign up to purchase", {
        action: {
          label: "Sign Up",
          onClick: () => router.push("/sign-up"),

        },
      })
      return
    }

    const priceId = isYearly ? plan.stripePriceIdYearly : plan.stripePriceIdMonthly

    try {
      const response = await axios.post('/api/payment/checkout-session', {
        priceId: priceId,
        // priceId: isYearly ? plan.yearlyPriceId : plan.monthlyPriceId,

        userId: user?.id,
        email: user?.primaryEmailAddress?.emailAddress,
      })

      if (response.data.sessionId) {
        const stripe = await stripePromise
        const { error } = await stripe!.redirectToCheckout({
          sessionId: response.data.sessionId,
        })

        if (error) {
          console.error('Stripe checkout error:', error)
          toast.error('An error occurred. Please try again.')
        }
      } else {
        console.error('Failed to create checkout session', response.data)
        toast.error('Failed to create checkout session')
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error during checkout:', error.response.data)
        toast.error(`Error during checkout: ${error.response.data.error || 'Unknown error'}`)
      } else {
        console.error('Error during checkout:', error)
        toast.error('Error during checkout')
      }
    }
  }

  return (
    <section className="overflow-hidden bg-white" id="pricing">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-20 flex w-full flex-col text-center">
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl lg:text-5xl">
            Transform Your Lesson Planning with AI
          </h2>
          <p className="mx-auto max-w-2xl text-xl font-medium text-slate-500">
            Save hours on lesson preparation, create engaging content, and focus on what matters most - your students.
          </p>
        </div>

        <div className="mb-10 flex justify-center">
          <div className="flex items-center space-x-2">
            <Label htmlFor="yearly-pricing">Monthly</Label>
            <Switch
              id="yearly-pricing"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <Label htmlFor="yearly-pricing">Yearly (Save 10%)</Label>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {plans.map((plan) => (
            <PricingCard
              key={plan.title}
              plan={plan}
              isYearly={isYearly}
              onCheckout={() => handleCheckout(plan)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingCard({
  plan,
  isYearly,
  onCheckout,
}: {
  plan: Plan;
  isYearly: boolean;
  onCheckout: () => void;
}) {
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
  const period = isYearly ? '/year' : '/month'

  return (
    <div className={`relative w-full ${plan.isFeatured ? 'lg:-mt-4' : ''}`}>
      {plan.isFeatured && (
        <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
          <span className="whitespace-nowrap rounded-full bg-orange-500 px-2 py-1 text-xs font-semibold text-white">
            MOST POPULAR
          </span>
        </div>
      )}
      <div
        className={`relative z-10 h-full rounded-lg ${
          plan.isFeatured ? 'ring-2 ring-orange-500' : 'border border-zinc-400'
        }`}
      >
        <div className="flex h-full flex-col gap-5 rounded-lg bg-white p-8 lg:gap-8">
          <div>
            <h3 className="mb-2 text-xl font-bold text-slate-800">{plan.title}</h3>
            <p className="text-sm text-slate-600">{plan.description}</p>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <p className="text-5xl font-black tracking-tight text-slate-800">
              ${price.toFixed(2)}
            </p>
            <div className="mb-[4px] flex flex-col justify-end">
              <p className="text-xs font-semibold uppercase text-slate-500">
                USD {period}
              </p>
            </div>
          </div>
          <ul className="flex-1 space-y-2.5 text-base leading-relaxed text-slate-700">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-[18px] w-[18px] shrink-0 text-green-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-2">
            <Button 
              variant={plan.isFeatured ? "default" : "outline"} 
              className="w-full"
              onClick={onCheckout}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
