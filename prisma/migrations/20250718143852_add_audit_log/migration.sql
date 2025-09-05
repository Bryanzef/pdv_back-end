/*
  Warnings:

  - Made the column `tipo` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "tipo" SET NOT NULL;

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "usuarioAutorId" TEXT NOT NULL,
    "usuarioAlvoId" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_usuarioAutorId_fkey" FOREIGN KEY ("usuarioAutorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_usuarioAlvoId_fkey" FOREIGN KEY ("usuarioAlvoId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
