/*
  Warnings:

  - You are about to drop the column `destiny` on the `CategoryMapping` table. All the data in the column will be lost.
  - You are about to drop the column `origin` on the `CategoryMapping` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the `ProjectMapping` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `destino` to the `CategoryMapping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origem` to the `CategoryMapping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectMapping" DROP CONSTRAINT "ProjectMapping_companyId_fkey";

-- DropIndex
DROP INDEX "CategoryMapping_origin_key";

-- DropIndex
DROP INDEX "Company_name_key";

-- AlterTable
ALTER TABLE "CategoryMapping" DROP COLUMN "destiny",
DROP COLUMN "origin",
ADD COLUMN     "destino" TEXT NOT NULL,
ADD COLUMN     "origem" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "name",
DROP COLUMN "status",
ADD COLUMN     "nome" TEXT NOT NULL;

-- DropTable
DROP TABLE "ProjectMapping";

-- CreateTable
CREATE TABLE "EscalaMapping" (
    "id" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "origem" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EscalaMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VinculoMapping" (
    "id" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "VinculoMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VinculoMapping_sigla_key" ON "VinculoMapping"("sigla");
