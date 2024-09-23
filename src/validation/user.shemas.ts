import { z } from 'zod';

// User schema
export const userSchema = z.object({
  id: z.number().int().positive(),
  createdtime: z.date(),
  email: z.string().email(),
  firstname: z.string().nullable(),
  lastname: z.string().nullable(),
  gender: z.string().nullable(),
  profileimageurl: z.string().url().nullable(),
  clerkId: z.string(),
  subscription: z.string().nullable(),
});

// Payments schema
export const paymentsSchema = z.object({
  id: z.number().int().positive(),
  createdtime: z.date(),
  stripeid: z.string(),
  email: z.string().email(),
  amount: z.string(),
  paymenttime: z.string(),
  paymentdate: z.string(),
  currency: z.string(),
  clerkId: z.string(),
  customerdetails: z.string(),
  paymentintent: z.string(),
});

// Subscriptions schema
export const subscriptionsSchema = z.object({
  id: z.number().int().positive(),
  createdtime: z.date(),
  subscriptionId: z.string(),
  stripeuserId: z.string(),
  status: z.string(),
  startdate: z.string(),
  enddate: z.string().nullable(),
  planid: z.string(),
  defaultpaymentmethodid: z.string().nullable(),
  email: z.string().email(),
  clerkId: z.string(),
});

// Subscription plans schema
export const subscriptionPlansSchema = z.object({
  id: z.number().int().positive(),
  createdtime: z.date(),
  planId: z.string(),
  name: z.string(),
  description: z.string(),
  amount: z.string(),
  currency: z.string(),
  interval: z.string(),
});

// Invoices schema
export const invoicesSchema = z.object({
  id: z.number().int().positive(),
  createdtime: z.date(),
  invoiceId: z.string(),
  subscriptionId: z.string(),
  amountPaid: z.string(),
  amountDue: z.string().nullable(),
  currency: z.string(),
  status: z.string(),
  email: z.string().email(),
  clerkId: z.string().nullable(),
});

// You can also create partial schemas for updates or inputs
export const userUpdateSchema = userSchema.partial().omit({ id: true, createdtime: true });
export const userCreateSchema = userSchema.omit({ id: true, createdtime: true });

export const paymentsCreateSchema = paymentsSchema.omit({ id: true, createdtime: true });
export const subscriptionsCreateSchema = subscriptionsSchema.omit({ id: true, createdtime: true });
export const subscriptionPlansCreateSchema = subscriptionPlansSchema.omit({ id: true, createdtime: true });
export const invoicesCreateSchema = invoicesSchema.omit({ id: true, createdtime: true });

// Type inference
export type User = z.infer<typeof userSchema>;
export type Payments = z.infer<typeof paymentsSchema>;
export type Subscriptions = z.infer<typeof subscriptionsSchema>;
export type SubscriptionPlans = z.infer<typeof subscriptionPlansSchema>;
export type Invoices = z.infer<typeof invoicesSchema>;
