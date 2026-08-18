import React, { useState } from "react";
import { Client, NavPage } from "../types";
import { ClientTable } from "../components/ClientTable";
import { ClientCard } from "../components/ClientCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { AlertMessage } from "../components/AlertMessage";
import { Users, UserPlus, RefreshCw, Search, LayoutGrid, Table as TableIcon } from "lucide-react";

interface ClientsPageProps {
  clients: Client[];
  isLoading: boolean;
  errorMessage: string | null;
  onRefresh: () => void;
  onNavigate: (page: NavPage) => void;
  onToggleStatus?: (phone: string, currentAnswered: boolean) => Promise<any>;
  onDeleteClient?: (phone: string, name: string) => Promise<any>;
}

export const ClientsPage: React.FC<ClientsPageProps> = ({
  clients,
  isLoading,
  errorMessage,
  onRefresh,
  onNavigate,
  onToggleStatus,
  onDeleteClient,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  const filteredClients = clients.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term) ||
      (c.attendant?.name && c.attendant.name.toLowerCase().includes(term))
    );
  });

  return (
    <div id="clients-page-container" className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 id="clients-heading" className="text-xl font-bold text-slate-900">
            Carteira de Clientes
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Listagem completa de clientes obtida via requisição <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-blue-700">GET /clients</code>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="refresh-clients-button"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-xl shadow-2xs transition-all disabled:opacity-60"
            title="Atualizar lista"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-600" : "text-slate-500"}`} />
            <span>Atualizar</span>
          </button>

          <button
            id="create-client-top-btn"
            onClick={() => onNavigate("new-client")}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Novo Cliente</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <AlertMessage
          id="clients-error-alert"
          type="error"
          message={errorMessage}
          onClose={onRefresh}
        />
      )}

      {/* Filter and View toggles */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-clients-input"
            type="text"
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-400 font-medium mr-1">
            {filteredClients.length} {filteredClients.length === 1 ? "cliente" : "clientes"}
          </span>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              id="view-table-toggle"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "table" ? "bg-white text-blue-600 shadow-2xs" : "text-slate-500 hover:text-slate-800"
              }`}
              title="Visualização em Tabela"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              id="view-cards-toggle"
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "cards" ? "bg-white text-blue-600 shadow-2xs" : "text-slate-500 hover:text-slate-800"
              }`}
              title="Visualização em Cartões"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-12">
          <LoadingSpinner message="Consultando clientes no servidor..." />
        </div>
      ) : filteredClients.length === 0 ? (
        <div id="clients-empty-state" className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">
            {searchTerm ? "Nenhum cliente encontrado para a busca" : "Nenhum cliente cadastrado"}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm
              ? "Tente verificar a ortografia ou buscar por outro termo."
              : "Cadastre seu primeiro contato para começar a listar os atendimentos."}
          </p>
          {!searchTerm && (
            <button
              onClick={() => onNavigate("new-client")}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-xl transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Cadastrar Novo Cliente</span>
            </button>
          )}
        </div>
      ) : viewMode === "table" ? (
        <ClientTable
          clients={filteredClients}
          onToggleStatus={onToggleStatus}
          onDelete={onDeleteClient}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredClients.map((client, index) => (
            <ClientCard
              key={client.id || index}
              client={client}
              index={index}
              onToggleStatus={onToggleStatus}
              onDelete={onDeleteClient}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
