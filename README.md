# Painel de Atendimento

Backend de uma aplicação de gerenciamento de usuários e atendimento, desenvolvido com **Node.js, TypeScript, Express, Prisma e MySQL**.

O projeto está sendo construído com foco em boas práticas de desenvolvimento backend, separação de responsabilidades, validação de dados, autenticação, autorização e segurança.

> 🚧 **Status:** Em desenvolvimento

---

## 📌 Sobre o projeto

O **Painel de Atendimento** tem como objetivo servir como base para um sistema interno de gerenciamento de atendentes e solicitações de atendimento humano encaminhadas por um chatbot.

A aplicação possui uma API REST responsável por autenticação, gerenciamento de usuários e gerenciamento de clientes.

A arquitetura utiliza separação de responsabilidades:

**Routes → Middlewares → Controllers → Services → Prisma → MySQL**

O sistema possui autenticação através de **JWT** e controle de acesso baseado em **roles**.

---

## 🚀 Tecnologias

### Backend

- **Node.js**
- **TypeScript**
- **Express**
- **Prisma ORM**
- **MySQL**
- **Zod**
- **bcrypt**
- **JWT**

---

## 🏗️ Arquitetura

O backend utiliza separação de responsabilidades entre as principais camadas:

```text
Request
   │
   ▼
Routes
   │
   ▼
Middlewares
   │
   ├── Validation
   ├── Authentication
   └── Authorization
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Prisma ORM
   │
   ▼
MySQL
````

### Responsabilidades

| Camada          | Responsabilidade                                     |
| --------------- | ---------------------------------------------------- |
| **Routes**      | Define endpoints e middlewares utilizados            |
| **Schemas**     | Define contratos e regras de validação               |
| **Middlewares** | Intercepta, valida, autentica e autoriza requisições |
| **Controllers** | Gerencia HTTP, status codes e respostas              |
| **Services**    | Concentra regras de negócio                          |
| **Prisma**      | Comunicação com o banco de dados                     |
| **MySQL**       | Persistência dos dados                               |

---

## 📁 Estrutura atual

```text
backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── clients.controller.ts
│   │
│   ├── middlewares/
│   │   ├── validate.middleware.ts
│   │   ├── auth.middleware.ts
│   │   └── authorize.middleware.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── users.routes.ts
│   │   └── clients.routes.ts
│   │
│   ├── schemas/
│   │   └── auth.schema.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── clients.service.ts
│   │
│   └── lib/
│       └── prisma.ts
│
├── prisma/
│   └── schema.prisma
│
├── .env
├── package.json
└── tsconfig.json
```

---

# 🔐 Autenticação

O projeto possui um sistema de **cadastro e login de usuários utilizando JWT**.

O fluxo de autenticação é dividido em:

```text
Cadastro
   ↓
Hash da senha
   ↓
MySQL

Login
   ↓
Verificação da senha
   ↓
JWT
   ↓
Token de acesso
```

---

# 👤 Cadastro

Endpoint:

```http
POST /auth/register
```

Fluxo:

```text
POST /auth/register
        ↓
registerSchema
        ↓
validate()
        ↓
register Controller
        ↓
registerUser Service
        ↓
bcrypt
        ↓
Prisma
        ↓
MySQL
```

### Exemplo de requisição

```json
{
  "name": "Joao",
  "email": "joao@email.com",
  "password": "123456"
}
```

### Validações

O cadastro utiliza Zod para validar:

* Nome com quantidade mínima de caracteres
* Email em formato válido
* Senha com pelo menos 6 caracteres

Uma requisição inválida é interrompida antes de chegar ao Controller.

---

# 🔑 Login

Endpoint:

```http
POST /auth/login
```

Fluxo:

```text
POST /auth/login
        ↓
loginSchema
        ↓
validate()
        ↓
login Controller
        ↓
loginUser Service
        ↓
Busca usuário por email
        ↓
bcrypt.compare()
        ↓
Credenciais válidas
        ↓
Geração do JWT
        ↓
