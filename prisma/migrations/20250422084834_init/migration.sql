/*
  Warnings:

  - The values [SHOPPING] on the enum `CategoryName` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CategoryName_new" AS ENUM ('SALES_REVENUE', 'CAPITAL_INCRIEASE_LOAN', 'COST_OF_SALES', 'EXTRAORDINARY', 'PERSOANL', 'FINIANCIAL');
ALTER TABLE "category" ALTER COLUMN "category" TYPE "CategoryName_new" USING ("category"::text::"CategoryName_new");
ALTER TYPE "CategoryName" RENAME TO "CategoryName_old";
ALTER TYPE "CategoryName_new" RENAME TO "CategoryName";
DROP TYPE "CategoryName_old";
COMMIT;
