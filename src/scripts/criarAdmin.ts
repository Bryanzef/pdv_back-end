import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Usuario from '../models/Usuario';

dotenv.config();

const criarAdminInicial = async () => {
  try {
    // Conectar ao MongoDB
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI não está definida no arquivo .env');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Verificar se já existe um admin
    const adminExistente = await Usuario.findOne({ role: 'admin' });
    
    if (adminExistente) {
      console.log('⚠️  Já existe um usuário admin no sistema');
      console.log(`📧 Email do admin: ${adminExistente.email}`);
      process.exit(0);
    }

    // Dados do admin inicial
    const adminData = {
      nome: 'Administrador',
      email: 'admin@fruteira.com',
      senha: 'admin123',
      role: 'admin' as const
    };

    // Criar o admin
    const admin = new Usuario(adminData);
    await admin.save();

    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📋 Credenciais do admin:');
    console.log(`   📧 Email: ${adminData.email}`);
    console.log(`   🔑 Senha: ${adminData.senha}`);
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');

    process.exit(0);

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
    process.exit(1);
  }
};

// Executar o script
criarAdminInicial(); 