import React, { useState, useEffect } from "react";
import { StoredApiKey } from "../types";
import { ApiKeyService } from "../services/apiKey.service";
import { useAuth } from "../context/AuthContext";
import { AlertMessage } from "../components/AlertMessage";
import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  Terminal,
  ShieldCheck,
  Send,
  Loader2,
  Code2,
  Sparkles,
  HelpCircle,
  Eye,
  EyeOff,
  User as UserIcon
} from "lucide-react";
import env from "../config/env";

export const ApiKeysPage: React.FC = () => {
  const { user } = useAuth();
  const [keyName, setKeyName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [keys, setKeys] = useState<StoredApiKey[]>([]);
  const [recentlyCreatedKey, setRecentlyCreatedKey] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [revealedKeyIds, setRevealedKeyIds] = useState<Record<string, boolean>>({});

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Test form state
  const [testKey, setTestKey] = useState<string>("");
  const [testName, setTestName] = useState("Cliente Teste Bot");
  const [testPhone, setTestPhone] = useState("+5511999998888");
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; data: any } | null>(null);

  // Load keys on mount and when active user changes
  useEffect(() => {
    if (!user) {
      setKeys([]);
      setTestKey("");
      return;
    }
    const loaded = ApiKeyService.getStoredApiKeys(user.id);
    setKeys(loaded);
    if (loaded.length > 0) {
      setTestKey(loaded[0].key);
    } else {
      setTestKey("");
    }
    setRecentlyCreatedKey(null);
  }, [user?.id]);

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setRecentlyCreatedKey(null);

    const trimmed = keyName.trim();
    if (!trimmed || trimmed.length < 3) {
      setErrorMessage("O nome da chave deve ter pelo menos 3 caracteres.");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await ApiKeyService.createApiKey(trimmed);
      const newKeyItem: StoredApiKey = {
        id: `key_${Date.now()}`,
        name: trimmed,
        key: response.apiKey,
        createdAt: new Date().toISOString(),
        userId: user?.id,
        userEmail: user?.email,
      };

      const updated = ApiKeyService.saveApiKeyLocally(newKeyItem, user?.id);
      setKeys(updated);
      setRecentlyCreatedKey(response.apiKey);
      setTestKey(response.apiKey);
      setSuccessMessage("Chave de API gerada com sucesso! Guarde-a em um local seguro.");
      setKeyName("");
    } catch (err: any) {
      setErrorMessage(err?.message || "Erro ao gerar chave de API.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleDeleteKey = (id: string, name: string) => {
    const confirm = window.confirm(`Deseja remover a chave "${name}" da lista salva no navegador para sua conta?`);
    if (!confirm) return;
    const updated = ApiKeyService.removeStoredApiKey(id, user?.id);
    setKeys(updated);
    if (testKey && updated.every((k) => k.key !== testKey)) {
      setTestKey(updated[0]?.key || "");
    }
  };

  const toggleReveal = (id: string) => {
    setRevealedKeyIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRunTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestResult(null);
    if (!testKey) {
      setErrorMessage("Selecione ou insira uma API Key para realizar o teste.");
      return;
    }

    setIsTesting(true);
    try {
      const data = await ApiKeyService.testApiKey(testKey, testName, testPhone);
      setTestResult({ success: true, data });
    } catch (err: any) {
      setTestResult({ success: false, data: err?.message || "Falha no teste" });
    } finally {
      setIsTesting(false);
    }
  };

  const baseUrl = env.apiUrl || window.location.origin;
  const sampleKey = testKey || recentlyCreatedKey || "SUA_CHAVE_API_AQUI";

  const curlCreateClient = `curl -X POST "${baseUrl}/automation/client" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${sampleKey}" \\
  -d '{
    "name": "João da Silva",
    "phone": "+5511999998888"
  }'`;

  const curlUpdateStatus = `curl -X PATCH "${baseUrl}/automation/client/answered" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${sampleKey}" \\
  -d '{
    "phone": "+5511999998888",
    "answered": true
  }'`;

  return (
    <div id="api-keys-page-container" className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Integrações & Chatbots
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              <ShieldCheck className="w-3 h-3" />
              Header <code className="font-mono text-emerald-800">x-api-key</code>
            </span>
          </div>
          <h2 id="api-keys-title" className="text-xl font-bold text-slate-900 mt-2">
            Chaves de API (Automation)
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Crie chaves de API para autenticar chatbots externos (n8n, Typebot, WhatsApp, Telegram) sem expor senhas.
          </p>
        </div>
      </div>

      {errorMessage && (
        <AlertMessage
          id="api-keys-error-alert"
          type="error"
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}

      {successMessage && (
        <AlertMessage
          id="api-keys-success-alert"
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {/* Grid: Create Key & Saved Keys */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generate Key Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Gerar Nova API Key</h3>
              <p className="text-xs text-slate-500">Gera um token SHA-256 no servidor</p>
            </div>
          </div>

          <form onSubmit={handleGenerateKey} className="space-y-4">
            <div>
              <label htmlFor="api-key-name-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nome de Identificação *
              </label>
              <input
                id="api-key-name-input"
                type="text"
                required
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="ex: Bot WhatsApp n8n"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Nome para você identificar qual bot ou serviço está utilizando a chave.
              </p>
            </div>

            <button
              id="generate-api-key-btn"
              type="submit"
              disabled={isGenerating}
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gerando Chave...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Criar Chave de API</span>
                </>
              )}
            </button>
          </form>

          {recentlyCreatedKey && (
            <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-900">Nova Chave Gerada:</span>
                <button
                  onClick={() => handleCopy(recentlyCreatedKey, "recent")}
                  className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-200 shadow-2xs"
                >
                  {copiedKeyId === "recent" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKeyId === "recent" ? "Copiada!" : "Copiar"}</span>
                </button>
              </div>
              <p className="font-mono text-xs text-blue-950 bg-white p-2 rounded border border-blue-100 break-all select-all">
                {recentlyCreatedKey}
              </p>
            </div>
          )}
        </div>

        {/* Saved Keys List */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Chaves Salvas no Painel</h3>
                <p className="text-xs text-slate-500">
                  Isoladas para a conta: <strong className="text-slate-700">{user?.name || user?.email || "Usuário atual"}</strong>
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {keys.length} {keys.length === 1 ? "chave" : "chaves"}
            </span>
          </div>

          {keys.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Key className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-700">Nenhuma chave de API salva</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Crie uma nova chave ao lado para integrar seus fluxos de atendimento automatizados.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {keys.map((k) => {
                const isRevealed = Boolean(revealedKeyIds[k.id]);
                const isCopied = copiedKeyId === k.id;
                const displayKey = isRevealed
                  ? k.key
                  : `${k.key.substring(0, 8)}••••••••••••••••••••••••${k.key.substring(k.key.length - 6)}`;

                return (
                  <div
                    key={k.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900">{k.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(k.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-xs text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200/80 break-all">
                          {displayKey}
                        </code>
                        <button
                          onClick={() => toggleReveal(k.id)}
                          className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                          title={isRevealed ? "Ocultar" : "Mostrar chave completa"}
                        >
                          {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleCopy(k.key, k.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-all shadow-2xs"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? "Copiado!" : "Copiar"}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteKey(k.id, k.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Remover chave salva"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bot Interactive Test & Snippets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Tester */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Testador Rápido de Automação</h3>
              <p className="text-xs text-slate-500">Dispara <code className="font-mono text-blue-600">POST /automation/client</code></p>
            </div>
          </div>

          <form onSubmit={handleRunTest} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">API Key para Teste</label>
              <input
                type="text"
                required
                value={testKey}
                onChange={(e) => setTestKey(e.target.value)}
                placeholder="Insira a chave ou gere acima"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  required
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  required
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isTesting}
              className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all disabled:opacity-70"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando requisição...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Simular Entrada de Lead do Bot</span>
                </>
              )}
            </button>
          </form>

          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs font-mono overflow-x-auto ${
                testResult.success
                  ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                  : "bg-rose-50 text-rose-900 border-rose-200"
              }`}
            >
              <div className="font-bold mb-1">
                {testResult.success ? "Sucesso (201 Created):" : "Erro no disparo:"}
              </div>
              <pre className="text-[11px] whitespace-pre-wrap">
                {typeof testResult.data === "object"
                  ? JSON.stringify(testResult.data, null, 2)
                  : String(testResult.data)}
              </pre>
            </div>
          )}
        </div>

        {/* Code Snippets */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Exemplos cURL para Integração</h3>
              <p className="text-xs text-slate-500">Pronto para colar no n8n, Postman ou Webhooks</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold mb-1">
                <span>1. Cadastrar Lead / Cliente</span>
                <button
                  onClick={() => handleCopy(curlCreateClient, "curl1")}
                  className="text-blue-600 hover:text-blue-800 text-[11px]"
                >
                  {copiedKeyId === "curl1" ? "Copiado!" : "Copiar cURL"}
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-200 p-3 rounded-xl text-[11px] font-mono overflow-x-auto">
                {curlCreateClient}
              </pre>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold mb-1">
                <span>2. Atualizar Status (Answered)</span>
                <button
                  onClick={() => handleCopy(curlUpdateStatus, "curl2")}
                  className="text-blue-600 hover:text-blue-800 text-[11px]"
                >
                  {copiedKeyId === "curl2" ? "Copiado!" : "Copiar cURL"}
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-200 p-3 rounded-xl text-[11px] font-mono overflow-x-auto">
                {curlUpdateStatus}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeysPage;
