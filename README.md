# 📋 Painel de Atendimento — API Backend

Backend robusto e escalável para gerenciamento de atendentes, clientes e triagem de atendimentos humanos encaminhados por chatbots. Desenvolvido com **Node.js**, **TypeScript**, **Express**, **Prisma ORM** e **MySQL / MariaDB**.

---

## 📑 Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Tecnologias e Dependências](#-tecnologias-e-dependências)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Requisitos do Sistema](#-requisitos-do-sistema)
- [Instalação e Configuração](#-instalação-e-configuração)
  - [1. Clonar o Repositório](#1-clonar-o-repositório)
  - [2. Instalar Dependências](#2-instalar-dependências)
  - [3. Configurar Variáveis de Ambiente](#3-configurar-variáveis-de-ambiente)
  - [4. Executar Migrações do Banco de Dados](#4-executar-migrações-do-banco-de-dados)
  - [5. Iniciar o Servidor](#5-iniciar-o-servidor)
- [Documentação da API (Endpoints)](#-documentação-da-api-endpoints)
  - [Rotas de Sistema](#rotas-de-sistema)
  - [Rotas de Autenticação (`/auth`)](#rotas-de-autenticação-auth)
  - [Rotas de Usuários (`/users`)](#rotas-de-usuários-users)
  - [Rotas de Clientes (`/clients`)](#rotas-de-clientes-clients)
  - [Rotas de Automação e Chatbot (`/automation`)](#rotas-de-automação-e-chatbot-automation)
- [Códigos de Status HTTP](#-códigos-de-status-http)
- [Modelo de Dados (Database Schema)](#-modelo-de-dados-database-schema)
- [Políticas de Segurança](#-políticas-de-segurança)
- [Roadmap de Desenvolvimento](#-roadmap-de-desenvolvimento)
- [Como Contribuir](#-como-contribuir)
- [Licença](#-licença)

---

## 📌 Visão Geral

O **Painel de Atendimento** é uma solução de backend criada para centralizar e organizar o fluxo de atendimento ao cliente de empresas que utilizam chatbots para primeiro contato e necessitam de transferência ágil para atendentes humanos.

### Casos de Uso:
1. **Para Atendentes:** Visualização e gerenciamento exclusivo dos clientes sob sua responsabilidade, controle do status de atendimento (`answered`) e histórico de contatos.
2. **Para Administradores:** Visão panorâmica de todos os clientes da base, supervisão de atendentes, auditoria de usuários cadastrados e gerenciamento de permissões.
3. **Para Sistemas de Chatbot / Automação:** Registro automático de novos leads/clientes e atualização de status diretamente via API Key segura (`x-api-key`), sem necessidade de expor credenciais de usuário.

---

## ✨ Funcionalidades Principais

- 🔐 **Autenticação & Sessão:** Cadastro de usuários e login com geração de JSON Web Token (JWT) com validade configurada.
- 🛡️ **Controle de Acesso Baseado em Perfis (RBAC):** Restrição granular de rotas por perfis (`ADMIN` e `ATENDENTE`).
- 🤖 **Integração para Chatbots (API Keys):** Sistema de geração de chaves de API com armazenamento seguro via hash SHA-256 para automações externas.
- 👥 **Gestão de Clientes:** Cadastro, listagem segmentada por atendente, alteração de status de chamado e exclusão de registros.
- 🧪 **Validação Rigorosa de Dados:** Validação de formato de telefone internacional, e-mails e tamanhos de campos utilizando schemas Zod e Validator.js.
- ⏱️ **Proteção contra Abusos:** Rate limiting global ativo para prevenir ataques de força bruta e DoS.
- 🗄️ **Acesso a Dados Otimizado:** Prisma ORM com driver nativo MariaDB/MySQL e consultas projetadas (`select`) para evitar vazamento de dados sensíveis (ex.: `hashPassword`).

---

## 🏗️ Arquitetura do Sistema

O projeto adota uma arquitetura em camadas bem delimitadas, garantindo baixo acoplamento e facilidade de manutenção e testes:

```text
                        ┌───────────────────────────────┐
                        │       Requisição HTTP         │
                        └──────────────┬────────────────┘
                                       │
                                       ▼
                        ┌───────────────────────────────┐
                        │      Global Rate Limiter      │
                        └──────────────┬────────────────┘
                                       │
                                       ▼
                        ┌───────────────────────────────┐
                        │       Rotas do Express        │
                        └──────────────┬────────────────┘
                                       │
       ┌───────────────────────────────┼───────────────────────────────┐
       ▼                               ▼                               ▼
┌──────────────┐              ┌─────────────────┐             ┌─────────────────┐
│  Validation  │              │ Authentication  │             │  Authorization  │
│  Middleware  │              │ (JWT / API Key) │             │ (RBAC: Role)    │
└──────┬───────┘              └────────┬────────┘             └────────┬────────┘
       └───────────────────────────────┼───────────────────────────────┘
                                       │
                                       ▼
                        ┌───────────────────────────────┐
                        │         Controllers           │
                        │ (Entrada HTTP & Resposta)     │
                        └──────────────┬────────────────┘
                                       │
                                       ▼
                        ┌───────────────────────────────┐
                        │          Services             │
                        │ (Regras de Negócio & Lógica)  │
                        └──────────────┬────────────────┘
                                       │
                                       ▼
                        ┌───────────────────────────────┐
                        │       Prisma ORM Client       │
                        └──────────────┬────────────────┘
                                       │
                                       ▼
                        ┌───────────────────────────────┐
                        │     Banco MySQL / MariaDB     │
                        └───────────────────────────────┘
```

### Divisão de Responsabilidades

| Camada | Diretório | Responsabilidade |
| :--- | :--- | :--- |
| **Configs** | `src/configs/` | Configurações globais de middlewares e limites de taxa (`rateLimit`). |
| **Routes** | `src/routes/` | Mapeamento dos endpoints, associação de métodos HTTP e encadeamento de middlewares. |
| **Middlewares** | `src/middlewares/` | Interceptação de requisições, validação de payload com Zod, autenticação JWT/API Key e checagem de roles. |
| **Schemas** | `src/schemas/` | Definição dos contratos de validação e sanitização com Zod e Validator. |
| **Controllers** | `src/controllers/` | Tratamento de requisições, extração de parâmetros e montagem de respostas HTTP padronizadas. |
| **Services** | `src/services/` | Concentração das regras de negócio, hashing criptográfico e orquestração do Prisma. |
| **Lib / DB** | `src/lib/` | Instanciação e conexão singleton do Prisma Client e utilitários JWT. |

---

## 🛠️ Tecnologias e Dependências

### Core & Runtime
- **[Node.js](https://nodejs.org/):** Ambiente de execução JavaScript server-side.
- **[TypeScript](https://www.typescriptlang.org/):** Tipagem estática para maior previsibilidade e segurança de código.
- **[Express v5](https://expressjs.com/):** Framework web minimalista para construção da API REST.
- **[TSX](https://github.com/privatenumber/tsx):** Executor de TypeScript em tempo de desenvolvimento.

### Banco de Dados & ORM
- **[Prisma ORM v7](https://www.prisma.io/):** ORM declarativo para modelagem e migrações tipadas.
- **[@prisma/adapter-mariadb](https://www.npmjs.com/package/@prisma/adapter-mariadb) & [mariadb](https://github.com/mariadb-corporation/mariadb-connector-nodejs):** Driver otimizado para conexões com MariaDB e MySQL.

### Segurança & Validação
- **[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken):** Emissão e verificação de tokens de acesso JWT.
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js):** Criptografia de senhas com algoritmo de hashing adaptativo.
- **[Zod v4](https://zod.dev/):** Declaração e inferência de schemas de validação com TypeScript.
- **[validator](https://github.com/validatorjs/validator.js):** Validações complementares de strings (ex.: números de telefone).
- **[express-rate-limit](https://github.com/express-rate-limit/express-rate-limit):** Limitação de taxa para proteção contra DoS e abuso de requisições.
- **[helmet](https://helmetjs.github.io/):** Proteção de cabeçalhos HTTP contra vulnerabilidades comuns.
- **[cors](https://github.com/expressjs/cors):** Habilitação de Cross-Origin Resource Sharing.

---

## 📁 Estrutura de Pastas

```text
backend/
├── prisma/
│   └── schema.prisma              # Definição dos modelos e relacionamentos do banco
├── prisma.config.ts               # Configuração do Prisma CLI e migrações
├── src/
│   ├── configs/
│   │   └── rateLimit.config.ts    # Configuração de limitação de taxa de requisições
│   ├── controllers/
│   │   ├── apiKey.controller.ts   # Handler para geração de API Keys
│   │   ├── auth.controller.ts     # Handlers de cadastro e login de usuários
│   │   ├── clients.controller.ts  # Handlers de gerenciamento de clientes
│   │   └── user.controller.ts     # Handlers para listagem e consulta de usuários
│   ├── generated/                 # Artefatos tipados gerados pelo Prisma Client
│   ├── lib/
│   │   ├── jwt.ts                 # Utilitários de assinatura e validação JWT
│   │   └── prisma.ts              # Conexão singleton com o banco de dados
│   ├── middlewares/
│   │   ├── apiKey.middleware.ts   # Autenticação via header x-api-key para bots
│   │   ├── auth.middleware.ts     # Autenticação via Bearer Token JWT
│   │   ├── authorize.middleware.ts# Autorização baseada em Roles (RBAC)
│   │   └── validate.middleware.ts # Validador genérico de payloads Zod
│   ├── routes/
│   │   ├── apiKey.routes.ts       # Rotas de automação (/automation)
│   │   ├── auth.routes.ts         # Rotas de autenticação (/auth)
│   │   ├── clients.routes.ts      # Rotas de clientes (/clients)
│   │   └── users.routes.ts        # Rotas administrativas de usuários (/users)
│   ├── schemas/
│   │   ├── apiKey.schema.ts       # Schema Zod para geração de API Key
│   │   ├── auth.schema.ts         # Schemas Zod para login e registro
│   │   └── clients.schema.ts      # Schemas Zod para clientes e status
│   ├── services/
│   │   ├── apiKey.service.ts      # Regra de criação e hash SHA-256 de API Keys
│   │   ├── auth.service.ts        # Regras de negócio de autenticação e hashing bcrypt
│   │   ├── clients.service.ts     # Consultas e mutações da base de clientes
│   │   └── user.service.ts        # Consultas da base de usuários
│   ├── types/
│   │   └── express.d.ts           # Extensão de tipos do Express (req.user)
│   ├── app.ts                     # Instância e configuração principal do Express
│   ├── server.ts                  # Ponto de entrada (boot do servidor HTTP)
│   └── test-db.ts                 # Script utilitário para testar conectividade
├── .env.example                   # Modelo de variáveis de ambiente
├── package.json                   # Dependências e scripts do projeto
└── tsconfig.json                  # Configurações do compilador TypeScript
```

---

## 💻 Requisitos do Sistema

Antes de iniciar, certifique-se de ter instalado em seu ambiente:

- **Node.js:** Versão `18.x` ou superior (recomendado `20.x` LTS).
- **Gerenciador de Pacotes:** `npm` (versão 9+) ou `yarn` / `pnpm`.
- **Banco de Dados:** Servidor **MySQL 8.0+** ou **MariaDB 10.5+** em execução.

---

## 🚀 Instalação e Configuração

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/painel-atendimento.git
cd painel-atendimento/backend
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do diretório `backend/` baseado no modelo abaixo:

```env
# Configurações do Servidor
PORT=3000

# Conexão com o Banco de Dados (MySQL / MariaDB)
DB_HOST="localhost"
DB_PORT=3306
DB_USER="seu_usuario"
DB_PASSWORD="sua_senha"
DB_NAME="painel_atendimento"

# URL de Conexão utilizada pelas migrações do Prisma
DATABASE_URL="mysql://seu_usuario:sua_senha@localhost:3306/painel_atendimento"

# Segredo para assinatura de Tokens JWT
JWT_SECRET="seu_segredo_super_seguro_e_longo_aqui"
```

### 4. Executar Migrações do Banco de Dados

Gere o cliente do Prisma e aplique as tabelas no seu banco de dados:

```bash
# Gerar os tipos do Prisma Client
npx prisma generate

# Executar as migrações no banco de dados configurado
npx prisma migrate dev --name init
```

### 5. Iniciar o Servidor

```bash
# Modo de desenvolvimento (com hot-reload via tsx)
npm run dev
```

O servidor estará disponível e escutando requisições em: `http://localhost:3000`.

---

## 📖 Documentação da API (Endpoints)

Todas as requisições que enviam corpo devem utilizar o cabeçalho `Content-Type: application/json`.

---

### Rotas de Sistema

#### Verificar Status da API
Retorna uma mensagem confirmando que a API está ativa.

- **Método:** `GET`
- **Endpoint:** `/`
- **Autenticação:** Nenhuma
- **Resposta de Sucesso (200 OK):**
```json
{
  "message": "API do painel de atendimento funcionando"
}
```

---

### Rotas de Autenticação (`/auth`)

#### 1. Cadastrar Usuário
Cria um novo usuário atendente no sistema com senha protegida por bcrypt.

- **Método:** `POST`
- **Endpoint:** `/auth/register`
- **Autenticação:** Nenhuma
- **Corpo da Requisição:**
```json
{
  "name": "Maria Silva",
  "email": "maria@empresa.com",
  "password": "senhaSegura123"
}
```
- **Resposta de Sucesso (201 Created):**
```json
{
  "message": "Usuário cadastrado com sucesso",
  "user": {
    "id": 1,
    "name": "Maria Silva",
    "email": "maria@empresa.com",
    "role": "ATENDENTE",
    "active": true
  }
}
```
- **Respostas de Erro:**
  - `400 Bad Request`: Dados inválidos (ex.: nome < 3 caracteres, e-mail mal formatado, senha < 6 caracteres).
  - `409 Conflict`: E-mail já cadastrado.

---

#### 2. Autenticar Usuário (Login)
Valida credenciais e gera o token de acesso JWT.

- **Método:** `POST`
- **Endpoint:** `/auth/login`
- **Autenticação:** Nenhuma
- **Corpo da Requisição:**
```json
{
  "email": "maria@empresa.com",
  "password": "senhaSegura123"
}
```
- **Resposta de Sucesso (200 OK):**
```json
{
  "message": "Usuário logado com sucesso",
  "user": {
    "id": 1,
    "name": "Maria Silva",
    "email": "maria@empresa.com",
    "role": "ATENDENTE",
    "active": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Respostas de Erro:**
  - `401 Unauthorized`: E-mail/senha incorretos ou usuário inativo (`active: false`).

---

#### 3. Testar Autenticação
Rota utilitária para verificar a validade do Bearer Token.

- **Método:** `GET`
- **Endpoint:** `/auth/test`
- **Headers:** `Authorization: Bearer <SEU_JWT_TOKEN>`
- **Resposta de Sucesso (200 OK):**
```json
{
  "message": "Você está autenticado!",
  "user": {
    "userId": 1,
    "role": "ATENDENTE"
  }
}
```

---

### Rotas de Usuários (`/users`)

#### Listar Todos os Usuários
Retorna a listagem de todos os atendentes e administradores do sistema.

- **Método:** `GET`
- **Endpoint:** `/users`
- **Autenticação:** JWT obrigatório
- **Permissão (Role):** Apenas `ADMIN`
- **Headers:** `Authorization: Bearer <TOKEN_ADMIN>`
- **Resposta de Sucesso (200 OK):**
```json
{
  "users": [
    {
      "id": 1,
      "name": "Administrador",
      "email": "admin@empresa.com",
      "role": "ADMIN",
      "createdAt": "2026-08-01T10:00:00.000Z",
      "updatedAt": "2026-08-01T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Maria Silva",
      "email": "maria@empresa.com",
      "role": "ATENDENTE",
      "createdAt": "2026-08-10T14:30:00.000Z",
      "updatedAt": "2026-08-10T14:30:00.000Z"
    }
  ]
}
```
- **Respostas de Erro:**
  - `401 Unauthorized`: Token ausente ou inválido.
  - `403 Forbidden`: Usuário não possui perfil `ADMIN`.

---

### Rotas de Clientes (`/clients`)

#### 1. Listar Clientes
Lista clientes com filtro automático baseado no perfil do usuário autenticado:
- Se **ADMIN**: Lista todos os clientes e os dados do atendente responsável.
- Se **ATENDENTE**: Lista apenas os clientes vinculados ao seu próprio `userId`.

- **Método:** `GET`
- **Endpoint:** `/clients`
- **Autenticação:** JWT (`ADMIN` ou `ATENDENTE`)
- **Headers:** `Authorization: Bearer <SEU_JWT_TOKEN>`
- **Resposta de Sucesso para ATENDENTE (200 OK):**
```json
{
  "clients": [
    {
      "name": "João Souza",
      "phone": "+5511999999999",
      "answered": false
    }
  ]
}
```
- **Resposta de Sucesso para ADMIN (200 OK):**
```json
{
  "clients": [
    {
      "id": 1,
      "phone": "+5511999999999",
      "name": "João Souza",
      "attendant": {
        "id": 2,
        "name": "Maria Silva",
        "email": "maria@empresa.com",
        "role": "ATENDENTE",
        "active": true
      }
    }
  ]
}
```

---

#### 2. Cadastrar Cliente Manualmente
Permite ao atendente registrar um novo cliente diretamente na sua carteira.

- **Método:** `POST`
- **Endpoint:** `/clients`
- **Autenticação:** JWT (`ATENDENTE`)
- **Headers:** `Authorization: Bearer <SEU_JWT_TOKEN>`
- **Corpo da Requisição:**
```json
{
  "name": "Carlos Pereira",
  "phone": "+5511988887777"
}
```
- **Resposta de Sucesso (201 Created):**
```json
{
  "message": "Client criated",
  "newClient": {
    "name": "Carlos Pereira",
    "phone": "+5511988887777",
    "attendantId": 2
  }
}
```

---

#### 3. Atualizar Status de Atendimento (`answered`)
Atualiza o indicador de chamado respondido/atendido.

- **Método:** `PATCH`
- **Endpoint:** `/clients/answered`
- **Autenticação:** JWT (`ADMIN` ou `ATENDENTE`)
- **Headers:** `Authorization: Bearer <SEU_JWT_TOKEN>`
- **Corpo da Requisição:**
```json
{
  "phone": "+5511988887777",
  "answered": true
}
```
- **Resposta de Sucesso (200 OK):**
```json
{
  "message": "Status atualizado com sucesso",
  "client": {
    "id": 1,
    "name": "Carlos Pereira",
    "phone": "+5511988887777",
    "answered": true
  }
}
```

---

#### 4. Excluir Cliente
Remove um cliente vinculado ao atendente.

- **Método:** `DELETE`
- **Endpoint:** `/clients`
- **Autenticação:** JWT (`ADMIN` ou `ATENDENTE`)
- **Headers:** `Authorization: Bearer <SEU_JWT_TOKEN>`
- **Corpo da Requisição:**
```json
{
  "phone": "+5511988887777"
}
```
- **Resposta de Sucesso (201 Created):**
```json
{
  "message": "Client deleted",
  "deletedClient": {
    "id": 1,
    "name": "Carlos Pereira",
    "phone": "+5511988887777"
  }
}
```

---

### Rotas de Automação e Chatbot (`/automation`)

Endpoints projetados para integração segura de chatbots (ex.: WhatsApp Bot, Typebot, n8n, Evolution API, Blip).

#### 1. Gerar Nova API Key
Gera um token criptográfico único para integração. A chave bruta em texto claro é retornada **apenas uma vez** no momento da criação; no banco, armazena-se apenas o hash SHA-256.

- **Método:** `POST`
- **Endpoint:** `/automation/api-key`
- **Autenticação:** JWT (`ADMIN` ou `ATENDENTE`)
- **Headers:** `Authorization: Bearer <SEU_JWT_TOKEN>`
- **Corpo da Requisição:**
```json
{
  "name": "Bot Atendimento WhatsApp"
}
```
- **Resposta de Sucesso (201 Created):**
```json
{
  "message": "API Key gerada com sucesso",
  "apiKey": "a4f89b1c78e93214589dbe0923485712ef0481239ab78c1234ef67890123abcd"
}
```

---

#### 2. Registrar Cliente via Chatbot
Insere um cliente que solicitou transbordo humano diretamente na fila do atendente dono da API Key.

- **Método:** `POST`
- **Endpoint:** `/automation/client`
- **Autenticação:** Header `x-api-key`
- **Headers:** `x-api-key: <SUA_API_KEY_GERADA>`
- **Corpo da Requisição:**
```json
{
  "name": "Lead Vindo do Chatbot",
  "phone": "+5511977776666"
}
```
- **Resposta de Sucesso (201 Created):**
```json
{
  "message": "Client criated",
  "newClient": {
    "name": "Lead Vindo do Chatbot",
    "phone": "+5511977776666",
    "attendantId": 2
  }
}
```

---

#### 3. Atualizar Status do Cliente via Chatbot
Permite que o bot marque um atendimento como finalizado ou em andamento.

- **Método:** `PATCH`
- **Endpoint:** `/automation/client/answered`
- **Autenticação:** Header `x-api-key`
- **Headers:** `x-api-key: <SUA_API_KEY_GERADA>`
- **Corpo da Requisição:**
```json
{
  "phone": "+5511977776666",
  "answered": true
}
```
- **Resposta de Sucesso (200 OK):**
```json
{
  "message": "Status atualizado com sucesso",
  "client": {
    "id": 2,
    "name": "Lead Vindo do Chatbot",
    "phone": "+5511977776666",
    "answered": true
  }
}
```

---

## 🚦 Códigos de Status HTTP

| Código | Significado | Contexto de Uso |
| :---: | :--- | :--- |
| `200 OK` | Sucesso | Consultas (GET) e atualizações bem-sucedidas (PATCH). |
| `201 Created` | Criado | Cadastros de usuários, clientes ou chaves de API. |
| `400 Bad Request` | Requisição Inválida | Falha na validação de schema (Zod) ou campos ausentes. |
| `401 Unauthorized` | Não Autenticado | Token JWT inválido/expirado, API Key incorreta ou usuário inativo. |
| `403 Forbidden` | Acesso Negado | Usuário autenticado, porém sem permissão para o recurso solicitado. |
| `404 Not Found` | Não Encontrado | Cliente ou recurso não localizado no banco de dados. |
| `409 Conflict` | Conflito | Tentativa de cadastrar um e-mail já existente. |
| `429 Too Many Requests` | Limite Excedido | Bloqueio temporário por excesso de requisições (Rate Limiter). |
| `500 Internal Error` | Erro no Servidor | Falha inesperada durante a execução da requisição. |

---

## 🗄️ Modelo de Dados (Database Schema)

O esquema relacional é gerenciado pelo **Prisma ORM** e mapeado para o banco MySQL:

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

### Relacionamentos:
- **`User (1) ── (N) Client`**: Um atendente possui múltiplos clientes sob seu atendimento. A unicidade `@@unique([attendantId, phone])` assegura que um mesmo atendente não tenha clientes duplicados com o mesmo telefone.
- **`User (1) ── (N) ApiKey`**: Um usuário pode gerar múltiplas chaves para diferentes instâncias ou integrações de chatbot.

---

## 🛡️ Políticas de Segurança

1. **Criptografia de Senhas:** Hashes gerados com algoritmo adaptativo `bcrypt` com salt factor de 10 rounds. A senha original nunca é armazenada.
2. **Armazenamento Seguro de Chaves:** As API Keys para integrações de bots utilizam hash SHA-256 (`keyHash`). Chaves vazadas não podem ser reconstruídas a partir da base de dados.
3. **Proteção de Segredos:** Senhas e hashes nunca são retornados nas respostas de endpoints através de projeções seletivas (`select`) no Prisma.
4. **Isolamento de Escopo:** Nas consultas de atendentes, o `attendantId` é extraído diretamente do token JWT assinado, impedindo que um usuário acesse registros de terceiros manipulando parâmetros da requisição.
5. **Rate Limiting:** Proteção global contra sobrecarga e ataques de negação de serviço (`express-rate-limit`).

---

## 🗺️ Roadmap de Desenvolvimento

### Backend
- [x] Autenticação e cadastro com JWT e Bcrypt
- [x] Controle de acesso RBAC (`ADMIN` e `ATENDENTE`)
- [x] Validação estruturada com Zod e Validator
- [x] Gestão de Clientes e Status de Atendimento
- [x] Módulo de Automação com API Keys para Chatbots
- [x] Limitação de taxa com Rate Limiter
- [ ] Tratamento global centralizado de exceções (Error Middleware)
- [ ] Documentação interativa com Swagger / OpenAPI
- [ ] Cobertura de testes automatizados unitários e de integração (Jest / Supertest)
- [ ] Atualização em tempo real via WebSockets (Socket.io)

### Frontend (Próxima Fase)
- [ ] Painel do Atendente (fila de atendimento em tempo real, filtros por status)
- [ ] Painel do Administrador (gestão de usuários, métricas de atendimento e auditoria)
- [ ] Interface de geração e revogação de API Keys

---

## 🤝 Como Contribuir

Contribuições são muito bem-vindas! Para colaborar com o projeto:

1. Faça um **Fork** do projeto.
2. Crie uma **Branch** para a sua feature:
   ```bash
   git checkout -b feature/minha-nova-feature
   ```
3. Realize seus **Commits** com mensagens claras e semânticas:
   ```bash
   git commit -m "feat: adiciona rota de listagem de histórico de chamados"
   ```
4. Envie sua Branch para o repositório remoto:
   ```bash
   git push origin feature/minha-nova-feature
   ```
5. Abra um **Pull Request** detalhando as alterações implementadas.

---

## 📄 Licença

Este projeto é distribuído sob a licença **ISC**. Consulte o arquivo de licença do projeto para obter mais detalhes.