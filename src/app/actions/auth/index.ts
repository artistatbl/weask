"use server"
import {prisma} from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

export const onLoginUser = async () => {
  const user = await currentUser();
  if (!user) {
    return { status: 401 };
  } else {
    try {
      const authenticated = await prisma.user.findUnique({
        where: {
          clerkId: user.id,
        },
        select: {
          firstname: true,
          lastname: true,
          id: true,
        },
      });

      if (authenticated) {
        // const domains = await onGetAllAccountDomains();
        return { status: 200, user: authenticated /*, domain: domains?.domains */ };
      } else {
        // Handle case where user is not found in the database
        return { status: 404, message: "User not found" };
      }
    } catch (error: unknown) { // Changed from any to unknown
      if (error instanceof Error) {
        return { status: 400, message: error.message };
      }
      // Handle non-Error objects
      return { status: 400, message: 'An unknown error occurred' };
    }
  }
};
