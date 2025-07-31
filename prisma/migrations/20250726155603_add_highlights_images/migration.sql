/*
  Warnings:

  - A unique constraint covering the columns `[ibgeCode]` on the table `Municipality` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Municipality" ADD COLUMN     "ibgeCode" TEXT;

-- CreateTable
CREATE TABLE "HighlightImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "highlightId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HighlightImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Municipality_ibgeCode_key" ON "Municipality"("ibgeCode");

-- AddForeignKey
ALTER TABLE "HighlightImage" ADD CONSTRAINT "HighlightImage_highlightId_fkey" FOREIGN KEY ("highlightId") REFERENCES "Highlight"("id") ON DELETE CASCADE ON UPDATE CASCADE;
