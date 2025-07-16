# Sistema PDV Fruteira - Backend

## 🏗️ Visão Geral
API RESTful para gestão de vendas, produtos e usuários de uma fruteira. Implementa autenticação JWT, controle de acesso por perfil (admin/usuário), registro de vendas, histórico e scripts utilitários.

## 🔗 Integração
- Frontend consome as APIs REST.
- Autenticação via JWT (Bearer Token).
- CORS configurado para aceitar requisições do frontend.

## ⚙️ Tecnologias
- Node.js, Express, TypeScript
- MongoDB + Mongoose
- JWT, Bcryptjs
- Helmet, CORS, Rate Limiting

## 🏛️ Arquitetura Geral
- Estrutura modular: controllers, services, models, middlewares e rotas.
- Modelos Mongoose para Usuário e Produto, com validações e métodos customizados.
- Middlewares de segurança, validação de dados (Zod) e tratamento de erros centralizado.

## 🔒 Fluxo de Autenticação
1. Login via `/api/auth/login` (retorna JWT)
2. Token enviado em cada requisição protegida
3. Middleware valida token e role (admin/usuário)

## 🚦 Endpoints Principais

| Método | Rota                      | Descrição                        | Permissão      |
|--------|---------------------------|----------------------------------|----------------|
| POST   | /api/auth/login           | Login                            | Público        |
| POST   | /api/auth/registro        | Cadastro de usuário              | Admin          |
| GET    | /api/auth/me              | Dados do usuário logado          | Autenticado    |
| POST   | /api/auth/alterar-senha   | Alterar senha                    | Autenticado    |
| GET    | /api/produtos             | Listar produtos                  | Autenticado    |
| POST   | /api/produtos             | Criar produto                    | Admin          |
| PUT    | /api/produtos/:id         | Atualizar produto                | Admin          |
| DELETE | /api/produtos/:id         | Remover produto                  | Admin          |
| GET    | /api/vendas               | Listar vendas                    | Autenticado    |
| POST   | /api/vendas               | Registrar venda                  | Autenticado    |
| DELETE | /api/vendas/:id           | Remover venda                    | Admin          |

### Exemplos de Payload

**Login**
```json
POST /api/auth/login
{
  "email": "admin@fruteira.com",
  "senha": "admin123"
}
```

**Cadastro de Produto**
```json
POST /api/produtos
{
  "nome": "Banana",
  "preco": 5.99,
  "tipo": "peso",
  "imagem": "🍌"
}
```

## 🛠️ Scripts Úteis
- `npm run dev` — Modo desenvolvimento
- `npm run build` — Compila TypeScript
- `npm start` — Produção
- `npm run criar-admin` — Cria admin inicial
- `npx ts-node src/scripts/seedProdutos.ts` — Popula produtos
- `npx ts-node src/scripts/seedVendas.ts` — Popula vendas

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

## 🧩 Middlewares
- **auth.ts**: Autenticação JWT, autorização por role.
- **rateLimit.ts**: Limita tentativas de login/registro.
- **errorHandler.ts**: Captura e responde erros não tratados.
- **validation/**: Validação de body/query com Zod.

## 🗃️ Modelos
- **Usuario**: nome, email, senha (hash), role, ativo, data de criação, último login.
- **Produto**: nome, preço, tipo (peso/fixo), imagem.



## ❓ FAQ e Troubleshooting
- Certifique-se de que o MongoDB está rodando.
- Verifique variáveis de ambiente.
- Consulte logs para detalhes de erros.

## 📝 Observações
- Requer MongoDB rodando localmente ou em nuvem.
- Configure as variáveis de ambiente conforme `env.example`.
- O frontend deve apontar para a URL deste backend.

## 👨‍💻 Contato
Desenvolvido por Bryan — 2024 