-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "lastInvoiceAmount" DECIMAL(65,30),
ADD COLUMN     "lastInvoiceDate" TIMESTAMP(3);
