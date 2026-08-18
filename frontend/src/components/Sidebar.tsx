import React from "react";
import { LayoutDashboard, Users, UserPlus, Key, LogOut } from "lucide-react";
import { NavPage } from "../types";

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  onLogout: () => void;
  clientsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  onLogout,
  clientsCount = 0,
}) => {
  const navItems = [
    {
      id: "dashboard" as NavPage,
      label: "Painel Geral",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "clients" as NavPage,
      label: "Lista de Clientes",
      icon: Users,
      badge: clientsCount > 0 ? clientsCount : null,
    },
    {
      id: "new-client" as NavPage,
      label: "Novo Cliente",
      icon: UserPlus,
      badge: null,
    },
    {
      id: "api-keys" as NavPage,
      label: "Chaves de API & Bot",
      icon: Key,
      badge: null,
    },
  ];

  return (
    <aside id="crm-sidebar-navigation" className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand / Logo */}
      <div id="sidebar-brand-container" className="p-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 id="sidebar-app-title" className="font-bold text-white text-base tracking-tight leading-none">
              CRM Atendimento
            </h2>
            <span className="text-[11px] text-blue-400 font-medium tracking-wide">
              Módulo Integrado
            </span>
          </div>
        </div>
      </div>

      {/* Navigation items */}
      <nav id="sidebar-nav-links" className="p-4 space-y-1.5 flex-1">
        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-3 py-2">
          Navegação Principal
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span
                  id={`nav-badge-${item.id}`}
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? "bg-blue-700/80 text-white"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Backend connection status pill */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        <div id="backend-status-indicator" className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-200">Backend Operacional</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Rotas `/clients` e `/automation` ativas
          </p>
        </div>

        <button
          id="sidebar-logout-btn"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/50 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Encerrar Sessão</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
