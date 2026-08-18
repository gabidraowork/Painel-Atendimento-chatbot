/**
 * Centralização e validação das variáveis de ambiente do Frontend.
 * Todas as variáveis de ambiente devem ser prefixadas com VITE_ para serem expostas pelo Vite.
 */

export const env = {
  /**
   * URL base do Backend.
   * Se vazia (''), o frontend fará requisições relativas à mesma origem (recomendado para SPA servido junto com a API ou proxy).
   */
  apiUrl: (import.meta.env.VITE_API_URL as string) || "",

  /**
   * Título principal da aplicação.
   */
  appTitle: (import.meta.env.VITE_APP_TITLE as string) || "Painel CRM Atendimento",

  /**
   * Modo de execução (development | production)
   */
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

export default env;
