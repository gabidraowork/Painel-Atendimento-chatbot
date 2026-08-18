import React, { useState } from "react";
import { Client } from "../types";
import { Phone, UserCheck, Clock, User, Trash2, MessageSquare, Loader2 } from "lucide-react";

interface ClientCardProps {
  client: Client;
  index: number;
  onToggleStatus?: (phone: string, currentAnswered: boolean) => Promise<any>;
  onDelete?: (phone: string, name: string) => Promise<any>;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  index,
  onToggleStatus,
  onDelete,
}) => {
  const isAnswered = Boolean(client.answered);
  const [isProcessing, setIsProcessing] = useState(false);

  const cleanPhone = client.phone.replace(/\D/g, "");

  const handleToggle = async () => {
    if (!onToggleStatus) return;
    setIsProcessing(true);
    try {
      await onToggleStatus(client.phone, isAnswered);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    const confirm = window.confirm(`Deseja remover o cliente ${client.name} (${client.phone})?`);
    if (!confirm) return;

    setIsProcessing(true);
    try {
      await onDelete(client.phone, client.name);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      id={`client-card-${client.id || index}`}
      className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-sm text-slate-700 shrink-0">
              {client.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-snug">
                {client.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{client.phone}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleToggle}
            disabled={isProcessing}
            title="Alternar status (PATCH /clients/answered)"
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
              isAnswered
                ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100"
                : "bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100"
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : isAnswered ? (
              <UserCheck className="w-3 h-3 text-emerald-600" />
            ) : (
              <Clock className="w-3 h-3 text-amber-600" />
            )}
            <span>{isAnswered ? "Atendido" : "Pendente"}</span>
          </button>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div>
          {client.attendant ? (
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              <User className="w-3 h-3 text-slate-400" />
              Resp: <strong className="text-slate-700">{client.attendant.name}</strong>
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 italic">Sua Carteira</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {cleanPhone && (
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noreferrer"
              title="Abrir WhatsApp"
              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          )}

          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={isProcessing}
              title="Excluir cliente"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
