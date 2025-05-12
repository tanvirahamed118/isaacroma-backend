/*
  Warnings:

  - A unique constraint covering the columns `[businessId,userId,name]` on the table `businessResult` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "businessResult_businessId_userId_name_key" ON "businessResult"("businessId", "userId", "name");
