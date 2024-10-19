import { PrismaClient, PlanType, SubscriptionStatus } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

async function main() {
  // Create Subscription Plans
  const basicPlan = await prisma.subscriptionPlan.upsert({
    where: { name: 'Basic Plan' },
    update: {},
    create: {
      planId: 'basic',
      name: 'Basic Plan',
      description: 'Perfect for getting started with QuillMinds',
      price: 9.99,
      yearlyPrice: 107.88,
      currency: 'USD',
      interval: 'month',
      dailyChatLimit: 100,
      planType: PlanType.BASIC,
      features: [
        '100 chat messages a day',
        'Basic customization options',
        'Email support',
      ],
    },
  })

  const proPlan = await prisma.subscriptionPlan.upsert({
    where: { name: 'Pro Plan' },
    update: {},
    create: {
      planId: 'pro',
      name: 'Pro Plan',
      description: 'For educators who want more from QuillMinds',
      price: 19.99,
      yearlyPrice: 215.88,
      currency: 'USD',
      interval: 'month',
      dailyChatLimit: 200,
      planType: PlanType.PRO,
      features: [
        '200 chat messages a day',
        'Advanced customization options',
        'Priority support',
        'Collaboration tools',
        'Premium templates',
      ],
    },
  })

  console.log('Subscription plans created:', { basicPlan, proPlan })

  // Create sample users with subscriptions
  const users = [
    {
      email: 'basics_user@example.com',
      firstName: 'Basic',
      lastName: 'User',
      clerkId: uuidv4(),
      planType: PlanType.BASIC,
    },
    {
      email: 'jdaly2991@gmail.com',
      firstName: 'Jean',
      lastName: 'Daly',
      clerkId: uuidv4(),
      planType: PlanType.PRO,
    },
    // {
    //   email: 'free_user@example.com',
    //   firstName: 'Free',
    //   lastName: 'User',
    //   clerkId: uuidv4(),
    //   planType: null, // No subscription
    // },
  ]

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        clerkId: userData.clerkId,
        dailyChatCount: 0,
        lastChatReset: new Date(),
      },
    })

    if (userData.planType) {
      const plan = userData.planType === PlanType.BASIC ? basicPlan : proPlan
      await prisma.subscription.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          subscriptionId: uuidv4(),
          stripeUserId: `stripe_${uuidv4()}`,
          status: SubscriptionStatus.ACTIVE,
          startDate: new Date(),
          planId: plan.id,
          planType: userData.planType,
          email: user.email,
          clerkId: user.clerkId,
          userId: user.id,
        },
      })
    }

    console.log(`User created: ${user.email}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
