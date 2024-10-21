import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from '@/lib/db';
import { SubscriptionStatus, PlanType } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { userId, email, priceId } = await req.json();
    console.log('Received request:', { userId, email, priceId });

    // Validate required fields
    if (!userId || !email || !priceId) {
      console.log('Missing required fields');
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if the user already has an active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        user: { clerkId: userId },
        status: SubscriptionStatus.ACTIVE,
      },
      include: {
        plan: true,
      },
    });

    if (existingSubscription && existingSubscription.plan.planId === priceId) {
      return NextResponse.json(
        { error: "You are already subscribed to this plan" },
        { status: 400 }
      );
    }

    // Fetch the price from Stripe to determine if it's recurring or one-time
    console.log('Fetching price from Stripe');
    const price = await stripe.prices.retrieve(priceId);
    console.log('Retrieved price:', price);

    // Determine the correct mode based on the price type
    const mode = price.type === 'recurring' ? 'subscription' : 'payment';
    console.log('Determined mode:', mode);

    // Create a new checkout session
    console.log('Creating checkout session');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { 
        userId, 
        email,
        priceId,
        planType: price.metadata?.planType || PlanType.BASIC
      },
      mode: mode,
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      allow_promotion_codes: true,
    });
    console.log('Checkout session created:', session.id);

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 });
    }
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}








// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";
// import { prisma } from '@/lib/db';  // Assuming you have Prisma set up

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// export async function POST(req: NextRequest) {
//   try {
//     const { userId, email, priceId } = await req.json();
//     console.log('Received request:', { userId, email, priceId });

//     // Validate required fields
//     if (!userId || !email || !priceId) {
//       console.log('Missing required fields');
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     // Check if the user already has an active subscription
//     const existingSubscription = await prisma.subscription.findFirst({
//       where: {
//         clerkId: userId,
//         status: 'ACTIVE',
//       },
//       include: {
//         plan: true,
//       },
//     });

//     if (existingSubscription) {
//       // If the user is trying to subscribe to the same plan
//       if (existingSubscription.plan.planId === priceId) {
//         return NextResponse.json(
//           { error: "You are already subscribed to this plan" },
//           { status: 400 }
//         );
//       }

//       // If the user is trying to switch to a different plan
//       // You might want to handle plan upgrades/downgrades differently
//       // For now, we'll just allow it
//     }

//     // Fetch the price from Stripe to determine if it's recurring or one-time
//     console.log('Fetching price from Stripe');
//     const price = await stripe.prices.retrieve(priceId);
//     console.log('Retrieved price:', price);

//     // Determine the correct mode based on the price type
//     const mode = price.type === 'recurring' ? 'subscription' : 'payment';
//     console.log('Determined mode:', mode);

//     console.log('Creating checkout session');
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [{ price: priceId, quantity: 1 }],
//       metadata: { userId, email },
//       mode: mode,
//       success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.FRONTEND_URL}/cancel`,
//       allow_promotion_codes: true,
//     });
//     console.log('Checkout session created:', session.id);

//     return NextResponse.json({ sessionId: session.id });
//   } catch (error) {
//     console.error("Error creating checkout session:", error);
//     if (error instanceof Stripe.errors.StripeError) {
//       return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 });
//     }
//     return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
//   }
// }