import React from "react";
import { Client, User, NavPage } from "../types";
import { StatsCard } from "../components/StatsCard";
import { ClientCard } from "../components/ClientCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Users, UserCheck, Clock, UserPlus, ArrowRight, Key, Sparkles } from "lucide-react";

interface DashboardPageProps {
  user: User | null;
  clients: Client[];
  isLoading: boolean;
  onNavigate: (page: NavPage) => void;
  onToggleStatus?: (phone: string, currentAnswered: boolean) => Promise<any>;
  onDeleteClient?: (phone: string, name: string) => Promise<any>;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  clients,
  isLoading,
  onNavigate,
  onToggleStatus,
  onDeleteClient,
}) => {
  const totalClients = clients.length;
  const answeredClients = clients.filter((c) => c.answered).length;
  const pendingClients = totalClients - answeredClients;

  const recentClients = clients.slice(0, 4);

  return (
    <div id="dashboard-page-container" className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Welcome banner */}
      <div id="welcome-banner" className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Visão Geral do Atendimento
            </span>
            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
              {user?.role || "ATENDENTE"}
            </span>
          </div>
          <h2 id="welcome-greeting" className="text-xl font-bold text-slate-900 mt-2">
            Olá, {user?.name || "Atendente"}!
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Acompanhe aqui o status dos clientes e adicione novos contatos para atendimento.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="dashboard-api-keys-btn"
            onClick={() => onNavigate("api-keys")}
            className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all"
          >
            <Key className="w-4 h-4 text-slate-600" />
            <span>Chaves de API</span>
          </button>

          <button
            id="dashboard-new-client-btn"
            onClick={() => onNavigate("new-client")}
            className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Cliente</span>
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <div id="metrics-grid" className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatsCard
          id="stat-total-clients"
          title="Total de Clientes"
          value={totalClients}
          icon={Users}
          description="Contatos registrados no CRM"
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatsCard
          id="stat-answered-clients"
          title="Atendidos"
          value={answeredClients}
          icon={UserCheck}
          description="Atendimentos concluídos"
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatsCard
          id="stat-pending-clients"
          title="Pendentes"
          value={pendingClients}
          icon={Clock}
          description="Aguardando retorno ou contato"
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* Recent clients section */}
      <div id="recent-clients-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Clientes Recentes
            </h3>
            <p className="text-xs text-slate-500">
              Últimos registros cadastrados no sistema
            </p>
          </div>

          <button
            id="view-all-clients-btn"
            onClick={() => onNavigate("clients")}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>Ver todos ({totalClients})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoading ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-8">
            <LoadingSpinner message="Carregando lista de clientes..." />
          </div>
        ) : recentClients.length === 0 ? (
          <div id="no-clients-box" className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Nenhum cliente cadastrado ainda</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Comece adicionando o primeiro cliente da sua carteira para iniciar os atendimentos.
            </p>
            <button
              onClick={() => onNavigate("new-client")}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-xl transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Cadastrar Primeiro Cliente</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentClients.map((client, index) => (
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
    </div>
  );
};

export default DashboardPage;
