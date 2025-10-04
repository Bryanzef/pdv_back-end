# 🍉 PDV Sistema - Backend API

**Sistema de PDV (Ponto de Venda) - Backend API desenvolvido com Node.js, Express, TypeScript e Prisma**

> ⚠️ **AVISO LEGAL**: Este projeto é de propriedade exclusiva de **Bryan Zef**. É **PROIBIDO** copiar, distribuir, modificar ou usar este código sem autorização expressa por escrito do autor. Todos os direitos reservados.

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

## 🛠️ Instalação e Configuração Local

### 1. Pré-requisitos
- Node.js 18+ instalado
- PostgreSQL ou conta no Supabase
- Git instalado

### 2. Clone o repositório
```bash
git clone https://github.com/Bryanzef/pdv_back-end.git
cd pdv_back-end
```

### 3. Instale as dependências
```bash
npm install
```

### 4. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp env.example .env
```

### 5. Configure o arquivo `.env` para desenvolvimento local
```env
# Configuração do Servidor
PORT=5000
NODE_ENV=development

# URL do frontend (para CORS)
FRONTEND_URL=http://localhost:5173

# Banco de Dados PostgreSQL (Supabase)
DATABASE_URL="postgresql://usuario:senha@host:porta/database"

# JWT Secret (gere uma chave forte)
JWT_SECRET="sua_chave_secreta_jwt_aqui_123456789"

# Configurações de Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 6. Configure o banco de dados
```bash
# Gere o cliente Prisma
npm run prisma:generate

# Execute as migrações
npm run prisma:migrate

# (Opcional) Popule com dados iniciais
npm run seed:admin
npm run seed:produtos
```

### 7. Execute o projeto
```bash
# Modo desenvolvimento
npm run dev

# O servidor iniciará em http://localhost:5000
```

## 🔧 Configuração do Frontend Local

Para testar a integração completa, configure o frontend:

### 1. Clone o frontend
```bash
git clone https://github.com/Bryanzef/pdv_front-end.git
cd pdv_front-end
```

### 2. Configure o frontend
```bash
# Instale dependências
npm install

# Configure .env (deixe VITE_API_URL vazio para usar proxy)
cp .env.example .env
```

### 3. Execute o frontend
```bash
# Desenvolvimento
npm run dev

# O frontend rodará em http://localhost:5173
```

## 🚀 Executando

### Desenvolvimento
```bash
npm run dev
# Acesse: http://localhost:5000
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
