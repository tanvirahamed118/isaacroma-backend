/*
  Warnings:

  - Added the required column `businessId` to the `cashflow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cashflow" ADD COLUMN     "businessId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "cashflow" ADD CONSTRAINT "cashflow_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
