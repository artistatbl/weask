-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "subscriptionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SubscriptionPlan" ADD COLUMN     "montlyPrice" DECIMAL(65,30);
