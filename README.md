# PDV Backend API

Sistema de PDV (Ponto de Venda) - Backend API desenvolvido com Node.js, Express, TypeScript e Prisma.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Linguagem tipada
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados (Supabase)
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas
- **Zod** - Validação de dados

## 📋 Funcionalidades

- ✅ Autenticação e autorização de usuários
- ✅ CRUD de produtos
- ✅ CRUD de usuários
- ✅ Sistema de vendas
- ✅ Relatórios e histórico
- ✅ Middleware de segurança (CORS, Helmet, Rate Limiting)
- ✅ Validação de dados com Zod
- ✅ Logs estruturados

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Bryanzef/pdv_back-end.git
cd pdv_back-end
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp env.example .env
```

4. Configure o arquivo `.env` com suas credenciais:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL="postgresql://usuario:senha@localhost:5432/pdv_bryan"
JWT_SECRET="sua_chave_secreta_jwt_aqui"
```

5. Execute as migrações do banco:
```bash
npm run prisma:generate
npm run prisma:migrate
```

6. (Opcional) Execute os seeds para dados iniciais:
```bash
npm run seed:admin
npm run seed:produtos
```

## 🚀 Executando

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 📚 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Compila o TypeScript
- `npm run start` - Executa a versão compilada
- `npm run build:prod` - Build para produção
- `npm run deploy` - Deploy completo
- `npm run prisma:generate` - Gera o cliente Prisma
- `npm run prisma:migrate` - Executa migrações
- `npm run prisma:studio` - Abre o Prisma Studio
- `npm run seed:admin` - Cria usuário administrador
- `npm run seed:produtos` - Popula produtos iniciais

## 🌐 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de usuário

### Usuários
- `GET /api/usuarios` - Listar usuários
- `POST /api/usuarios` - Criar usuário
- `PUT /api/usuarios/:id` - Atualizar usuário
- `DELETE /api/usuarios/:id` - Deletar usuário

### Produtos
- `GET /api/produtos` - Listar produtos
- `POST /api/produtos` - Criar produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Deletar produto

### Vendas
- `GET /api/vendas` - Listar vendas
- `POST /api/vendas` - Criar venda
- `GET /api/vendas/:id` - Buscar venda por ID
- `GET /api/vendas/relatorio` - Relatório de vendas

## 🔒 Segurança

- CORS configurado para múltiplas origens
- Rate limiting para prevenir ataques
- Validação de dados com Zod
- Autenticação JWT
- Senhas criptografadas com bcrypt
- Headers de segurança com Helmet

## 🚀 Deploy

### Render/Railway/Heroku

1. Configure as variáveis de ambiente no painel do serviço
2. Configure o build command: `npm run build:prod`
3. Configure o start command: `npm start`

### Variáveis de Ambiente para Produção

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://seu-frontend.vercel.app
DATABASE_URL="postgresql://usuario:senha@host:porta/database"
JWT_SECRET="chave_secreta_forte_para_producao"
```

## 📝 Estrutura do Projeto

```
src/
├── controllers/     # Controladores das rotas
├── middleware/      # Middlewares (auth, error, rate-limit)
├── models/         # Modelos de dados
├── routes/         # Definição das rotas
├── services/       # Lógica de negócio
├── utils/          # Utilitários
├── validation/     # Schemas de validação
└── server.ts       # Arquivo principal
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para [seu-email@exemplo.com] ou abra uma issue no GitHub.
