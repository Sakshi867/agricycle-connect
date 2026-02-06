import { Link } from "react-router-dom";
import { ArrowLeft, Building2, MapPin, Phone, Mail, Edit, Settings, Shield, HelpCircle, LogOut, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import BuyerBottomNav from "@/components/BuyerBottomNav";
import { useAuth } from "@/context/AuthContext";

const BuyerProfile = () => {
  const { currentUser, signOut } = useAuth();

  const buyerData = {
    name: currentUser?.displayName || "Buyer",
    phone: "+91 98765 43210",
    email: currentUser?.email || "No email",
    location: "Pune, Maharashtra",
    businessType: "Biomass Energy Company",
    industry: "Renewable Energy",
    memberSince: currentUser?.metadata.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : "Jan 2024",
    totalPurchases: 8,
    totalSpent: "₹32,500"
  };

  const menuItems = [
    { icon: Settings, label: "Account Settings", path: "/buyer/settings" },
    { icon: Shield, label: "Privacy & Security", path: "/buyer/privacy" },
    { icon: HelpCircle, label: "Help & Support", path: "/buyer/help" },
    { icon: LogOut, label: "Logout", path: "/auth", action: "logout" },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link to="/buyer/dashboard" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Profile</h1>
            <p className="text-sm text-muted-foreground">Manage your account</p>
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="px-4 py-6">
        <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl p-6 text-secondary-foreground relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 pattern-grid opacity-10" />

          <div className="relative z-10">
            <div className="flex items-end gap-4 mb-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-secondary-foreground/20 flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-secondary-foreground" />
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <Camera className="w-4 h-4 text-accent-foreground" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{buyerData.name}</h2>
                <p className="text-secondary-foreground/70">{buyerData.businessType}</p>
              </div>
              <Button variant="ghost" size="icon" className="w-10 h-10 bg-secondary-foreground/10 hover:bg-secondary-foreground/20">
                <Edit className="w-5 h-5 text-secondary-foreground" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-secondary-foreground/20">
              <div>
                <p className="text-xs text-secondary-foreground/70 uppercase tracking-wide">Member Since</p>
                <p className="font-semibold">{buyerData.memberSince}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-foreground/70 uppercase tracking-wide">Total Purchases</p>
                <p className="font-semibold">{buyerData.totalPurchases}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
            <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-foreground">{buyerData.totalSpent}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
            <p className="text-sm text-muted-foreground mb-1">Industry</p>
            <p className="text-2xl font-bold text-foreground">{buyerData.industry}</p>
          </div>
        </div>
      </div>

      {/* Business Info */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Business Information</h3>
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Building2 className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Business Type</p>
              <p className="font-medium text-foreground">{buyerData.businessType}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Phone className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium text-foreground">{buyerData.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Mail className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">{buyerData.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <MapPin className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium text-foreground">{buyerData.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Settings</h3>
        <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
          {menuItems.map((item, index) => (
            <div
              key={item.label}
              onClick={item.action === "logout" ? handleLogout : undefined}
              className={`flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors ${index !== menuItems.length - 1 ? "border-b border-border" : ""
                }`}
            >
              {item.action !== "logout" ? (
                <Link to={item.path} className="flex items-center gap-4 w-full">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.label}</p>
                  </div>
                </Link>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.label}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <BuyerBottomNav />
    </div>
  );
};

export default BuyerProfile;