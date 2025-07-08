# 🔐 Sistema de Autenticação Implementado

## 📋 Visão Geral

Foi implementado um sistema de autenticação completo e robusto usando **JWT + Context API** para o Sistema Fruteira, seguindo as melhores práticas de segurança.

## 🏗️ Arquitetura

### Backend (Node.js + Express + MongoDB)
- **JWT** para tokens de autenticação
- **bcryptjs** para hash de senhas
- **Rate limiting** para proteção contra ataques
- **Helmet** para headers de segurança
- **CORS** configurado adequadamente

### Frontend (React + TypeScript)
- **Context API** para gerenciamento de estado
- **Protected Routes** para controle de acesso
- **Axios interceptors** para autenticação automática
- **LocalStorage** para persistência de tokens

## 🔧 Configuração Inicial

### 1. Backend - Variáveis de Ambiente

Crie um arquivo `.env` na pasta `back-end/` com o seguinte conteúdo:

```env
# Configurações do MongoDB
MONGODB_URI=mongodb://localhost:27017/fruteira-sistema

# Configurações do JWT
JWT_SECRET=sua_chave_secreta_muito_segura_aqui
JWT_EXPIRES_IN=24h

# Configurações do servidor
PORT=5000
NODE_ENV=development

# URL do frontend (para CORS)
FRONTEND_URL=http://localhost:5173
```

### 2. Criar Usuário Admin Inicial

Execute o comando para criar o primeiro usuário admin:

```bash
cd back-end
npm run criar-admin
```

**Credenciais padrão do admin:**
- Email: `admin@fruteira.com`
- Senha: `admin123`

⚠️ **IMPORTANTE**: Altere a senha após o primeiro login!

## 🚀 Como Executar

### Backend
```bash
cd back-end
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Funcionalidades de Segurança

### 1. Autenticação JWT
- Tokens com expiração configurável
- Verificação automática de validade
- Logout automático em token inválido

### 2. Hash de Senhas
- Senhas hasheadas com bcrypt (12 rounds)
- Salt único por usuário
- Comparação segura de senhas

### 3. Rate Limiting
- **Login**: 5 tentativas por 15 minutos
- **Registro**: 3 tentativas por hora
- **API geral**: 100 requests por 15 minutos

### 4. Headers de Segurança
- Helmet para proteção contra ataques comuns
- CORS configurado adequadamente
- Headers de segurança automáticos

### 5. Validação de Dados
- Validação de email único
- Validação de força de senha
- Sanitização de inputs

## 👥 Sistema de Roles

### Admin
- ✅ Acesso total ao sistema
- ✅ Gerenciar produtos (CRUD)
- ✅ Visualizar histórico de vendas
- ✅ Criar novos usuários
- ✅ Excluir vendas

### Usuário
- ✅ Realizar vendas
- ✅ Visualizar produtos
- ✅ Visualizar histórico de vendas
- ❌ Gerenciar produtos
- ❌ Criar usuários
- ❌ Excluir vendas

## 📁 Estrutura de Arquivos

### Backend
```
back-end/
├── src/
│   ├── models/
│   │   └── Usuario.ts          # Modelo de usuário
│   ├── middleware/
│   │   ├── auth.ts             # Middlewares de autenticação
│   │   └── rateLimit.ts        # Rate limiting
│   ├── routes/
│   │   └── auth.ts             # Rotas de autenticação
│   ├── scripts/
│   │   └── criarAdmin.ts       # Script para criar admin
│   └── server.ts               # Servidor principal
└── .env                        # Variáveis de ambiente
```

### Frontend
```
frontend/
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx     # Context de autenticação
│   ├── components/
│   │   ├── Login.tsx           # Componente de login
│   │   └── ProtectedRoute.tsx  # Proteção de rotas
│   ├── layout/
│   │   ├── Header.tsx          # Header com info do usuário
│   │   └── Sidebar.tsx         # Menu filtrado por role
│   ├── config/
│   │   └── api.ts              # Configuração do Axios
│   └── App.tsx                 # Rotas protegidas
```

## 🔄 Fluxo de Autenticação

### 1. Login
1. Usuário insere email e senha
2. Frontend envia credenciais para `/api/auth/login`
3. Backend valida credenciais e retorna JWT
4. Frontend armazena token no localStorage
5. Usuário é redirecionado para dashboard

### 2. Proteção de Rotas
1. Componente `ProtectedRoute` verifica autenticação
2. Se não autenticado → redireciona para `/login`
3. Se precisa de admin mas não é admin → mostra erro
4. Se autenticado → mostra conteúdo

### 3. Requisições Autenticadas
1. Axios interceptor adiciona token automaticamente
2. Se token expirado → logout automático
3. Se erro 401/403 → tratamento adequado

## 🛡️ Medidas de Segurança

### 1. Senhas
- Hash com bcrypt (12 rounds)
- Mínimo 6 caracteres
- Salt único por usuário

### 2. Tokens JWT
- Expiração configurável
- Secret seguro
- Verificação de validade

### 3. Rate Limiting
- Proteção contra força bruta
- Limites por endpoint
- Headers informativos

### 4. Validação
- Validação de email único
- Sanitização de inputs
- Validação de tipos

### 5. CORS
- Origin configurável
- Credentials habilitado
- Headers seguros

## 🔧 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/registro` - Criar usuário (admin)
- `GET /api/auth/me` - Dados do usuário logado
- `POST /api/auth/logout` - Logout
- `POST /api/auth/alterar-senha` - Alterar senha