Token de acesso
```

### Exemplo de requisição

```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```

### Login bem-sucedido

O endpoint retorna os dados públicos do usuário e o token de autenticação.

```json
{
  "message": "Usuário logado com sucesso",
  "user": {
    "id": 1,
    "name": "Joao",
    "email": "joao@email.com",
    "role": "ATENDENTE",
    "active": true
  },
  "token": "JWT_TOKEN"
}
```

A senha e seu hash **não são retornados na resposta**.

---

# 🎫 JWT

Após o login, o backend gera um **JSON Web Token (JWT)**.

O token contém informações necessárias para identificar o usuário autenticado, incluindo:

```json
{
  "userId": 1,
  "role": "ATENDENTE"
}
```

As rotas protegidas devem receber o token através do header:

```http
Authorization: Bearer SEU_TOKEN
```

---

# 🛡️ Middleware de autenticação

O middleware `authenticate` é responsável por verificar se a requisição possui um JWT válido.

Fluxo:

```text
Request
   │
   ▼
Authorization Header
   │
   ▼
Bearer Token
   │
   ▼
Validação do JWT
   │
   ├── Inválido ──────► 401
   │
   ▼
Usuário autenticado
   │
   ▼
req.user
```

Após a autenticação, informações do usuário ficam disponíveis através de:

```ts
req.user
```

Exemplo:

```ts
{
    userId: 1,
    role: "ATENDENTE"
}
```

---

# 🔐 Autorização por Role

Além de autenticar o usuário, o sistema possui autorização baseada em **roles**.

Atualmente existem:

```text
ADMIN
ATENDENTE
```

A autorização é realizada através do middleware:

```ts
authorize()
```

Exemplo:

```ts
router.get(
    "/",
    authenticate,
    authorize("ATENDENTE", "ADMIN"),
    listClients
);
```

O fluxo é:

```text
Request
   ↓
authenticate
   ↓
Usuário autenticado?
   ↓
authorize()
   ↓
Role possui permissão?
   ├── NÃO ──────► 403
   │
   ▼
Controller
```

---

# 👥 Roles

## ADMIN

O administrador possui acesso aos clientes do sistema.

Na listagem de clientes, o ADMIN pode visualizar todos os clientes cadastrados e informações do atendente responsável.

---

## ATENDENTE

O atendente possui acesso somente aos clientes atribuídos a ele.

A API utiliza o `userId` obtido através do JWT para filtrar os clientes:

```ts
where: {
    attendantId: userId
}
```

Dessa forma, o atendente não precisa enviar seu próprio ID na requisição.

---

# 👤 Usuários

Os usuários possuem atualmente informações como:

```text
id
name
email
hashPassword
role
active
```

O campo `role` define o nível de acesso:

```text
ADMIN
ATENDENTE
```

O campo `active` indica se o usuário está habilitado para utilização.

```text
active: true
```

Usuário ativo.

```text
active: false
```

Usuário desativado.

---

# 👥 Clientes

O sistema possui uma entidade `Client` responsável por representar os clientes que precisam de atendimento.

Principais campos:

```text
id
phone
name
attendantId
createdAt
updatedAt
answered
```

Existe um relacionamento entre usuários e clientes:

```text
User
  │
  │ 1:N
  ▼
