/*
  Warnings:

  - You are about to drop the column `budgetpercent` on the `businessResult` table. All the data in the column will be lost.
  - You are about to drop the column `division` on the `businessResult` table. All the data in the column will be lost.
  - You are about to drop the column `expectedpercent` on the `businessResult` table. All the data in the column will be lost.
  - You are about to drop the column `division` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `expectedpercent` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `secondMonth` on the `category` table. All the data in the column will be lost.
  - Added the required column `expectedPercent` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "businessResult" DROP COLUMN "budgetpercent",
DROP COLUMN "division",
DROP COLUMN "expectedpercent",
ADD COLUMN     "budgetPercent" DOUBLE PRECISION,
ADD COLUMN     "deviation" DOUBLE PRECISION,
ADD COLUMN     "expectedPercent" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "category" DROP COLUMN "division",
DROP COLUMN "expectedpercent",
DROP COLUMN "secondMonth",
ADD COLUMN     "deviation" DOUBLE PRECISION,
ADD COLUMN     "expectedPercent" INTEGER NOT NULL,
ADD COLUMN     "secondYear" DOUBLE PRECISION;
