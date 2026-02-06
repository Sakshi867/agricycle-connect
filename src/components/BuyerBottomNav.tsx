import { Link, useLocation } from "react-router-dom";
import { Search, Bookmark, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

const BuyerBottomNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: Search, label: "Discover", path: "/buyer/dashboard" },
    { icon: Bookmark, label: "Shortlist", path: "/buyer/shortlist" },
    { icon: MessageSquare, label: "Messages", path: "/buyer/messages" },
    { icon: User, label: "Profile", path: "/buyer/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors",
                isActive ? "text-secondary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "text-secondary")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BuyerBottomNav;
