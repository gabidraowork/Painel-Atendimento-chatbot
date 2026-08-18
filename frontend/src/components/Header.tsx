import React from "react";
import { User } from "../types";
import { LogOut, User as UserIcon, Shield, Headphones } from "lucide-react";

interface HeaderProps {
  user: User;
  pageTitle: string;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, pageTitle, onLogout }) => {
  const isAdmin = user.role === "ADMIN";

  return (
    <header id="crm-top-header" className="h-16 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between sticky top-0 z-10 shadow-2xs">
      <div>
        <h1 id="page-title-heading" className="text-base font-bold text-slate-900 leading-tight">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* User profile capsule */}
        <div id="user-profile-badge" className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
            isAdmin ? "bg-amber-600 shadow-xs shadow-amber-500/20" : "bg-blue-600 shadow-xs shadow-blue-500/20"
          }`}>
            {isAdmin ? <Shield className="w-3.5 h-3.5" /> : <Headphones className="w-3.5 h-3.5" />}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-900 leading-none">{user.name}</p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{user.role}</p>
          </div>
        </div>

        <button
          id="header-logout-btn"
          onClick={onLogout}
          className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors"
          title="Sair do sistema"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Sair</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
