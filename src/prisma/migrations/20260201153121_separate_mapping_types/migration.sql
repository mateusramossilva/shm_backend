/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the `Dictionary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Dictionary" DROP CONSTRAINT "Dictionary_companyId_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "createdAt";

-- DropTable
DROP TABLE "Dictionary";

-- CreateTable
CREATE TABLE "ProjectMapping" (
    "id" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destiny" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "ProjectMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryMapping" (
    "id" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destiny" TEXT NOT NULL,

    CONSTRAINT "CategoryMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoryMapping_origin_key" ON "CategoryMapping"("origin");

-- AddForeignKey
ALTER TABLE "ProjectMapping" ADD CONSTRAINT "ProjectMapping_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
