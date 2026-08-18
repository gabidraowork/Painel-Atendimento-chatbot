import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Carregando dados...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-3">
      <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
      <p className="text-xs font-medium text-slate-500">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
