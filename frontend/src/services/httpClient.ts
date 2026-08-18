import env from "../config/env";
import { STORAGE_KEYS } from "../config/constants";

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

export class ApiHttpError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiHttpError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Recupera o token de autenticação atual do localStorage.
 */
export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch {
    return null;
  }
}

/**
 * Cliente HTTP unificado para todas as chamadas do Frontend para o Backend.
 */
export async function httpClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { timeoutMs = 15000, ...fetchOptions } = options;

  // Monta os cabeçalhos padrão
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Injeta automaticamente o token JWT se presente
  const token = getStoredToken();
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Prepara URL base (considera variável de ambiente VITE_API_URL)
  const baseUrl = env.apiUrl.endsWith("/") ? env.apiUrl.slice(0, -1) : env.apiUrl;
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = `${baseUrl}${path}`;

  // Controle de Timeout com AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Tenta interpretar o corpo como JSON
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Extrai a mensagem de erro padronizada enviada pelo backend
      let errorMessage = data?.message;

      if (!errorMessage && data?.errors && typeof data.errors === "object") {
        errorMessage = Object.values(data.errors).join(", ");
      }

      if (!errorMessage) {
        errorMessage = `Erro no servidor (Status HTTP ${response.status})`;
      }

      throw new ApiHttpError(errorMessage, response.status, data);
    }

    return data as T;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new ApiHttpError("A requisição excedeu o tempo limite do servidor.", 408);
    }

    if (error instanceof ApiHttpError) {
      throw error;
    }

    throw new ApiHttpError(
      error?.message || "Não foi possível conectar ao servidor backend.",
      0
    );
  }
}
