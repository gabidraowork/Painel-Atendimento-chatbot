import React, { useState } from "react";
import { Client } from "../types";
import { Phone, UserCheck, Clock, User as UserIcon, Trash2, CheckCircle2, MessageSquare, Loader2 } from "lucide-react";

interface ClientTableProps {
  clients: Client[];
  onToggleStatus?: (phone: string, currentAnswered: boolean) => Promise<any>;
  onDelete?: (phone: string, name: string) => Promise<any>;
}

export const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  onToggleStatus,
  onDelete,
}) => {
  const [processingPhone, setProcessingPhone] = useState<string | null>(null);

  const handleStatusClick = async (phone: string, currentAnswered: boolean) => {
    if (!onToggleStatus) return;
    setProcessingPhone(`status-${phone}`);
    try {
      await onToggleStatus(phone, currentAnswered);
    } finally {
      setProcessingPhone(null);
    }
  };

  const handleDeleteClick = async (phone: string, name: string) => {
    if (!onDelete) return;
    const confirmDelete = window.confirm(`Deseja realmente remover o cliente ${name} (${phone}) do sistema?`);
    if (!confirmDelete) return;

    setProcessingPhone(`delete-${phone}`);
    try {
      await onDelete(phone, name);
    } finally {
      setProcessingPhone(null);
    }
  };

  const sanitizePhoneForWhatsApp = (phone: string) => {
    return phone.replace(/\D/g, "");
  };

  return (
    <div id="clients-table-wrapper" className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table id="clients-data-table" className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-5">Cliente</th>
              <th className="py-3.5 px-5">Telefone</th>
              <th className="py-3.5 px-5">Status / Ação</th>
              <th className="py-3.5 px-5">Atendente / Responsável</th>
              <th className="py-3.5 px-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {clients.map((client, index) => {
              const isAnswered = Boolean(client.answered);
              const cleanPhone = sanitizePhoneForWhatsApp(client.phone);
              const isChangingStatus = processingPhone === `status-${client.phone}`;
              const isDeleting = processingPhone === `delete-${client.phone}`;

              return (
                <tr
                  key={client.id || `${client.phone}-${index}`}
                  id={`client-row-${client.id || index}`}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {/* Name */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-900">
                        {client.name}
                      </span>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-slate-700 bg-slate-50 px-2 py-1 rounded-md border border-slate-200/60">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{client.phone}</span>
                      </div>
                      {cleanPhone && (
                        <a
                          href={`https://wa.me/${cleanPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Abrir no WhatsApp"
                          className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </td>

                  {/* Status Toggle Button */}
                  <td className="py-4 px-5">
                    <button
                      id={`toggle-status-btn-${client.id || index}`}
                      onClick={() => handleStatusClick(client.phone, isAnswered)}
                      disabled={isChangingStatus}
                      title="Clique para alternar o status no backend (PATCH /clients/answered)"
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer hover:shadow-2xs ${
                        isAnswered
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                      } ${isChangingStatus ? "opacity-70 cursor-wait" : ""}`}
                    >
                      {isChangingStatus ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : isAnswered ? (
                        <UserCheck className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Clock className="w-3 h-3 text-amber-600" />
                      )}
                      <span>{isAnswered ? "Atendido" : "Pendente"}</span>
                      <span className="text-[10px] text-slate-400 font-normal ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        (alternar)
                      </span>
                    </button>
                  </td>

                  {/* Attendant */}
                  <td className="py-4 px-5 text-slate-600 text-xs">
                    {client.attendant ? (
                      <div className="flex items-center gap-1.5">
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-800">{client.attendant.name}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                          {client.attendant.role}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Sua Carteira</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        id={`delete-client-btn-${client.id || index}`}
                        onClick={() => handleDeleteClick(client.phone, client.name)}
                        disabled={isDeleting}
                        title="Remover cliente (DELETE /clients)"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientTable;
