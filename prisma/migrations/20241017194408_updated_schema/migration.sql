-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'UNPAID');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('PAID', 'UNPAID', 'VOID');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('ESSAY', 'REPORT', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "gender" TEXT,
    "profileImageUrl" TEXT,
    "clerkId" TEXT NOT NULL,
    "dailyChatCount" INTEGER NOT NULL DEFAULT 0,
    "lastChatReset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SearchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "stripeUserId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "planId" TEXT NOT NULL,
    "defaultPaymentMethodId" TEXT,
    "email" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "dailyChatLimit" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "planId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "interval" TEXT NOT NULL,
    "dailyChatLimit" INTEGER NOT NULL,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripeId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "paymentTime" TIMESTAMP(3) NOT NULL,
    "currency" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "customerDetails" JSONB NOT NULL,
    "paymentIntent" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invoiceId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "amountPaid" DECIMAL(65,30) NOT NULL,
    "amountDue" DECIMAL(65,30),
    "currency" TEXT NOT NULL,
    "status" "InvoiceStatus" NOT NULL,
    "email" TEXT NOT NULL,
    "clerkId" TEXT,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL,
    "result" JSONB,
    "error" TEXT,
    "type" "JobType" NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "ChatMessage_userId_sessionId_idx" ON "ChatMessage"("userId", "sessionId");

-- CreateIndex
CREATE INDEX "SearchHistory_userId_domain_idx" ON "SearchHistory"("userId", "domain");

-- CreateIndex
CREATE UNIQUE INDEX "SearchHistory_userId_sessionId_domain_key" ON "SearchHistory"("userId", "sessionId", "domain");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_subscriptionId_key" ON "Subscription"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_clerkId_subscriptionId_idx" ON "Subscription"("clerkId", "subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlan_planId_key" ON "SubscriptionPlan"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlan_name_key" ON "SubscriptionPlan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripeId_key" ON "Payment"("stripeId");

-- CreateIndex
CREATE INDEX "Payment_clerkId_stripeId_idx" ON "Payment"("clerkId", "stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceId_key" ON "Invoice"("invoiceId");

-- CreateIndex
CREATE INDEX "Invoice_clerkId_invoiceId_idx" ON "Invoice"("clerkId", "invoiceId");

-- CreateIndex
CREATE INDEX "Job_userId_url_idx" ON "Job"("userId", "url");

-- CreateIndex
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchHistory" ADD CONSTRAINT "SearchHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
