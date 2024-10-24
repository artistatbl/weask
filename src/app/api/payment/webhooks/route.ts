import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from '@/lib/db';  // Update this path if necessary
import { SubscriptionStatus, InvoiceStatus, PlanType, Prisma } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


export async function POST(req: NextRequest) {
  const reqText = await req.text();
  return webhooksHandler(reqText, req);
}


async function getCustomerEmail(customerId: string): Promise<string | null> {
  console.log(`Attempting to fetch email for customer: ${customerId}`);
  try {
    const customer = await stripe.customers.retrieve(customerId);
    console.log('Retrieved customer:', JSON.stringify(customer, null, 2));
    
    if (customer.deleted) {
      console.error('Customer has been deleted');
      return null;
    }
    
    if ('email' in customer) {
      console.log(`Email found for customer ${customerId}: ${customer.email}`);
      return customer.email;
    } else {
      console.warn(`No email found for customer ${customerId}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching customer:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return null;
  }
}


async function handleSubscriptionEvent(
  event: Stripe.Event,
  type: "created" | "updated" | "deleted"
): Promise<NextResponse> {
  const subscription = event.data.object as Stripe.Subscription;
  console.log(`Processing ${type} event for subscription:`, JSON.stringify(subscription, null, 2));

  try {
    const customerEmail = await getCustomerEmail(subscription.customer as string);
    console.log('Customer Email:', customerEmail);

    if (!customerEmail) {
      console.error("Customer email could not be fetched");
      return NextResponse.json({
        status: 500,
        error: "Customer email could not be fetched",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: customerEmail },
      include: { subscription: true },
    });

    if (!user) {
      console.error(`User not found for email: ${customerEmail}`);
      return NextResponse.json({
        status: 500,
        error: "User not found for the given email",
      });
    }
    console.log('User found:', user.id);

    // Fetch and upsert SubscriptionPlan
    const priceId = subscription.items.data[0]?.price.id;
    if (!priceId) {
      console.error("Price ID could not be found in the subscription");
      return NextResponse.json({
        status: 500,
        error: "Price ID could not be found in the subscription",
      });
    }

    const price = await stripe.prices.retrieve(priceId);
    const subscriptionPlan = await upsertSubscriptionPlan(price);

    // Check for recent paid invoices
    const recentPaidInvoice = await prisma.invoice.findFirst({
      where: {
        subscriptionId: subscription.id,
        status: InvoiceStatus.PAID,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Check last 24 hours
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Determine the correct status
    let subscriptionStatus: SubscriptionStatus;
    if (recentPaidInvoice) {
      subscriptionStatus = SubscriptionStatus.ACTIVE;
    } else {
      subscriptionStatus = mapSubscriptionStatus(subscription.status);
    }

    const subscriptionData = {
      subscriptionId: subscription.id,
      stripeUserId: subscription.customer as string,
      status: subscriptionStatus,
      startDate: new Date(subscription.current_period_start * 1000),
      endDate: new Date(subscription.current_period_end * 1000),
      planType: subscriptionPlan.planType,
      email: customerEmail,
      clerkId: subscription.metadata?.userId,
      plan: { connect: { id: subscriptionPlan.id } },
    };

    let updatedSubscription;

    if (type === "deleted") {
      if (user.subscription) {
        updatedSubscription = await prisma.subscription.update({
          where: { id: user.subscription.id },
          data: { status: SubscriptionStatus.CANCELED },
        });
        console.log(`Subscription ${subscription.id} marked as CANCELED`);
      } else {
        console.log(`No active subscription found for user ${user.id} to cancel`);
      }
    } else {
      if (user.subscription) {
        // Update existing subscription
        updatedSubscription = await prisma.subscription.update({
          where: { id: user.subscription.id },
          data: subscriptionData,
        });
        console.log(`Existing subscription ${subscription.id} updated. New status: ${updatedSubscription.status}`);
      } else {
        // Create new subscription
        updatedSubscription = await prisma.subscription.create({
          data: {
            ...subscriptionData,
            user: { connect: { id: user.id } },
          },
        });
        console.log(`New subscription ${subscription.id} created with status ${updatedSubscription.status}`);
      }
    }

    console.log(`Subscription ${type} processed. Final Status: ${updatedSubscription?.status || 'N/A'}`);

    return NextResponse.json({
      status: 200,
      message: `Subscription ${type} processed successfully`,
    });
  } catch (error) {
    console.error(`Error during subscription ${type}:`, error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json({
      status: 500,
      error: `Error during subscription ${type}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}
// Helper function to upsert SubscriptionPlan
// Helper function to determine plan type and features based on price

function getPlanDetails(price: Stripe.Price): {
  name: string;
  description: string;
  planType: PlanType;
  features: string[];
  dailyChatLimit: number;
} {
  const priceAmount = new Prisma.Decimal(price.unit_amount! / 100).toString();
  const currency = price.currency.toUpperCase();
  const interval = price.recurring?.interval || 'month';
  const planType = (price.metadata?.planType as PlanType) || PlanType.BASIC;
  const intervalText = interval === 'year' ? 'year' : 'month';
  const intervalSuffix = interval === 'year' ? '/year' : '/month';

  switch (planType) {
    case PlanType.BASIC:
      return {
        name: price.nickname || `Basic Plan (${priceAmount} ${currency}${intervalSuffix})`,
        description: `Get started with our Basic plan, billed ${intervalText}ly. Perfect for regular users who want access to essential AI chat features.`,
        planType: PlanType.BASIC,
        features: [
          "100 messages per day",
          "Standard response time",
          "Basic conversation history",
          "Email support",
          "Regular model updates",
          `Billed ${intervalText}ly`
        ],
        dailyChatLimit: 100
      };

    case PlanType.PRO:
      return {
        name: price.nickname || `Pro Plan (${priceAmount} ${currency}${intervalSuffix})`,
        description: `Upgrade to Pro, billed ${intervalText}ly. Ideal for power users and professionals who need unlimited access and advanced features.`,
        planType: PlanType.PRO,
        features: [
          "Unlimited daily messages",
          "Priority response time",
          "Full conversation history",
          "Priority support",
          "Advanced AI capabilities",
          "Early access to new features",
          `Billed ${intervalText}ly`
        ],
        dailyChatLimit: 200
      };

    default:
      return {
        name: price.nickname || `Basic Plan (${priceAmount} ${currency}${intervalSuffix})`,
        description: `Get started with our Basic plan, billed ${intervalText}ly. Perfect for regular users who want access to essential AI chat features.`,
        planType: PlanType.BASIC,
        features: [
          "100 messages per day",
          "Standard response time",
          "Basic conversation history",
          "Email support",
          "Regular model updates",
          `Billed ${intervalText}ly`
        ],
        dailyChatLimit: 100
      };
  }
}

async function upsertSubscriptionPlan(price: Stripe.Price) {
  const planDetails = getPlanDetails(price);
  const interval = price.recurring?.interval || 'month';
  
  // Base update/create data without the optional prices
  const baseData = {
    name: planDetails.name,
    description: planDetails.description,
    price: new Prisma.Decimal(price.unit_amount! / 100),
    currency: price.currency,
    interval: interval,
    dailyChatLimit: planDetails.dailyChatLimit,
    features: planDetails.features,
    planType: planDetails.planType,
  };

  // Only add yearlyPrice if it's a monthly plan
  const yearlyPrice = interval === 'month'
    ? { yearlyPrice: new Prisma.Decimal(price.unit_amount! * 12 / 100) }
    : {};

  // Only add monthlyPrice if it's a yearly plan
  const monthlyPrice = interval === 'year'
    ? { monthlyPrice: new Prisma.Decimal(price.unit_amount! / 12 / 100) }
    : {};

  return prisma.subscriptionPlan.upsert({
    where: { planId: price.id },
    update: {
      ...baseData,
      ...yearlyPrice,
      ...monthlyPrice,
    },
    create: {
      planId: price.id,
      ...baseData,
      ...yearlyPrice,
      ...monthlyPrice,
    },
  });
}



async function handleInvoiceEvent(
  event: Stripe.Event,
  status: "succeeded" | "failed"
) {
  const invoice = event.data.object as Stripe.Invoice;
  console.log(`Processing ${status} invoice event for invoice: ${invoice.id}`);
  console.log('Full invoice object:', JSON.stringify(invoice, null, 2));

  try {
    const customerEmail = await getCustomerEmail(invoice.customer as string);
    console.log('Customer Email:', customerEmail);

    if (!invoice.subscription) {
      console.warn(`Invoice ${invoice.id} is not associated with a subscription. This is unexpected for our business model.`);
      return NextResponse.json({
        status: 200,
        message: `Skipped processing non-subscription invoice ${invoice.id}`,
      });
    }

    const invoiceData: Prisma.InvoiceCreateInput = {
      invoiceId: invoice.id,
      subscriptionId: invoice.subscription as string,
      amountPaid: new Prisma.Decimal(status === "succeeded" ? invoice.amount_paid / 100 : 0),
      amountDue: new Prisma.Decimal(invoice.amount_due / 100),
      currency: invoice.currency,
      status: status === "succeeded" ? InvoiceStatus.PAID : InvoiceStatus.UNPAID,
      email: customerEmail || '',
      clerkId: invoice.metadata?.userId,
    };

    console.log('Invoice data to be created:', JSON.stringify(invoiceData, null, 2));

    // Create the invoice in your database
    const createdInvoice = await prisma.invoice.create({ data: invoiceData });
    console.log('Created invoice in database:', JSON.stringify(createdInvoice, null, 2));

    // Update the subscription status if the invoice payment succeeded
    if (status === "succeeded") {
      const updatedSubscription = await prisma.subscription.update({
        where: { subscriptionId: invoice.subscription as string },
        data: { status: SubscriptionStatus.ACTIVE },
      });
      console.log(`Updated subscription ${updatedSubscription.id} to ACTIVE status`);
    } else if (status === "failed") {
      await handleFailedPayment(invoice);
    }

    console.log(`Successfully processed ${status} invoice event`);
    return NextResponse.json({
      status: 200,
      message: `Invoice payment ${status} processed successfully`,
    });
  } catch (error) {
    console.error(`Error handling invoice (payment ${status}):`, error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json({
      status: 500,
      error: `Error handling invoice (payment ${status}): ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}
  async function handleSubscriptionUpdated(event: Stripe.Event) {
    const subscription = event.data.object as Stripe.Subscription;
    const subscriptionStatus = mapSubscriptionStatus(subscription.status);
  
    try {
      await prisma.subscription.update({
        where: { subscriptionId: subscription.id },
        data: {
          status: subscriptionStatus,
          endDate: new Date(subscription.current_period_end * 1000),
        },
      });
  
      console.log(`Subscription ${subscription.id} updated. New status: ${subscriptionStatus}`);
  
      return NextResponse.json({
        status: 200,
        message: `Subscription updated successfully`,
      });
    } catch (error) {
      console.error("Error updating subscription:", error);
      return NextResponse.json({
        status: 500,
        error: "Error updating subscription",
      });
    }
  }


  async function handleFailedPayment(invoice: Stripe.Invoice) {
    const subscriptionId = invoice.subscription as string;
    if (!subscriptionId) {
      console.error("No subscription ID found for failed invoice");
      return;
    }
  
    try {
      const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      await prisma.subscription.update({
        where: { subscriptionId: subscriptionId },
        data: {
          status: mapSubscriptionStatus(stripeSubscription.status),
          lastInvoiceId: invoice.id,
          lastInvoiceAmount: new Prisma.Decimal(invoice.amount_due / 100),
          lastInvoiceDate: new Date(invoice.created * 1000),
        },
      });
  
      console.log(`Updated subscription ${subscriptionId} status to ${stripeSubscription.status}`);
  
      // Implement additional logic here, such as sending a notification to the user
      // about the failed payment and the status of their subscription
    } catch (error) {
      console.error("Error updating subscription after failed payment:", error);
    }
  }

  
  async function handleCheckoutSessionCompleted(event: Stripe.Event) {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('Checkout Session:', JSON.stringify(session, null, 2));
  
    const metadata = session.metadata as Record<string, string> | undefined;
  
    if (!metadata?.userId) {
      console.error("Missing user ID in session metadata");
      return NextResponse.json({
        status: 400,
        error: "Invalid session: Missing user ID",
      });
    }
  
    const subscriptionId = session.subscription as string;
    if (!subscriptionId) {
      console.error("Missing subscription ID in completed checkout session");
      return NextResponse.json({
        status: 500,
        error: "Invalid subscription payment: Missing subscription ID",
      });
    }
  
    try {
      const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
      console.log('Stripe Subscription:', JSON.stringify(stripeSubscription, null, 2));
  
      const price = await stripe.prices.retrieve(stripeSubscription.items.data[0].price.id);
      console.log('Stripe Price:', JSON.stringify(price, null, 2));
  
      const subscriptionPlan = await prisma.subscriptionPlan.upsert({
        where: { planId: price.id },
        update: {
          name: price.nickname || '',
          description: 'Plan description',
          price: new Prisma.Decimal(price.unit_amount! / 100),
          currency: price.currency,
          interval: price.recurring?.interval || 'month',
          dailyChatLimit: price.metadata?.dailyChatLimit ? parseInt(price.metadata.dailyChatLimit) : 100,
          features: price.metadata?.features ? JSON.parse(price.metadata.features) : [],
          planType: (price.metadata?.planType as PlanType) || PlanType.BASIC,
        },
        create: {
          planId: price.id,
          name: price.nickname || '',
          description: 'Plan description',
          price: new Prisma.Decimal(price.unit_amount! / 100),
          currency: price.currency,
          interval: price.recurring?.interval || 'month',
          dailyChatLimit: price.metadata?.dailyChatLimit ? parseInt(price.metadata.dailyChatLimit) : 100,
          features: price.metadata?.features ? JSON.parse(price.metadata.features) : [],
          planType: (price.metadata?.planType as PlanType) || PlanType.BASIC,
        },
      });
      console.log('SubscriptionPlan upserted:', subscriptionPlan);
  
      const result = await prisma.$transaction(async (prisma) => {
        const user = await prisma.user.findUnique({
          where: { clerkId: metadata.userId },
          include: { subscription: true },
        });
  
        if (!user) {
          throw new Error(`User not found for Clerk ID: ${metadata.userId}`);
        }
  
        const subscriptionData = {
          subscriptionId: subscriptionId,
          stripeUserId: session.customer as string,
          status: mapSubscriptionStatus(stripeSubscription.status), // Use the actual status from Stripe

          startDate: new Date(stripeSubscription.current_period_start * 1000),
          endDate: new Date(stripeSubscription.current_period_end * 1000),
          planType: subscriptionPlan.planType,
          email: user.email,
          clerkId: user.clerkId,
        };
  
        let subscription;
        if (user.subscription) {
          subscription = await prisma.subscription.update({
            where: { id: user.subscription.id },
            data: {
              ...subscriptionData,
              plan: { connect: { id: subscriptionPlan.id } },
            },
          });
          console.log(`Existing subscription ${subscriptionId} updated and set to ACTIVE`);
        } else {
          subscription = await prisma.subscription.create({
            data: {
              ...subscriptionData,
              user: { connect: { id: user.id } },
              plan: { connect: { id: subscriptionPlan.id } },
            },
          });
          console.log(`New subscription ${subscriptionId} created with status ACTIVE`);
        }
  
        const payment = await prisma.payment.create({
          data: {
            stripeId: session.id,
            email: user.email,
            amount: new Prisma.Decimal(session.amount_total! / 100),
            customerDetails: session.customer_details ? JSON.parse(JSON.stringify(session.customer_details)) : {},
            paymentIntent: session.payment_intent as string,
            paymentTime: new Date(session.created * 1000),
            currency: session.currency || 'usd',
            clerkId: user.clerkId,
          },
        });
  
        return { user, subscription, payment };
      });
  
      console.log('Transaction result:', JSON.stringify(result, null, 2));
  
      return NextResponse.json({
        status: 200,
        message: "Subscription activated and payment recorded successfully",
      });
    } catch (error) {
      console.error("Error handling checkout session:", error);
      return NextResponse.json({
        status: 500,
        error: "Error handling checkout session",
      });
    }
  }

  async function webhooksHandler(
    reqText: string,
    request: NextRequest
  ): Promise<NextResponse> {
    const sig = request.headers.get("Stripe-Signature");
  
    try {
      const event = await stripe.webhooks.constructEventAsync(
        reqText,
        sig!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
  
      switch (event.type) {
        case "customer.subscription.created":
          return handleSubscriptionEvent(event, "created");
        case "customer.subscription.updated":
          return handleSubscriptionUpdated(event);
        case "customer.subscription.deleted":
          return handleSubscriptionEvent(event, "deleted");
        case "invoice.payment_succeeded":
        
          return handleInvoiceEvent(event, "succeeded");
        case "invoice.payment_failed":
          return handleInvoiceEvent(event, "failed");
        case "checkout.session.completed":
          return handleCheckoutSessionCompleted(event);
        default:
          return NextResponse.json({
            status: 400,
            error: "Unhandled event type",
          });
      }
    } catch (err) {
      console.error("Error constructing Stripe event:", err);
      return NextResponse.json({
        status: 500,
        error: "Webhook Error: Invalid Signature",
      });
    }
  }
  


function mapSubscriptionStatus(stripeStatus: Stripe.Subscription.Status): SubscriptionStatus {
    switch (stripeStatus) {
      case 'active':
      case 'trialing':
        return SubscriptionStatus.ACTIVE;
      case 'canceled':
        return SubscriptionStatus.CANCELED;
      case 'past_due':
        return SubscriptionStatus.OVERDUE;
      case 'unpaid':
      case 'incomplete':
      case 'incomplete_expired':
        return SubscriptionStatus.UNPAID;
      default:
        console.warn(`Unknown Stripe subscription status: ${stripeStatus}`);
        return SubscriptionStatus.UNPAID;
    }
  }
  

