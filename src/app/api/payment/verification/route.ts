import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    // Verify user authentication
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in" },
        { status: 401 }
      );
    }

    // Get the user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify session belongs to the authenticated user
    if (session.metadata?.userId !== userId) {
      console.error("Session user ID mismatch", {
        sessionUserId: session.metadata?.userId,
        requestUserId: userId,
      });
      return NextResponse.json(
        { error: "Unauthorized: Session does not belong to authenticated user" },
        { status: 403 }
      );
    }

    // Verify session email matches user email
    if (session.customer_details?.email !== user.email) {
      console.error("Session email mismatch", {
        sessionEmail: session.customer_details?.email,
        userEmail: user.email,
      });
      return NextResponse.json(
        { error: "Invalid session: Email mismatch" },
        { status: 400 }
      );
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Get subscription details if available
    let subscriptionDetails = null;
    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      subscriptionDetails = {
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      };
    }

    // Return enhanced session info
    return NextResponse.json({
      success: true,
      message: "Payment successful",
      data: {
        customerEmail: session.customer_details?.email,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency,
        paymentStatus: session.payment_status,
        subscription: subscriptionDetails,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      }
    });

  } catch (error) {
    console.error("Error verifying session:", error);
    
    // Handle Stripe errors specifically
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: "Payment verification failed: " + error.message },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "An unexpected error occurred"
      },
      { status: 500 }
    );
  }
}
