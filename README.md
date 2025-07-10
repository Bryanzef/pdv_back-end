# Sistema PDV Fruteira - Backend

## 🏗️ Visão Geral
Este projeto faz parte do sistema completo de PDV para Fruteira, composto por um backend (Node.js/Express/TypeScript), frontend (React/TypeScript) e banco de dados MongoDB. O backend fornece APIs REST seguras para autenticação, cadastro de produtos, registro de vendas e histórico.

## 🔗 Integração
- O frontend consome as APIs REST deste backend.
- Autenticação via JWT: o token é gerado no login e enviado pelo frontend em cada requisição protegida.
- CORS configurado para aceitar requisições do frontend.

## ⚙️ Tecnologias
- Node.js, Express, TypeScript
- MongoDB + Mongoose
- JWT para autenticação
- Bcryptjs para hash de senhas
- Helmet, CORS, Rate Limiting para segurança

## 🚦 Fluxo de Autenticação
1. Usuário faz login via `/api/auth/login`.
2. Backend valida credenciais, gera JWT e retorna ao frontend.
3. Frontend armazena o token e envia em cada requisição protegida.
4. Backend valida o token e autoriza o acesso conforme o perfil (`admin` ou `usuario`).


   ```

## 🧑‍💻 Scripts Úteis
- `npm run dev` — Servidor em modo desenvolvimento
- `npm run build` — Compila o TypeScript
- `npm start` — Servidor em produção
- `npm run criar-admin` — Cria o usuário admin inicial
- `npx ts-node src/scripts/seedProdutos.ts` — Popula o banco com 20 produtos
- `npx ts-node src/scripts/seedVendas.ts` — Popula o banco com 5 vendas

## 🛣️ Endpoints Principais
- `POST /api/auth/login` — Login
- `POST /api/auth/registro` — Cadastro de usuário (admin)
- `GET /api/auth/me` — Dados do usuário logado
- `POST /api/auth/alterar-senha` — Alterar senha
- `GET/POST/PUT/DELETE /api/produtos` — CRUD de produtos
- `GET/POST/DELETE /api/vendas` — Registro e histórico de vendas

## 🌱 Seeds e Dados de Teste
1. Crie o admin: `npm run criar-admin`
2. Popule produtos: `npx ts-node src/scripts/seedProdutos.ts`
3. Popule vendas: `npx ts-node src/scripts/seedVendas.ts`

## 📁 Estrutura de Pastas
- `src/models` — Schemas do Mongoose
- `src/routes` — Rotas da API
- `src/middleware` — Middlewares de autenticação e segurança
- `src/scripts` — Scripts utilitários e seeds
- `src/server.ts` — Inicialização do servidor

## 📝 Observações
- O backend depende do MongoDB rodando localmente ou em nuvem.
- O frontend deve ser configurado para apontar para a URL deste backend.

## 👨‍💻 Contato
Desenvolvido por Bryan — 2024 