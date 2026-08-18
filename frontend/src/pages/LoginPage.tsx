import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { AlertMessage } from "../components/AlertMessage";
import { Users, Lock, Mail, User as UserIcon, ArrowRight, Shield, Headphones, Loader2, UserPlus, LogIn, CheckCircle2 } from "lucide-react";
import env from "../config/env";

export const LoginPage: React.FC = () => {
  const { login, register, isLoading, error, clearError } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("maria@empresa.com");
  const [password, setPassword] = useState("123456");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const toggleMode = (registerMode: boolean) => {
    setIsRegisterMode(registerMode);
    setLocalError(null);
    setSuccessMessage(null);
    clearError();
    if (registerMode) {
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } else {
      setEmail("maria@empresa.com");
      setPassword("123456");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);
    clearError();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (isRegisterMode) {
      const trimmedName = name.trim();

      if (!trimmedName || !trimmedEmail || !trimmedPassword) {
        setLocalError("Por favor, preencha todos os campos obrigatórios.");
        return;
      }

      if (trimmedName.length < 3) {
        setLocalError("O nome deve ter pelo menos 3 caracteres.");
        return;
      }

      if (trimmedPassword.length < 6) {
        setLocalError("A senha deve ter pelo menos 6 caracteres.");
        return;
      }

      if (trimmedPassword !== confirmPassword.trim()) {
        setLocalError("As senhas não coincidem. Verifique a confirmação de senha.");
        return;
      }

      try {
        await register({
          name: trimmedName,
          email: trimmedEmail,
          password: trimmedPassword,
        });
      } catch {
        // Erro gerenciado pelo AuthContext
      }
    } else {
      if (!trimmedEmail || !trimmedPassword) {
        setLocalError("Por favor, preencha o e-mail e a senha de acesso.");
        return;
      }

      try {
        await login({ email: trimmedEmail, password: trimmedPassword });
      } catch {
        // Erro gerenciado pelo AuthContext
      }
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    if (isRegisterMode) {
      setIsRegisterMode(false);
    }
    setEmail(demoEmail);
    setPassword("123456");
    setLocalError(null);
    clearError();
  };

  const activeError = localError || error;

  return (
    <div id="login-page-container" className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 mb-4">
          <Users className="w-6 h-6" />
        </div>
        <h2 id="login-main-title" className="text-2xl font-bold tracking-tight text-slate-900">
          {env.appTitle}
        </h2>
        <p id="login-subtitle" className="mt-1.5 text-sm text-slate-500">
          {isRegisterMode
            ? "Crie sua conta de atendente para acessar a plataforma"
            : "Acesse sua conta para gerenciar clientes e atendimentos"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/90 rounded-2xl sm:px-10">
          
          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200/80">
            <button
              id="tab-login-mode"
              type="button"
              onClick={() => toggleMode(false)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                !isRegisterMode
                  ? "bg-white text-blue-600 shadow-2xs font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </button>

            <button
              id="tab-register-mode"
              type="button"
              onClick={() => toggleMode(true)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                isRegisterMode
                  ? "bg-white text-blue-600 shadow-2xs font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Criar Conta</span>
            </button>
          </div>

          {activeError && (
            <div className="mb-6">
              <AlertMessage
                id="login-error-alert"
                type="error"
                message={activeError}
                onClose={() => {
                  setLocalError(null);
                  clearError();
                }}
              />
            </div>
          )}

          {successMessage && (
            <div className="mb-6">
              <AlertMessage
                id="login-success-alert"
                type="success"
                message={successMessage}
                onClose={() => setSuccessMessage(null)}
              />
            </div>
          )}

          <form id="auth-form" className="space-y-4" onSubmit={handleSubmit}>
            {/* Name field (Only in register mode) */}
            {isRegisterMode && (
              <div>
                <label htmlFor="register-name-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nome Completo *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="register-name-input"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ex: Maria Silva"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="login-email-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                E-mail de Acesso *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email-input"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: atendente@empresa.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="login-password-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Senha * {isRegisterMode && <span className="text-[11px] font-normal text-slate-400">(mínimo 6 dígitos)</span>}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password-input"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Confirm Password field (Only in register mode) */}
            {isRegisterMode && (
              <div>
                <label htmlFor="register-confirm-password-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirmar Senha *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="register-confirm-password-input"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              id="auth-submit-button"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isRegisterMode ? "Cadastrando conta..." : "Autenticando no servidor..."}</span>
                </>
              ) : isRegisterMode ? (
                <>
                  <span>Cadastrar e Acessar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Mode toggle link below form */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => toggleMode(!isRegisterMode)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isRegisterMode
                ? "Já possui uma conta? Clique para entrar"
                : "Não possui cadastro? Crie sua conta aqui"}
            </button>
          </div>

          {/* Quick-fill demo credentials (only displayed when in login mode) */}
          {!isRegisterMode && (
            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 text-center mb-3">
                Contas de demonstração para teste rápido:
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  id="demo-attendant-btn"
                  type="button"
                  onClick={() => handleQuickFill("maria@empresa.com")}
                  className="flex items-center justify-center gap-1.5 p-2.5 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 transition-colors"
                >
                  <Headphones className="w-3.5 h-3.5 text-blue-600" />
                  <span>Atendente</span>
                </button>

                <button
                  id="demo-admin-btn"
                  type="button"
                  onClick={() => handleQuickFill("admin@empresa.com")}
                  className="flex items-center justify-center gap-1.5 p-2.5 bg-slate-50 hover:bg-amber-50 hover:border-amber-200 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-600" />
                  <span>Administrador</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 text-center mt-2">
                Senha padrão: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-600">123456</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
