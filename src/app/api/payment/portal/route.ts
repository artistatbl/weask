// app/api/managePortal/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from '@/lib/db';
import { SubscriptionStatus } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    console.log('Received portal request for user:', userId);

    // Validate user ID
    if (!userId) {
      console.log('Missing userId');
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Find user's subscription and Stripe customer ID
    const subscription = await prisma.subscription.findFirst({
      where: {
        user: { clerkId: userId },
        status: SubscriptionStatus.ACTIVE,
      },
      include: {
        user: true,
      },
    });

    if (!subscription?.stripeUserId) {
      console.log('No active subscription found for user');
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    // Create Stripe portal session
    console.log('Creating portal session for customer:', subscription.stripeUserId);
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeUserId,
      return_url: `${process.env.FRONTEND_URL}/dashboard`,
  
    });

    console.log('Portal session created:', portalSession.id);
    return NextResponse.json({ url: portalSession.url });

  } catch (error) {
    console.error("Error creating portal session:", error);
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

