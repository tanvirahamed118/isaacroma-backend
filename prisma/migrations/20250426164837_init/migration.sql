/*
  Warnings:

  - The values [JULIY] on the enum `MonthName` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MonthName_new" AS ENUM ('JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECIMBER');
ALTER TABLE "cashflow" ALTER COLUMN "month" TYPE "MonthName_new" USING ("month"::text::"MonthName_new");
ALTER TABLE "permonth" ALTER COLUMN "name" TYPE "MonthName_new" USING ("name"::text::"MonthName_new");
ALTER TYPE "MonthName" RENAME TO "MonthName_old";
ALTER TYPE "MonthName_new" RENAME TO "MonthName";
DROP TYPE "MonthName_old";
COMMIT;
