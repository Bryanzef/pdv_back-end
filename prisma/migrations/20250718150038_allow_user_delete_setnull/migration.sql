-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_usuarioAlvoId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_usuarioAutorId_fkey";

-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_vendedorId_fkey";

-- AlterTable
ALTER TABLE "AuditLog" ALTER COLUMN "usuarioAutorId" DROP NOT NULL,
ALTER COLUMN "usuarioAlvoId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Sale" ALTER COLUMN "vendedorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_usuarioAutorId_fkey" FOREIGN KEY ("usuarioAutorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_usuarioAlvoId_fkey" FOREIGN KEY ("usuarioAlvoId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
