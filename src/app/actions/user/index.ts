"use server";

import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function getUserSubscription() {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      subscription: {
        include: {
          plan: true
        }
      }
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.subscription;
}
