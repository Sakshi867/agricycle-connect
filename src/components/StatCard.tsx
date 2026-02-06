import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  value: ReactNode;
  label: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "secondary" | "accent";
  className?: string;
}

const StatCard = ({
  value,
  label,
  icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) => {
  const variantClasses = {
    default: "bg-card",
    primary: "bg-primary/5 border-primary/20",
    secondary: "bg-secondary/5 border-secondary/20",
    accent: "bg-accent/10 border-accent/30",
  };

  const iconBgClasses = {
    default: "bg-muted",
    primary: "bg-primary/10",
    secondary: "bg-secondary/10",
    accent: "bg-accent/20",
  };

  return (
    <div
      className={cn(
        "p-5 rounded-2xl border shadow-card transition-all duration-300 hover:shadow-elevated",
        variantClasses[variant],
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        {icon && (
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconBgClasses[variant])}>
            {icon}
          </div>
        )}
        {trend && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trend.isPositive
                ? "bg-primary/10 text-primary"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {trend.isPositive ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

export default StatCard;
