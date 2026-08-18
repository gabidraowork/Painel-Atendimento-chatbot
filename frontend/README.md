# Estrutura do Frontend & Integrações CRM

Toda a lógica de frontend está centralizada na pasta `/frontend`.

## 📁 Estrutura de Diretórios

```
frontend/
├── index.html                   # HTML base
├── vite.config.ts               # Configuração do Vite com proxy para backend
├── src/
│   ├── main.tsx                 # Ponto de entrada React
│   ├── App.tsx                  # Gerenciador de rotas e layout do painel
│   ├── index.css                # Importação Tailwind CSS
│   ├── types/                   # Tipagens TypeScript completas
│   │   └── index.ts
│   ├── config/                  # Variáveis de ambiente e constantes
│   │   ├── env.ts               # Leitura de import.meta.env
│   │   ├── constants.ts         # Rotas da API e chaves de localStorage
│   │   └── api.ts               # Re-export unificado dos serviços
│   ├── services/                # Camada de comunicação HTTP
│   │   ├── httpClient.ts        # Fetch customizado com injeção automática de JWT Bearer
│   │   ├── auth.service.ts      # Login e registro (/auth/login, /auth/register)
│   │   ├── clients.service.ts   # CRUD de clientes (/clients, /clients/answered)
│   │   └── apiKey.service.ts    # Geração e gestão de API keys (/automation/api-key)
│   ├── context/                 # Context API do React
│   │   └── AuthContext.tsx      # Estado global de autenticação e sessão
│   ├── hooks/                   # Custom hooks
│   │   └── useClients.ts        # Busca, cadastro, exclusão e alteração de status
│   ├── components/              # Componentes de interface
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ClientTable.tsx
│   │   ├── ClientCard.tsx
│   │   ├── StatsCard.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── AlertMessage.tsx
│   └── pages/                   # Telas do sistema
│       ├── LoginPage.tsx
│       ├── DashboardPage.tsx
│       ├── ClientsPage.tsx
│       ├── NewClientPage.tsx
│       └── ApiKeysPage.tsx      # Gerenciamento de chaves e testador de bots
```

## 🔄 Rotas e Endpoints Integrados

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/auth/login` | Autenticação de atendente ou admin |
| `POST` | `/auth/register` | Registro de novo usuário |
| `GET` | `/clients` | Lista clientes (ADMIN vê atendente associado, ATENDENTE vê sua carteira) |
| `POST` | `/clients` | Criação de cliente pelo painel |
| `PATCH` | `/clients/answered` | Alterna status `answered` (`true`/`false`) do cliente |
| `DELETE` | `/clients` | Exclusão de cliente pelo telefone |
| `POST` | `/automation/api-key` | Geração de nova chave de API criptografada (SHA-256) |
| `POST` | `/automation/client` | Inserção de lead por bots externos com header `x-api-key` |
| `PATCH` | `/automation/client/answered` | Atualização de status por bots com header `x-api-key` |
