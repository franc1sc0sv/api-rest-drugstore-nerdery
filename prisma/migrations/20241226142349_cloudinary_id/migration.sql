/*
  Warnings:

  - A unique constraint covering the columns `[cloudinaryPublicId]` on the table `ProductImage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cloudinaryPublicId` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "cloudinaryPublicId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductImage_cloudinaryPublicId_key" ON "ProductImage"("cloudinaryPublicId");