Client
```

Um usuário pode possuir vários clientes, enquanto cada cliente possui um atendente responsável.

---

# 📋 Listagem de clientes

Endpoint:

```http
GET /clients
```

A rota é protegida por autenticação e autorização:

```ts
router.get(
    "/",
    authenticate,
    authorize("ATENDENTE", "ADMIN"),
    listClients
);
```

---

## ADMIN

O ADMIN pode visualizar todos os clientes.

Exemplo de resposta:

```json
{
  "clients": [
    {
      "id": 1,
      "phone": "5511999999999",
      "name": "Joao",
      "attendant": {
        "id": 2,
        "name": "Carlos",
        "email": "carlos@email.com",
        "role": "ATENDENTE",
        "active": true
      }
    }
  ]
}
```

---

## ATENDENTE

O ATENDENTE visualiza somente os clientes atribuídos a ele.

Exemplo:

```json
{
  "clients": [
    {
      "name": "Joao",
      "phone": "5511999999999",
      "answered": false
    }
  ]
}
```

A filtragem é realizada no backend através do `attendantId` do usuário autenticado.

---

# 🔒 Segurança

O projeto possui algumas medidas de segurança:

* Senhas armazenadas utilizando `bcrypt`
* Autenticação utilizando JWT
* Autorização baseada em roles
* Rotas protegidas por middleware
* Validação de dados utilizando Zod
* Separação entre autenticação e autorização
* Clientes filtrados de acordo com o usuário autenticado
* Uso de `select` do Prisma para controlar dados retornados
* `hashPassword` não é retornado nas respostas

---

# 🧪 Validação com Zod

A API utiliza **Zod** para definir contratos de entrada.

Exemplo:

```ts
export const registerSchema = z.object({
    name: z
        .string()
        .min(3, "Nome deve ter pelo menos 3 caracteres"),

    email: z
        .string()
        .email("Email inválido"),

    password: z
        .string()
        .min(6, "Senha deve ter pelo menos 6 caracteres"),
});
```

A validação é realizada através de um middleware reutilizável:

```ts
validate(registerSchema)
```

ou:

```ts
validate(loginSchema)
```

---

# 🧩 Middleware de validação

O middleware utiliza `safeParse()` do Zod.

```text
Request
   ↓
safeParse(req.body)
   ↓
┌────────────────┐
│ Dados válidos? │
└────────────────┘
     ↓       ↓
    NÃO     SIM
     ↓       ↓
   400     next()
             ↓
        Controller
```

Quando os dados são inválidos:

```text
400 Bad Request
```

Quando são válidos:

```text
next()
```

e a requisição continua para o próximo middleware ou Controller.

---

# 🌐 Endpoints atuais

## Sistema

| Método | Endpoint  | Descrição             |
| ------ | --------- | --------------------- |
| `GET`  | `/`       | Verifica a API        |
| `GET`  | `/status` | Retorna status da API |
| `GET`  | `/api`    | Informações da API    |

## Authentication

| Método | Endpoint         | Descrição         |
| ------ | ---------------- | ----------------- |
| `POST` | `/auth/register` | Cadastra usuário  |
| `POST` | `/auth/login`    | Autentica usuário |

## Clientes

| Método | Endpoint   | Descrição                           | Autenticação |
| ------ | ---------- | ----------------------------------- | ------------ |
| `GET`  | `/clients` | Lista clientes de acordo com a role | JWT          |

---

# 📊 Status HTTP utilizados

| Status | Uso                                              |
| ------ | ------------------------------------------------ |
| `200`  | Operação realizada com sucesso                   |
| `201`  | Usuário cadastrado                               |
| `400`  | Dados enviados são inválidos                     |
| `401`  | Usuário não autenticado ou credenciais inválidas |
| `403`  | Usuário autenticado, mas sem permissão           |
| `409`  | Email já cadastrado                              |
| `500`  | Erro interno inesperado                          |

---

# 🔄 Fluxo de autenticação

```text
Cliente
   │
   │ POST /auth/login
   ▼
Auth Route
   │
   ▼
validate(loginSchema)
   │
   ▼
Auth Controller
   │
   ▼
loginUser()
   │
   ▼
Busca usuário
   │
   ▼
bcrypt.compare()
   │
   ├── Inválido ──────► 401
   │
   ▼
Geração do JWT
   │
   ▼
Token
   │
   ▼
Cliente
```

---

# 🔄 Fluxo de uma rota protegida

```text
Cliente
   │
   │ GET /clients
   │ Authorization: Bearer TOKEN
   ▼
authenticate
   │
   ▼
JWT válido?
   │
   ├── NÃO ──────► 401
   │
   ▼
req.user
   │
   ▼
