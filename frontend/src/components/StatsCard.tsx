import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  id?: string;
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  iconBgColor?: string;
  iconColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  id,
  title,
  value,
  icon: Icon,
  description,
  iconBgColor = "bg-blue-50",
  iconColor = "text-blue-600",
}) => {
  return (
    <div
      id={id}
      className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between"
    >
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">
          {value}
        </p>
        {description && (
          <p className="text-[11px] text-slate-400">
            {description}
          </p>
        )}
      </div>

      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBgColor} ${iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default StatsCard;
