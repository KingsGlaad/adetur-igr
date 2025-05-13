/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Municipality` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Municipality" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Municipality_slug_key" ON "Municipality"("slug");