### Produtos (Protegido)
- `GET /api/produtos` - Listar (usuário)
- `POST /api/produtos` - Criar (admin)
- `PUT /api/produtos/:id` - Atualizar (admin)
- `DELETE /api/produtos/:id` - Excluir (admin)

### Vendas (Protegido)
- `GET /api/vendas` - Listar (usuário)
- `POST /api/vendas` - Criar (usuário)
- `DELETE /api/vendas/:id` - Excluir (admin)

## 🚨 Tratamento de Erros

### Backend
- Erros de validação detalhados
- Mensagens de erro amigáveis
- Logs informativos
- Status codes apropriados

### Frontend
- Feedback visual de erros
- Loading states
- Redirecionamento automático
- Interceptors para tratamento global

## 📈 Próximos Passos Sugeridos

### 1. Melhorias de Segurança
- [ ] Implementar refresh tokens
- [ ] Adicionar blacklist de tokens
- [ ] Implementar 2FA
- [ ] Logs de auditoria

### 2. Funcionalidades
- [ ] Recuperação de senha
- [ ] Perfil do usuário
- [ ] Histórico de logins
- [ ] Notificações

### 3. Performance
- [ ] Cache de usuários
- [ ] Compressão de respostas
- [ ] Otimização de queries

## 🎯 Benefícios da Implementação

### ✅ Simples
- Fácil de entender e manter
- Documentação clara
- Código bem estruturado

### ✅ Funcional
- Proteção efetiva das rotas
- Autenticação robusta
- Controle de acesso granular

### ✅ Consistente
- Segue padrões do projeto
- Nomenclatura uniforme
- Estrutura organizada

### ✅ Escalável
- Fácil de expandir
- Arquitetura modular
- Preparado para crescimento

## 🔍 Troubleshooting

### Problema: Token inválido
**Solução**: Verificar se o JWT_SECRET está configurado corretamente

### Problema: CORS errors
**Solução**: Verificar se FRONTEND_URL está configurado no .env

### Problema: Rate limiting muito restritivo
**Solução**: Ajustar configurações em `rateLimit.ts`

### Problema: Senha não funciona
**Solução**: Verificar se o usuário foi criado corretamente com `npm run criar-admin`

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console
2. Confirme as configurações do .env
3. Teste os endpoints com Postman/Insomnia
4. Verifique se o MongoDB está rodando

**Sistema implementado com sucesso! 🎉** 