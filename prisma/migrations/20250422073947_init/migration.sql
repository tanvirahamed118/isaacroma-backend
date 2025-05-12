/*
  Warnings:

  - Added the required column `category` to the `category` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `name` on the `category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "category" ADD COLUMN     "category" "CategoryName" NOT NULL,
ADD COLUMN     "secondMonth" INTEGER,
DROP COLUMN "name",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "permonth" ALTER COLUMN "value" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "categoryId" DROP NOT NULL,
ALTER COLUMN "businessResultId" DROP NOT NULL;
