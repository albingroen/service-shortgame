/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `Confirmation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Confirmation.phoneNumber_unique" ON "Confirmation"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User.phoneNumber_unique" ON "User"("phoneNumber");
