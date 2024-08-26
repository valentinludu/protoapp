/*
  Warnings:

  - A unique constraint covering the columns `[farcasterId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "farcasterId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_farcasterId_key" ON "User"("farcasterId");
