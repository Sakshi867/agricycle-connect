import { Link } from "react-router-dom";
import { ArrowLeft, User, MapPin, Phone, Mail, Edit, Settings, Shield, HelpCircle, LogOut, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import FarmerBottomNav from "@/components/FarmerBottomNav";
import { useAuth } from "@/context/AuthContext";

const FarmerProfile = () => {
  const { currentUser, signOut } = useAuth();

  const farmerData = {
    name: currentUser?.displayName || "Farmer",
    phone: "+91 98765 43210", // Note: Persistent fields like phone/location would need Firestore
    email: currentUser?.email || "No email",
    location: "Pune, Maharashtra",
    farmSize: "15 acres",
    crops: ["Rice", "Wheat", "Sugarcane"],
    memberSince: currentUser?.metadata.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : "Jan 2024",
    totalListings: 12,
    totalEarnings: "₹45,200"
  };

  const menuItems = [
    { icon: Settings, label: "Account Settings", path: "/farmer/settings" },
    { icon: Shield, label: "Privacy & Security", path: "/farmer/privacy" },
    { icon: HelpCircle, label: "Help & Support", path: "/farmer/help" },
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
          <Link to="/farmer/dashboard" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
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
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 pattern-dots opacity-10" />

          <div className="relative z-10">
            <div className="flex items-end gap-4 mb-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary-foreground" />
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <Camera className="w-4 h-4 text-accent-foreground" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{farmerData.name}</h2>
                <p className="text-primary-foreground/70">Farmer</p>
              </div>
              <Button variant="ghost" size="icon" className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary-foreground/20">
                <Edit className="w-5 h-5 text-primary-foreground" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary-foreground/20">
              <div>
                <p className="text-xs text-primary-foreground/70 uppercase tracking-wide">Member Since</p>
                <p className="font-semibold">{farmerData.memberSince}</p>
              </div>
              <div>
                <p className="text-xs text-primary-foreground/70 uppercase tracking-wide">Total Listings</p>
                <p className="font-semibold">{farmerData.totalListings}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
            <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
            <p className="text-2xl font-bold text-foreground">{farmerData.totalEarnings}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
            <p className="text-sm text-muted-foreground mb-1">Farm Size</p>
            <p className="text-2xl font-bold text-foreground">{farmerData.farmSize}</p>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Phone className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium text-foreground">{farmerData.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Mail className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">{farmerData.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <MapPin className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium text-foreground">{farmerData.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Crops */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Crops Grown</h3>
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <div className="flex flex-wrap gap-2">
            {farmerData.crops.map((crop, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {crop}
              </span>
            ))}
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

      <FarmerBottomNav />
    </div>
  );
};

export default FarmerProfile;