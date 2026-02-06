import { Link } from "react-router-dom";
import { Plus, Camera, Bell, TrendingUp, Package, MessageSquare, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import Logo from "@/components/Logo";
import FarmerBottomNav from "@/components/FarmerBottomNav";
import { useListings } from "@/context/ListingsContext";
import { useAuth } from "@/context/AuthContext";

const FarmerDashboard = () => {
  const { farmerListings } = useListings();
  const { currentUser } = useAuth();

  const displayName = currentUser?.displayName || "Farmer";
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);

  const activeListings = farmerListings.filter(l => l.status === "active").length;
  const totalInquiries = farmerListings.reduce((sum, l) => sum + (l.inquiries || 0), 0);

  const stats = [
    { value: activeListings.toString(), label: "Active Listings", icon: <Package className="w-5 h-5" />, variant: "primary" as const },
    { value: totalInquiries.toString(), label: "Buyer Inquiries", icon: <MessageSquare className="w-5 h-5" />, variant: "secondary" as const },
    { value: "₹12,500", label: "Estimated Earnings", icon: <TrendingUp className="w-5 h-5" />, variant: "accent" as const },
  ];

  const recentListings = farmerListings
    .filter(l => l.status === "active")
    .slice(0, 3)
    .map(l => ({
      id: l.id,
      name: l.title,
      quantity: `${l.quantity} ${l.unit}`,
      status: l.status,
      inquiries: l.inquiries || 0,
      price: `₹${l.price}/${l.unit}`
    }));

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Simple Header */}
      <header className="bg-emerald-700 px-4 pt-safe-top">
        <div className="flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-emerald-100 text-sm">Welcome back,</p>
              <h1 className="text-xl font-bold text-white">{displayName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
              <span className="text-white font-bold">{initials}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              icon={stat.icon}
              variant={stat.variant}
            />
          ))}
        </div>

        {/* Create Listing Button */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
          <Link to="/farmer/create">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 rounded-xl">
              <Plus className="w-5 h-5 mr-2" />
              Create New Listing
            </Button>
          </Link>
        </div>

        {/* Recent Listings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Recent Listings</h2>
            <Link to="/farmer/listings" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentListings.map((listing) => (
              <Link
                key={listing.id}
                to={`/farmer/listing/${listing.id}`}
                className="block bg-white rounded-xl p-4 shadow-sm border border-stone-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center">
                    <Package className="w-6 h-6 text-stone-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-stone-800">{listing.name}</h3>
                    <p className="text-stone-600 text-sm">
                      {listing.quantity} • {listing.price}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                        {listing.inquiries} inquiries
                      </span>
                    </div>
                  </div>
                  <div className="text-stone-400">
                    <Camera className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <FarmerBottomNav />
    </div>
  );
};

export default FarmerDashboard;