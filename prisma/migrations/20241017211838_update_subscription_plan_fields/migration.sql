/*
  Warnings:

  - You are about to drop the column `dailyChatLimit` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `planType` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planType` to the `SubscriptionPlan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('BASIC', 'PRO');

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "dailyChatLimit",
ADD COLUMN     "planType" "PlanType" NOT NULL;

-- AlterTable
ALTER TABLE "SubscriptionPlan" ADD COLUMN     "planType" "PlanType" NOT NULL;
