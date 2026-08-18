/**
 * Constantes globais do Frontend
 */

export const STORAGE_KEYS = {
  AUTH_TOKEN: "crm_auth_token",
  AUTH_USER: "crm_auth_user",
  API_KEYS: "crm_stored_api_keys",
} as const;

export const API_ENDPOINTS = {
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  CLIENTS: "/clients",
  CLIENTS_ANSWERED: "/clients/answered",
  AUTOMATION_API_KEY: "/automation/api-key",
  AUTOMATION_CLIENT: "/automation/client",
  AUTOMATION_CLIENT_ANSWERED: "/automation/client/answered",
  USERS: "/users",
  HEALTH: "/api/health",
} as const;

export const DEFAULT_PAGE_TITLES = {
  dashboard: "Painel Geral",
  clients: "Lista de Clientes",
  "new-client": "Novo Cliente",
  "api-keys": "Chaves de API & Automação",
} as const;
