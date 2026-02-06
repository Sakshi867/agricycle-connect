import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  step?: number;
  variant?: "default" | "elevated" | "outlined";
  className?: string;
}

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  step,
  variant = "default",
  className 
}: FeatureCardProps) => {
  const variantClasses = {
    default: "bg-card shadow-card",
    elevated: "bg-card shadow-elevated hover:-translate-y-1",
    outlined: "bg-transparent border-2 border-primary/20 hover:border-primary/40",
  };

  return (
    <div className={cn(
      "relative p-6 rounded-2xl transition-all duration-300",
      variantClasses[variant],
      className
    )}>
      {step && (
        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold text-sm flex items-center justify-center shadow-md">
          {step}
        </div>
      )}
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
