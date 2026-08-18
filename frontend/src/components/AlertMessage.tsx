import React from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

interface AlertMessageProps {
  id?: string;
  type?: "error" | "success" | "info" | "warning";
  message: string;
  onClose?: () => void;
}

export const AlertMessage: React.FC<AlertMessageProps> = ({
  id,
  type = "error",
  message,
  onClose,
}) => {
  const styles = {
    error: {
      bg: "bg-rose-50 border-rose-200 text-rose-800",
      icon: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
      closeBtn: "text-rose-500 hover:text-rose-800",
    },
    success: {
      bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
      closeBtn: "text-emerald-500 hover:text-emerald-800",
    },
    info: {
      bg: "bg-blue-50 border-blue-200 text-blue-800",
      icon: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
      closeBtn: "text-blue-500 hover:text-blue-800",
    },
    warning: {
      bg: "bg-amber-50 border-amber-200 text-amber-800",
      icon: <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
      closeBtn: "text-amber-500 hover:text-amber-800",
    },
  }[type];

  return (
    <div
      id={id}
      className={`p-3.5 rounded-xl border text-xs flex items-start justify-between gap-3 shadow-2xs ${styles.bg}`}
    >
      <div className="flex items-start gap-2.5">
        {styles.icon}
        <span className="font-medium leading-relaxed">{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={`p-1 rounded-lg transition-colors ${styles.closeBtn}`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default AlertMessage;
