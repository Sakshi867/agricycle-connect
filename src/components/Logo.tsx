import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

interface LogoProps {
  variant?: "default" | "white" | "dark";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ variant = "default", size = "md", showText = true }: LogoProps) => {
  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const colorClasses = {
    default: "text-primary",
    white: "text-primary-foreground",
    dark: "text-foreground",
  };

  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className={`${sizeClasses[size]} rounded-xl bg-gradient-gold flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
        <Leaf className="h-5 w-5 text-accent-foreground" />
      </div>
      {showText && (
        <span className={`font-bold ${textSizeClasses[size]} ${colorClasses[variant]} tracking-tight`}>
          Krishi<span className="text-accent">Profit</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
