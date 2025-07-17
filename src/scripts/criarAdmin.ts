import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

async function main() {
  const adminEmail = 'admin@fruteira.com';
  const adminSenha = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      nome: 'Administrador',
      email: adminEmail,
      senha: adminSenha,
      perfil: 'admin',
      ativo: true
    }
  });
  console.log('✅ Admin criado ou já existente!');
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}); 