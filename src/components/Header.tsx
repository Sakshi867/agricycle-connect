import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

interface HeaderProps {
  variant?: "default" | "transparent";
}

const Header = ({ variant = "default" }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Impact", href: "#impact" },
    { label: "For Farmers", href: "/role-select" },
    { label: "For Buyers", href: "/role-select" },
  ];

  const headerClasses = {
    default: "bg-background/95 backdrop-blur-md border-b border-border shadow-sm",
    transparent: "bg-transparent",
  };

  const textClasses = {
    default: "text-foreground",
    transparent: "text-primary-foreground",
  };

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", headerClasses[variant])}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Logo variant={variant === "transparent" ? "white" : "default"} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-accent",
                  textClasses[variant]
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant={variant === "transparent" ? "hero-outline" : "ghost"} asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/role-select">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={cn("md:hidden p-2 rounded-lg transition-colors", textClasses[variant])}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg transition-all duration-300",
          isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-foreground font-medium py-2 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            <Button variant="outline" asChild className="w-full">
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button variant="hero" asChild className="w-full">
              <Link to="/role-select">Get Started</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
