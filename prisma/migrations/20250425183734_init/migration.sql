/*
  Warnings:

  - The values [DEPRECIATION] on the enum `ResultName` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ResultName_new" AS ENUM ('TOTAL_PAYMENT_FOR_MONTH', 'MONTHLY_SALES_FORECAST', 'TOTAL_SALES_REVENUE', 'TOTAL_CAPITAL_INCRIEASE_LOAN', 'TOTAL_EXPENSES', 'TOTAL_COST_OF_SALES', 'TOTAL_SHOPPING', 'TOTAL_EXTRAORDINARY_EXPENSES', 'TOTAL_PERSOANL_EXPENSES', 'TOTAL_FINIANCIAL_EXPENSES', 'DIRECT_EXPENSES', 'EBITDA', 'BUDGET_DEPRECIATION', 'PROJECTION_DEPRECIATION', 'DIRECT_RESULT', 'OTHER_INCOME_EXPENSES', 'OPERATING_PROFIT', 'CUMULATIVE_RESULT');
ALTER TABLE "businessResult" ALTER COLUMN "name" TYPE "ResultName_new" USING ("name"::text::"ResultName_new");
ALTER TYPE "ResultName" RENAME TO "ResultName_old";
ALTER TYPE "ResultName_new" RENAME TO "ResultName";
DROP TYPE "ResultName_old";
COMMIT;
