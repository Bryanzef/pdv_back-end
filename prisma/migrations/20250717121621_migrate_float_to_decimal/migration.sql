/*
  Warnings:

  - You are about to alter the column `total` on the `Sale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `preco` on the `SaleItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - Added the required column `valorPago` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "troco" DECIMAL(12,2),
ADD COLUMN     "valorPago" DECIMAL(12,2) NOT NULL,
ALTER COLUMN "total" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "SaleItem" ALTER COLUMN "preco" SET DATA TYPE DECIMAL(12,2);
