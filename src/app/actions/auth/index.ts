"use server"

import { prisma } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { SubscriptionStatus } from '@prisma/client';

export const onLoginUser = async () => {
  const user = await currentUser();
  
  if (!user) {
    return { status: 401, message: "Unauthorized" };
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        subscription: {
          select: {
            status: true,
            endDate: true,
          },
        },
      },
    });

    if (!dbUser) {
      return { status: 404, message: "User not found in database" };
    }

    const hasActiveSubscription = dbUser.subscription &&
      dbUser.subscription.status === SubscriptionStatus.ACTIVE &&
      (dbUser.subscription.endDate === null || new Date(dbUser.subscription.endDate) > new Date());

    if (!hasActiveSubscription) {
      return { 
        status: 403, 
        message: "Access denied. Active subscription required.",
        user: {
          id: dbUser.id,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
        },
        subscriptionStatus: dbUser.subscription?.status || null
      };
    }

    return { 
      status: 200, 
      user: {
        id: dbUser.id,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
      },
      hasActiveSubscription: true,
      subscriptionStatus: SubscriptionStatus.ACTIVE
    };

  } catch (error: unknown) {
    if (error instanceof Error) {
      return { status: 400, message: error.message };
    }
    return { status: 400, message: 'An unknown error occurred' };
  }
};