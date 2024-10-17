import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';



export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  // Get the headers
  const svix_id = req.headers.get('svix-id');
  const svix_timestamp = req.headers.get('svix-timestamp');
  const svix_signature = req.headers.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Error occurred -- no svix headers' }, { status: 400 });
  }

  // Get the body
  const body = await req.text();

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json({ error: 'Error occurred' }, { status: 400 });
  }

  // Handle the webhook
  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const email = email_addresses[0]?.email_address;

    try {
      const user = await prisma.user.create({
        data: {
          clerkId: id,
          email: email,
          firstName: first_name || null,
          lastName: last_name || null,
          profileImageUrl: image_url || null,
          
        },
      });

      console.log('User created:', user);
      return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
    } catch (error) {
      console.error('Error creating user:', error);
      return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
}