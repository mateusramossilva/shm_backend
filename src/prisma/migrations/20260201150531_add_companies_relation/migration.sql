/*
  Warnings:

  - A unique constraint covering the columns `[origin,companyId]` on the table `Dictionary` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `Dictionary` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Dictionary_origin_key";

-- AlterTable
ALTER TABLE "Dictionary" ADD COLUMN     "companyId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Ativo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Dictionary_origin_companyId_key" ON "Dictionary"("origin", "companyId");

-- AddForeignKey
ALTER TABLE "Dictionary" ADD CONSTRAINT "Dictionary_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
