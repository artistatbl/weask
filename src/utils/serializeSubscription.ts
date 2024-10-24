import { Subscription, SubscriptionPlan } from '@prisma/client'
// import { Decimal } from '@prisma/client/runtime'

type SerializedSubscription = Omit<Subscription, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
  plan: SerializedSubscriptionPlan | null
}

type SerializedSubscriptionPlan = Omit<SubscriptionPlan, 'price' | 'yearlyPrice' | 'monthlyPrice' | 'createdAt' | 'updatedAt'> & {
  price: string
  yearlyPrice: string
  monthlyPrice: string
  createdAt: string
  updatedAt: string
}

export function serializeSubscription(subscription: Subscription & { plan: SubscriptionPlan | null }): SerializedSubscription {
  return {
    ...subscription,
    createdAt: subscription.createdAt.toISOString(),
    updatedAt: subscription.updatedAt.toISOString(),
    plan: subscription.plan ? {
      ...subscription.plan,
      price: subscription.plan.price.toString(),
      yearlyPrice: subscription.plan.yearlyPrice?.toString() ?? '0',
      monthlyPrice: subscription.plan.montlyPrice?.toString() ?? '0',
      createdAt: subscription.plan.createdAt.toISOString(),
      updatedAt: subscription.plan.updatedAt.toISOString(),
    } : null
  }
}
