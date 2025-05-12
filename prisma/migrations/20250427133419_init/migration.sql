/*
  Warnings:

  - You are about to drop the column `month` on the `cashflow` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `cashflow` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cashflow" DROP COLUMN "month",
DROP COLUMN "value",
ADD COLUMN     "flowPercent" DOUBLE PRECISION,
ADD COLUMN     "inputPercent" DOUBLE PRECISION,
ADD COLUMN     "total" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "cashflowmonth" (
    "id" TEXT NOT NULL,
    "name" "MonthName" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "cashflowId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cashflowmonth_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cashflowmonth" ADD CONSTRAINT "cashflowmonth_cashflowId_fkey" FOREIGN KEY ("cashflowId") REFERENCES "cashflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
