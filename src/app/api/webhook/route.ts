import {prisma} from '@/lib/db'
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: Request) {
  console.log("Webhook endpoint hit");
  
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  //console.log("WEBHOOK_SECRET:", WEBHOOK_SECRET); 
  // Add this line for debugging

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not set in the environment variables");
    return new Response("Server misconfigured", { status: 500 });
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", { status: 400 });
  }

  const eventType = evt.type;

  interface UserData {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string;
    last_name: string;
    image_url: string;
  }

  async function upsertUser(userData: UserData) {
    const { id, email_addresses, first_name, last_name, image_url } = userData;
    const email = email_addresses[0]?.email_address;

    return prisma.user.upsert({
      where: { clerkId: id },
      update: {
        email,
        firstname: first_name,
        lastname: last_name,
        profileimageurl: image_url,
      },
      create: {
        clerkId: id,
        email,
        firstname: first_name || '',
        lastname: last_name || '',
        profileimageurl: image_url || '',
      },
    });
  }

  switch (eventType) {
    case "user.created":
    case "user.updated":
      try {
        const user = await upsertUser(payload.data);

        // Check if the user already has a subscription
        const existingSubscription = await prisma.subscription.findFirst({
          where: { clerkId: user.clerkId },
        });

        if (!existingSubscription) {
          await prisma.subscription.create({
            data: {
              subscriptionId: `sub_${user.id}_${Date.now()}`,
              stripeuserId: `cus_${user.id}`,
              status: 'ACTIVE',
              startdate: new Date().toISOString(),
              planid: 'FREE',
              email: user.email,
              clerkId: user.clerkId,
            },
          });
        }

        return NextResponse.json({
          status: 200,
          message: eventType === "user.created" ? "User created" : "User updated",
        });
      } catch (error) {
        console.error("Error processing user:", error);
        return NextResponse.json({
          status: 400,
          message: (error as Error).message,
        });
      }

    default:
      return new Response("Error occurred -- unhandled event type", { status: 400 });
  }
}