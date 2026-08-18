import React, { useState } from "react";
import { ClientsService } from "../services/clients.service";
import { AlertMessage } from "../components/AlertMessage";
import { UserPlus, User, Phone, ArrowLeft, Loader2, Info } from "lucide-react";
import { NavPage } from "../types";

interface NewClientPageProps {
  onClientCreated: () => void;
  onNavigate: (page: NavPage) => void;
}

export const NewClientPage: React.FC<NewClientPageProps> = ({
  onClientCreated,
  onNavigate,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+55");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedPhone) {
      setErrorMessage("Por favor, preencha o nome completo e o telefone do cliente.");
      return;
    }

    if (trimmedPhone.length < 8) {
      setErrorMessage("O telefone informado parece estar incompleto.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await ClientsService.createClient({ name: trimmedName, phone: trimmedPhone });
      setSuccessMessage(result.message || "Cliente cadastrado com sucesso!");
      setName("");
      setPhone("+55");
      onClientCreated();

      // Redireciona de volta para a lista de clientes
      setTimeout(() => {
        onNavigate("clients");
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err?.message || "Erro ao registrar cliente. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="new-client-page-container" className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <button
          id="back-to-clients-btn"
          onClick={() => onNavigate("clients")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para Lista de Clientes</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 id="new-client-title" className="text-lg font-bold text-slate-900">
                Cadastrar Novo Cliente
              </h2>
              <p className="text-xs text-slate-500">
                Envia uma requisição <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-blue-700">POST /clients</code> com os dados
              </p>
            </div>
          </div>
        </div>

        {errorMessage && (
          <AlertMessage
            id="create-client-error-alert"
            type="error"
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
          />
        )}

        {successMessage && (
          <AlertMessage
            id="create-client-success-alert"
            type="success"
            message={successMessage}
          />
        )}

        <form id="new-client-form" onSubmit={handleSubmit} className="space-y-5">
          {/* Client name input */}
          <div>
            <label htmlFor="client-name-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nome Completo do Cliente *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="client-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Carlos Alberto Ferreira"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Client phone input */}
          <div>
            <label htmlFor="client-phone-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Número de Telefone / WhatsApp *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="client-phone-input"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+5511987654321"
                className="w-full pl-10 pr-3.5 py-2.5 font-mono bg-slate-50/50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Recomendado formato com código do país (ex: +5511988887777).
            </p>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              id="cancel-create-client-btn"
              type="button"
              onClick={() => onNavigate("clients")}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>

            <button
              id="submit-create-client-btn"
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando Cliente...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Cadastrar Cliente</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewClientPage;
