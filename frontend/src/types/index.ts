export type UserRole = "ADMIN" | "ATENDENTE";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Client {
  id?: number;
  name: string;
  phone: string;
  answered?: boolean;
  attendantId?: number;
  createdAt?: string;
  updatedAt?: string;
  attendant?: {
    id: number;
    name: string;
    email: string;
    role: string;
    active?: boolean;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface CreateClientPayload {
  name: string;
  phone: string;
}

export interface UpdateClientStatusPayload {
  phone: string;
  answered: boolean;
}

export interface DeleteClientPayload {
  phone: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface GetClientsResponse {
  clients: Client[];
}

export interface CreateClientResponse {
  message: string;
  newClient: Client;
}

export interface UpdateStatusResponse {
  message: string;
  client: Client;
}

export interface DeleteClientResponse {
  message: string;
  deletedClient: {
    id?: number;
    name: string;
    phone: string;
  };
}

export interface StoredApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  userId?: number;
  userEmail?: string;
}

export interface CreateApiKeyResponse {
  message: string;
  apiKey: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}

export type NavPage = "dashboard" | "clients" | "new-client" | "api-keys";
