/*
  Warnings:

  - Added the required column `ownername` to the `cashflowmonth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownername` to the `permonth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cashflowmonth" ADD COLUMN     "ownername" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "permonth" ADD COLUMN     "ownername" TEXT NOT NULL;
