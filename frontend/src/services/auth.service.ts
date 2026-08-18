import { httpClient } from "./httpClient";
import { API_ENDPOINTS, STORAGE_KEYS } from "../config/constants";
import { AuthResponse, User, LoginCredentials, RegisterPayload } from "../types";

export class AuthService {
  /**
   * Realiza login no backend enviando email e senha.
   * Salva o token JWT e o objeto do usuário logado no storage local.
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await httpClient<AuthResponse>(API_ENDPOINTS.AUTH_LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.token && response.user) {
      this.saveSession(response.token, response.user);
    }

    return response;
  }

  /**
   * Realiza cadastro opcional de atendente no backend.
   */
  static async register(payload: RegisterPayload): Promise<any> {
    return await httpClient(API_ENDPOINTS.AUTH_REGISTER, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Salva a sessão atual no localStorage.
   */
  static saveSession(token: string, user: User): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } catch (err) {
      console.error("Erro ao persistir sessão:", err);
    }
  }

  /**
   * Obtém o usuário salvo na sessão atual.
   */
  static getStoredUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * Obtém o token JWT salvo na sessão.
   */
  static getStoredToken(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch {
      return null;
    }
  }

  /**
   * Verifica se o usuário atual está autenticado com token válido.
   */
  static isAuthenticated(): boolean {
    return Boolean(this.getStoredToken() && this.getStoredUser());
  }

  /**
   * Encerra a sessão removendo as credenciais locais.
   */
  static logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    } catch (err) {
      console.error("Erro ao encerrar sessão:", err);
    }
  }
}

export default AuthService;