authorize()
   │
   ▼
Role permitida?
   │
   ├── NÃO ──────► 403
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Prisma
   │
   ▼
MySQL
   │
   ▼
Resposta
```

---

# 🗄️ Banco de dados

O projeto utiliza **MySQL** como banco de dados e **Prisma ORM** como camada de acesso.

O Prisma é responsável por abstrair o acesso ao banco e fornecer uma interface tipada para trabalhar com os modelos.

```text
Application
     ↓
Prisma Client
     ↓
MySQL
```

---

# 🛠️ Próximos passos

O projeto ainda está em desenvolvimento.

### Autenticação

* [x] Cadastro de usuários
* [x] Hash de senha com bcrypt
* [x] Login
* [x] Validação com Zod
* [x] Middleware de validação
* [x] JWT
* [x] Geração de Access Token
* [x] Middleware de autenticação
* [x] `req.user`

### Autorização

* [x] Roles
* [x] `ADMIN`
* [x] `ATENDENTE`
* [x] Middleware de autorização
* [x] Proteção de rotas
* [x] Controle de acesso por role

### Usuários

* [x] Cadastro
* [x] Login
* [x] Controle de usuário ativo/inativo
* [ ] Listagem de usuários
* [ ] Buscar usuário
* [ ] Atualizar usuário
* [ ] Desativar usuário
* [ ] Alterar role

### Clientes

* [x] Modelagem de clientes
* [x] Relacionamento entre usuário e cliente
* [x] Listagem de clientes
* [x] Filtro de clientes por atendente
* [ ] Cadastro de clientes
* [ ] Atualização de clientes
* [ ] Sistema de status de atendimento
* [ ] Histórico de atendimentos

### Frontend

* [ ] React
* [ ] Tela de login
* [ ] Dashboard
* [ ] Lista de atendimentos
* [ ] Área administrativa
* [ ] Área do atendente

### Integração

* [ ] Integração com chatbot
* [ ] Recebimento de solicitações de atendimento
* [ ] Histórico de conversas
* [ ] Mensagens
* [ ] Atualização em tempo real

### Qualidade

* [ ] Tratamento centralizado de erros
* [ ] Testes automatizados
* [ ] Logs estruturados
* [ ] Swagger/OpenAPI
* [ ] Docker
* [ ] Deploy

---

# 📚 Objetivo de aprendizado

Este projeto está sendo desenvolvido como um projeto prático para aprofundar conhecimentos em desenvolvimento backend.

Principais conceitos praticados:

* TypeScript
* Node.js
* Express
* APIs REST
* Arquitetura em camadas
* Controllers
* Services
* Middlewares
* Zod
* bcrypt
* Prisma ORM
* MySQL
* HTTP Status Codes
* Autenticação
* JWT
* Autorização
* RBAC (Role-Based Access Control)
* Segurança de APIs
* Relacionamentos entre tabelas
* Tratamento de erros

O objetivo é evoluir o projeto gradualmente, aproximando sua estrutura de uma aplicação backend utilizada em um ambiente profissional.

---

# 📌 Status atual

**Backend em desenvolvimento.**

Atualmente o projeto possui:

```text
✅ Express
✅ TypeScript
✅ Prisma
✅ MySQL
✅ Cadastro de usuários
✅ Login
✅ bcrypt
✅ Zod
✅ Middleware de validação
✅ JWT
✅ Middleware de autenticação
✅ Middleware de autorização
✅ Roles ADMIN e ATENDENTE
✅ Rotas protegidas
✅ Modelagem de clientes
✅ Relacionamento User → Client
✅ GET /clients
✅ Filtro de clientes por atendente
```

O próximo objetivo é continuar a construção do **sistema de gerenciamento de atendimentos** e iniciar o desenvolvimento da interface com **React**.

```

**Essa versão já representa bem melhor o estado atual do seu projeto.** Eu também removi a parte que dizia que JWT estava "em desenvolvimento", porque **agora ele já existe no seu projeto**.
```
