/*
  Warnings:

  - You are about to drop the column `paymentIntentId` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentIntentId";
