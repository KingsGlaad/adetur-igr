-- CreateTable
CREATE TABLE "MunicipalityImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "municipalityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MunicipalityImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MunicipalityImage" ADD CONSTRAINT "MunicipalityImage_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "Municipality"("id") ON DELETE CASCADE ON UPDATE CASCADE;
