# 📋 Painel de Atendimento — Full-Stack CRM & Automação de Chatbot

Solução full-stack robusta e escalável para centralização de atendimentos ao cliente, gerenciamento de atendentes humanos e triagem automatizada de leads encaminhados por chatbots externos (n8n, Typebot, WhatsApp, Telegram, Blip, Evolution API).

Construído com arquitetura moderna: **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, **Prisma ORM** e **MySQL / MariaDB**.

---

## 📑 Sumário

- [Visão Geral e Objetivos](#-visão-geral-e-objetivos)
- [✨ Novidades e Atualizações Recentes](#-novidades-e-atualizações-recentes)
- [Funcionalidades do Sistema](#-funcionalidades-do-sistema)
  - [Painel Frontend (React + Vite)](#painel-frontend-react--vite)
  - [API Backend (Express + Prisma)](#api-backend-express--prisma)
- [Arquitetura Full-Stack](#-arquitetura-full-stack)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Guia de Instalação e Execução](#-guia-de-instalação-e-execução)
  - [1. Backend & Banco de Dados](#1-backend--banco-de-dados)
  - [2. Frontend (Painel Web)](#2-frontend-painel-web)
- [Guia de Integração com Chatbots & n8n (Docker)](#-guia-de-integração-com-chatbots--n8n-docker)
- [Documentação Completa da API](#-documentação-completa-da-api)
  - [Autenticação (`/auth`)](#autenticação-auth)
  - [Usuários (`/users`)](#usuários-users)
  - [Clientes (`/clients`)](#clientes-clients)
  - [Automação de Chatbots (`/automation`)](#automação-de-chatbots-automation)
- [Modelo de Dados (Database Schema)](#-modelo-de-dados-database-schema)
- [Segurança & Isolamento de Dados](#-segurança--isolamento-de-dados)
- [Roadmap do Projeto](#-roadmap-do-projeto)
- [Como Contribuir](#-como-contribuir)
- [Licença](#-licença)

---

## 📌 Visão Geral e Objetivos

O **Painel de Atendimento** foi desenvolvido para solucionar a fragmentação entre o primeiro atendimento automatizado (bots de IA e fluxos de mensagens) e o atendimento humanizado das empresas:

1. **Centralização de Fila de Chamados:** Receber os leads transbordados de chatbots em tempo real na carteira do atendente responsável.
2. **Experiência Visual e Produtiva:** Painel limpo, rápido e intuitivo para o atendente alternar status de atendimento (`Pendente` / `Atendido`), buscar contatos e registrar novos clientes.
3. **Visão Gerencial (Administrador):** Acompanhamento global de todos os clientes, distribuição de chamados por atendente e supervisão de equipe.
4. **Integração Desacoplada e Segura:** Chatbots externos integram-se através de chaves de API (`x-api-key`) com hash SHA-256 no banco, sem expor senhas ou tokens sensíveis.

---

## ✨ Novidades e Atualizações Recentes

O projeto evoluiu de uma API isolada para uma **plataforma full-stack completa**:

- 🎨 **Interface Frontend Completa:** Aplicação SPA desenvolvida em **React 18**, **Tailwind CSS** e ícones **Lucide**, com layout responsivo e transições fluidas.
- 📊 **Dashboard com Métricas em Tempo Real:** Visualização instantânea do Total de Clientes, Atendimentos Concluídos, Chamados Pendentes e Taxa de Resolução.
- 👥 **Módulo de Cadastro de Atendentes:** Tela de login aprimorada com formulário de registro de novos usuários (`/auth/register`) e autenticação automática pós-cadastro.
- 🔑 **Gestão e Isolamento de Chaves de API:**
  - Geração de API Keys com cópia em 1 clique e controle de visibilidade (máscara `•••••••`).
  - **Isolamento total por conta de usuário**: cada atendente/administrador gerencia exclusivamente as suas chaves salvas localmente.
- 🧪 **Testador Interativo de Webhooks:** Ferramenta no próprio painel para simular o disparo de leads do bot diretamente contra a API (`POST /automation/client`).
- 📱 **Sanitização Inteligente de Telefones:** Backend e frontend agora formatam e limpam automaticamente espaços, parênteses e caracteres especiais (`+55 43 99909-0228` ➔ `+5543999090228`).
- 🐳 **Compatibilidade com Docker & n8n:** Configuração e suporte para chamadas vindas de containers Docker (`host.docker.internal`).

---

## 🚀 Funcionalidades do Sistema

### Painel Frontend (React + Vite)
- **Tela de Login / Cadastro:** Alternância rápida entre Login e Criação de Conta, além de botões para teste rápido com perfis de demonstração (Atendente / Administrador).
- **Dashboard:** Cards de estatísticas vitais e visão geral do desempenho do atendimento.
- **Lista de Clientes:**
  - Busca instantânea por nome e número de telefone.
  - Filtros rápidos: `Todos`, `Pendentes` e `Atendidos`.
  - Alternador direto de status com feedback visual.
  - Exclusão com confirmação de segurança.
- **Cadastro Manual:** Inclusão rápida de novos clientes com validação de campos.
- **Central de Automação & API Keys:**
  - Gerador de novas chaves criptográficas.
  - Exemplos de integração com snippets cURL prontos para copiar.
  - Simulador de webhook para testes rápidos.

### API Backend (Express + Prisma)
- **Autenticação JWT:** Emissão e validação de tokens com expiração configurada.
- **Controle de Acesso Baseado em Perfis (RBAC):** Níveis de permissão estritos para `ADMIN` e `ATENDENTE`.
- **Validação com Schemas Zod & Validator:** Garantia de tipos, tamanhos mínimos e números de telefone válidos.
- **Proteção contra Abuso (Rate Limiting):** Limitador de requisições global para prevenir ataques DoS e força bruta.
- **Hashing Criptográfico Duplo:** Senhas com `bcrypt` (10 rounds) e API Keys com hash `SHA-256`.

---

## 🏗️ Arquitetura Full-Stack

```text
 ┌─────────────────────────────────────────────────────────────────────────┐
 │                       Frontend (React 18 + Vite)                        │
 │  - Dashboard (Stats)         - Gestão de Clientes      - Login/Cadastro │
 │  - Gestor de API Keys        - Testador de Webhook     - RBAC State     │
 └────────────────────────────────────┬────────────────────────────────────┘
                                      │  HTTP / REST (JSON)
                                      ▼
 ┌─────────────────────────────────────────────────────────────────────────┐
 │                        API Backend (Node + Express)                     │
 │  ├── Rate Limiter Global                                                │
 │  ├── Middlewares: Auth (JWT), API Key (SHA-256), RBAC, Zod Validate    │
 │  ├── Controllers & Services: Auth, Clients, Users, Automation           │
 └────────────────────────────────────┬────────────────────────────────────┘
                                      │  Prisma ORM
                                      ▼
 ┌─────────────────────────────────────────────────────────────────────────┐
 │                   Banco de Dados (MySQL / MariaDB)                      │
 │  - users (id, name, email, role, hashPassword)                          │
 │  - clients (id, phone, name, attendantId, answered)                     │
 │  - api_keys (id, name, keyHash, userId, active)                         │
 └─────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** com **TypeScript**
- **Vite** (Build tool e servidor de alta performance)
- **Tailwind CSS v4** (Estilização responsiva e utilitária)
- **Lucide React** (Pacote de ícones)
- **Context API** (Gerenciamento de estado de autenticação e sessão)

### Backend
- **Node.js 20+** & **TypeScript**
- **Express v5** (Framework HTTP minimalista)
- **Prisma ORM v7** (Modelagem de dados e queries tipadas)
- **MariaDB / MySQL** (Banco de dados relacional)
- **bcrypt** & **jsonwebtoken** (Criptografia e autenticação)
- **Zod** & **validator.js** (Sanitização e validação de contratos)
- **express-rate-limit** & **helmet** (Segurança HTTP e proteção contra abuso)

---

## 📁 Estrutura do Projeto

```text
├── backend/
│   ├── prisma/
│   │   └── schema.prisma              # Definição dos modelos e relacionamentos do banco
│   ├── src/
│   │   ├── configs/                   # Configuração de rate limiter e ambientes
│   │   ├── controllers/               # Handlers de entrada e resposta HTTP
│   │   ├── middlewares/               # Middlewares (JWT, API Key, RBAC, Zod)
│   │   ├── routes/                    # Definição dos endpoints REST
│   │   ├── schemas/                   # Schemas Zod de validação de payload
│   │   ├── services/                  # Regras de negócio e operações de banco
│   │   ├── app.ts                     # Instância principal do Express
│   │   └── server.ts                  # Boot do servidor HTTP
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/                # Componentes reutilizáveis (Header, Sidebar, Cards, Tabelas)
│   │   ├── config/                    # Constantes e variáveis de ambiente do client
│   │   ├── context/                   # Contexto de autenticação (AuthContext)
│   │   ├── pages/                     # Páginas (Dashboard, Clientes, Novo Cliente, API Keys, Login)
│   │   ├── services/                  # Camada de comunicação com a API (HTTP Client, Auth, Clients, ApiKey)
│   │   ├── types/                     # Tipos TypeScript compartilhados
│   │   ├── App.tsx                    # Componente raiz da aplicação
│   │   └── main.tsx                   # Ponto de entrada do React
│   └── index.html
│
├── .env.example                       # Modelo de configuração de variáveis de ambiente
├── package.json                       # Scripts globais de build e dependências
└── vite.config.ts                     # Configuração do Vite e proxy reverso
```

---

## 💻 Guia de Instalação e Execução

### Pré-requisitos
- **Node.js:** Versão 18 ou superior.
- **MySQL / MariaDB:** Servidor em execução na porta 3306.

---

### 1. Backend & Banco de Dados

1. Acesse o diretório `backend/` e instale as dependências:
   ```bash
   cd backend
   npm install
   ```

2. Crie o arquivo `.env` baseado no `.env.example`:
   ```env
   PORT=3000
   DB_HOST="localhost"
   DB_PORT=3306
   DB_USER="seu_usuario"
   DB_PASSWORD="sua_senha"
   DB_NAME="painel_atendimento"
   DATABASE_URL="mysql://seu_usuario:sua_senha@localhost:3306/painel_atendimento"
   JWT_SECRET="segredo_super_seguro_jwt"
   ```

3. Execute as migrações do Prisma:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. Inicie o backend:
   ```bash
   npm run dev
   ```

---

### 2. Frontend (Painel Web)

1. No diretório raiz ou `frontend/`, instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse a aplicação no navegador em `http://localhost:3000`.

---

## 🤖 Guia de Integração com Chatbots & n8n (Docker)

Quando o **n8n roda em um container Docker** e o servidor backend roda localmente na sua máquina (VS Code):

### Configuração no nó HTTP Request do n8n:
- **Method:** `POST`
- **URL:** `http://host.docker.internal:3000/automation/client` *(Windows/macOS)* ou `http://172.17.0.1:3000/automation/client` *(Linux)*
- **Authentication:** `None`
- **Headers:**
  ```json
  {
    "Content-Type": "application/json",
    "x-api-key": "SUA_API_KEY_GERADA_NO_PAINEL"
  }
  ```
- **Body (JSON):**
  ```json
  {
    "name": "{{ $json.name }}",
    "phone": "{{ $json.phone }}"
  }
  ```

---

## 📖 Documentação Completa da API

Todas as rotas aceitam e retornam `Content-Type: application/json`.

### Autenticação (`/auth`)

| Método | Endpoint | Autenticação | Descrição |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Nenhuma | Cria uma nova conta de atendente no sistema. |
| `POST` | `/auth/login` | Nenhuma | Autentica usuário e retorna JWT + dados do perfil. |
| `GET` | `/auth/test` | Bearer JWT | Valida se o token de sessão atual é válido. |

---

### Usuários (`/users`)

| Método | Endpoint | Permissão | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/users` | `ADMIN` (JWT) | Lista todos os usuários (atendentes e administradores). |

---

### Clientes (`/clients`)

| Método | Endpoint | Permissão | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/clients` | `ADMIN` ou `ATENDENTE` | Lista clientes (Admin vê todos; Atendente vê apenas os seus). |
| `POST` | `/clients` | `ATENDENTE` | Cadastra manualmente um novo cliente na carteira do atendente. |
| `PATCH` | `/clients/answered` | `ADMIN` ou `ATENDENTE` | Atualiza o status de atendimento (`answered: true/false`). |
| `DELETE` | `/clients` | `ADMIN` ou `ATENDENTE` | Remove um cliente vinculado à carteira. |

---

### Automação de Chatbots (`/automation`)

| Método | Endpoint | Autenticação | Descrição |
| :--- | :--- | :--- | :--- |
| `POST` | `/automation/api-key` | Bearer JWT | Gera uma nova API Key vinculada ao usuário logado. |
| `POST` | `/automation/client` | Header `x-api-key` | Insere lead/cliente vindo de robô direto na fila do atendente. |
| `PATCH` | `/automation/client/answered` | Header `x-api-key` | Atualiza status de atendimento via automação externa. |

---

## 🗄️ Modelo de Dados (Database Schema)

```prisma
enum Role {
  ATENDENTE
  ADMIN
}

model User {
  id           Int      @id @default(autoincrement())
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  email        String   @unique
  name         String
  role         Role
  active       Boolean  @default(true)
  hashPassword String
  apiKeys      ApiKey[]
  clients      Client[]

  @@map("users")
}

model Client {
  id          Int      @id @default(autoincrement())
  phone       String
  name        String
  attendantId Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  answered    Boolean  @default(false)
  attendant   User     @relation(fields: [attendantId], references: [id])

  @@unique([attendantId, phone])
  @@index([attendantId])
  @@map("clients")
}

model ApiKey {
  id        Int      @id @default(autoincrement())
  name      String
  keyHash   String   @unique
  userId    Int
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])

  @@index([userId])
  @@map("api_keys")
}
```

---

## 🛡️ Segurança & Isolamento de Dados

1. **Isolamento de Carteiras:** O atendente só acessa clientes vinculados ao seu próprio `attendantId`, extraído do token JWT assinado.
2. **Isolamento de Chaves de API no Navegador:** As chaves armazenadas no client são segmentadas por `userId`, impedindo vazamento entre contas no mesmo dispositivo.
3. **Proteção Criptográfica:**
   - Senhas criptografadas com `bcrypt` (10 salt rounds).
   - API Keys armazenadas exclusivamente como hash `SHA-256` (`keyHash`).
4. **Sanitização de Respostas:** Campos sensíveis como `hashPassword` e `keyHash` nunca são expostos em respostas de endpoints.
5. **Rate Limiting:** Bloqueio temporário automático após excesso de requisições maliciosas.

---

## 🗺️ Roadmap do Projeto

- [x] API REST com autenticação JWT e RBAC (`ADMIN` / `ATENDENTE`)
- [x] Módulo de Automação de Chatbot com chaves de API (`x-api-key`)
- [x] Painel SPA em React 18 com Tailwind CSS e Lucide Icons
- [x] Dashboard com métricas de atendimento em tempo real
- [x] Gestão de clientes com busca, filtros rápidos e alteração de status
- [x] Tela de Login & Cadastro de novos atendentes com auto-login
- [x] Isolamento de chaves de API por conta de usuário no frontend
- [x] Sanitização automática de telefones e payloads
- [ ] Notificações sonoras/visuais ao receber novo lead do chatbot
- [ ] Atualização em tempo real via WebSockets (Socket.io)
- [ ] Exportação de relatórios em CSV/Excel

---

## 🤝 Como Contribuir

1. Faça um **Fork** do repositório.
2. Crie uma branch para a sua feature (`git checkout -b feature/minha-feature`).
3. Faça o commit das suas alterações (`git commit -m 'feat: adiciona nova funcionalidade'`).
4. Envie para o repositório remoto (`git push origin feature/minha-feature`).
5. Abra um **Pull Request**.

---

## 📄 Licença

Este projeto é distribuído sob a licença **ISC**. Consulte o arquivo de licença para mais informações.
