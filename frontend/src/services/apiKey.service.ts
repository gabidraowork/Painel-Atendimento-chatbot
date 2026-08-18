import { httpClient } from "./httpClient";
import { API_ENDPOINTS, STORAGE_KEYS } from "../config/constants";
import { CreateApiKeyResponse, StoredApiKey } from "../types";
import { AuthService } from "./auth.service";
import env from "../config/env";

export class ApiKeyService {
  /**
   * Obtém a chave do localStorage específica para o usuário logado, garantindo isolamento total entre contas.
   */
  private static getUserStorageKey(userId?: number | string): string {
    const currentUserId = userId ?? AuthService.getStoredUser()?.id;
    if (!currentUserId) {
      return `${STORAGE_KEYS.API_KEYS}_guest`;
    }
    return `${STORAGE_KEYS.API_KEYS}_user_${currentUserId}`;
  }

  /**
   * Gera uma nova chave de API no backend para o usuário logado.
   * Endpoint: POST /automation/api-key
   * @param name Nome descritivo da chave (ex: "Bot WhatsApp n8n")
   */
  static async createApiKey(name: string): Promise<CreateApiKeyResponse> {
    return await httpClient<CreateApiKeyResponse>(API_ENDPOINTS.AUTOMATION_API_KEY, {
      method: "POST",
      body: JSON.stringify({ name: name.trim() }),
    });
  }

  /**
   * Recupera a lista de chaves de API salvas localmente no navegador para o usuário específico.
   */
  static getStoredApiKeys(userId?: number | string): StoredApiKey[] {
    try {
      const storageKey = this.getUserStorageKey(userId);
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Armazena uma chave gerada na lista local de chaves do usuário logado.
   */
  static saveApiKeyLocally(keyItem: StoredApiKey, userId?: number | string): StoredApiKey[] {
    try {
      const activeUser = AuthService.getStoredUser();
      const currentUserId = userId ?? activeUser?.id;
      const enrichedItem: StoredApiKey = {
        ...keyItem,
        userId: typeof currentUserId === "number" ? currentUserId : undefined,
        userEmail: activeUser?.email,
      };

      const storageKey = this.getUserStorageKey(currentUserId);
      const currentKeys = this.getStoredApiKeys(currentUserId);
      const updatedKeys = [enrichedItem, ...currentKeys.filter((k) => k.key !== keyItem.key)];
      localStorage.setItem(storageKey, JSON.stringify(updatedKeys));
      return updatedKeys;
    } catch (err) {
      console.error("Erro ao salvar chave localmente:", err);
      return this.getStoredApiKeys(userId);
    }
  }

  /**
   * Remove uma chave da lista local do usuário logado.
   */
  static removeStoredApiKey(id: string, userId?: number | string): StoredApiKey[] {
    try {
      const storageKey = this.getUserStorageKey(userId);
      const currentKeys = this.getStoredApiKeys(userId);
      const updatedKeys = currentKeys.filter((k) => k.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(updatedKeys));
      return updatedKeys;
    } catch (err) {
      console.error("Erro ao remover chave local:", err);
      return this.getStoredApiKeys(userId);
    }
  }

  /**
   * Testa uma chave de API enviando uma requisição de teste para o backend via POST /automation/client
   */
  static async testApiKey(apiKey: string, testName: string, testPhone: string): Promise<any> {
    const baseUrl = env.apiUrl.endsWith("/") ? env.apiUrl.slice(0, -1) : env.apiUrl;
    const response = await fetch(`${baseUrl}${API_ENDPOINTS.AUTOMATION_CLIENT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey.trim(),
      },
      body: JSON.stringify({
        name: testName.trim(),
        phone: testPhone.trim(),
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.message || `Erro no teste da API Key (Status HTTP ${response.status})`);
    }
    return data;
  }
}

export default ApiKeyService;
