/*
  Warnings:

  - The values [CONSULTING] on the enum `BusinessPlan` will be removed. If these variants are still used in the database, this will fail.
  - The `start_at` column on the `userMembership` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `active` to the `userMembership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionId` to the `userMembership` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BusinessPlan_new" AS ENUM ('BASIC', 'MEDIUM', 'PREMIUM');
ALTER TABLE "userMembership" ALTER COLUMN "plan" TYPE "BusinessPlan_new" USING ("plan"::text::"BusinessPlan_new");
ALTER TYPE "BusinessPlan" RENAME TO "BusinessPlan_old";
ALTER TYPE "BusinessPlan_new" RENAME TO "BusinessPlan";
DROP TYPE "BusinessPlan_old";
COMMIT;

-- AlterTable
ALTER TABLE "userMembership" ADD COLUMN     "active" BOOLEAN NOT NULL,
ADD COLUMN     "transactionId" TEXT NOT NULL,
DROP COLUMN "start_at",
ADD COLUMN     "start_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
