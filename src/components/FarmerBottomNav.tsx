import { Link, useLocation } from "react-router-dom";
import { Home, PlusCircle, List, MessageSquare, User, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

const FarmerBottomNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/farmer/dashboard" },
    { icon: List, label: "Listings", path: "/farmer/listings" },
    { icon: PlusCircle, label: "Create", path: "/farmer/create", isMain: true },
    { icon: MessageSquare, label: "Messages", path: "/farmer/messages" },
    { icon: User, label: "Profile", path: "/farmer/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          if (item.isMain) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center justify-center -mt-6 tap-scale"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 btn-2026">
                  <Camera className="w-6 h-6 text-accent-foreground" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default FarmerBottomNav;
