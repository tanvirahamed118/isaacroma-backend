-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "BusinessPlan" AS ENUM ('CONSULTING', 'BASIC', 'MEDIUM', 'PREMIUM');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "CategoryName" AS ENUM ('SALES_REVENUE', 'CAPITAL_INCRIEASE_LOAN', 'SHOPPING', 'EXTRAORDINARY', 'PERSOANL', 'FINIANCIAL');

-- CreateEnum
CREATE TYPE "ResultName" AS ENUM ('TOTAL_PAYMENT_FOR_MONTH', 'Monthly_SALES_FORECAST', 'TOTAL_SALES_REVENUE', 'TOTAL_CAPITAL_INCRIEASE_LOAN', 'TOTAL_EXPENSES', 'TOTAL_COST_OF_SALES', 'TOTAL_SHOPPING', 'TOTAL_EXTRAORDINARY_EXPENSES', 'TOTAL_PERSOANL_EXPENSES', 'TOTAL_FINIANCIAL_EXPENSES', 'DIRECT_EXPENSES', 'EBITDA', 'DEPRECIATION', 'DIRECT_RESULT', 'OTHER_INCOME_EXPENSES', 'OPERATING_PROFIT', 'CUMULATIVE_RESULT');

-- CreateEnum
CREATE TYPE "FlowName" AS ENUM ('ACCUMULATED_BALANCE_BEGAINING', 'ACCUMULATED_BALANCE_END', 'SALES_COLLECTIONS', 'PREVIOUS_BALANCE', 'TOTAL_PERCENT_FOR_COLLECTION', 'UNPAIN_PERCENT', 'RECOVERED_PERCENT', 'TOTAL_OPERATING_COLLECTION', 'TOTAL_OTHER_CHARGES', 'TOTAL_NET_COLLECTIONS', 'OPERATIONAL_PAYMENTS', 'TOTAL_OPERATING_PAYMENTS', 'OTHER_PAYMENTS', 'TOTAL_OTHER_PAYMENTS', 'TOTAL_PAYMENTS', 'MONTHLY_NET_BALANCE');

-- CreateEnum
CREATE TYPE "MonthName" AS ENUM ('JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULIY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECIMBER');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userMembership" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "plan" "BusinessPlan" NOT NULL,
    "price" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "start_at" TEXT NOT NULL,
    "end_at" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" "CategoryName" NOT NULL,
    "firstYear" INTEGER NOT NULL,
    "expectedpercent" INTEGER NOT NULL,
    "type" "Type" NOT NULL,
    "userId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "businessResult" (
    "id" TEXT NOT NULL,
    "name" "ResultName" NOT NULL,
    "firstYear" INTEGER,
    "secondYear" INTEGER,
    "budgetpercent" INTEGER,
    "expectedpercent" INTEGER,
    "division" INTEGER,
    "businessId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "businessResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cashflow" (
    "id" TEXT NOT NULL,
    "name" "FlowName" NOT NULL,
    "value" INTEGER NOT NULL,
    "month" "MonthName" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cashflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permonth" (
    "id" TEXT NOT NULL,
    "name" "MonthName" NOT NULL,
    "value" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    "businessResultId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permonth_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userMembership" ADD CONSTRAINT "userMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business" ADD CONSTRAINT "business_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "businessResult" ADD CONSTRAINT "businessResult_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "businessResult" ADD CONSTRAINT "businessResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permonth" ADD CONSTRAINT "permonth_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permonth" ADD CONSTRAINT "permonth_businessResultId_fkey" FOREIGN KEY ("businessResultId") REFERENCES "businessResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
