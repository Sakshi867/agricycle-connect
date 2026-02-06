import { Link } from "react-router-dom";
import { ArrowLeft, Package, TrendingUp, MapPin, Calendar, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FarmerBottomNav from "@/components/FarmerBottomNav";
import { useListings } from "@/context/ListingsContext";

const FarmerListings = () => {
  const { farmerListings: listings, updateListing } = useListings();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: "bg-primary/10", text: "text-primary", label: "Active" },
      sold: { bg: "bg-secondary/10", text: "text-secondary", label: "Sold" },
      draft: { bg: "bg-muted", text: "text-muted-foreground", label: "Draft" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleDelete = (id: number) => {
    updateListing(id, { status: "draft" });
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
            <h1 className="text-lg font-semibold text-foreground">My Listings</h1>
            <p className="text-sm text-muted-foreground">Manage your waste listings</p>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-primary/5 rounded-2xl p-4 text-center border border-primary/20">
            <p className="text-2xl font-bold text-primary">3</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div className="bg-secondary/5 rounded-2xl p-4 text-center border border-secondary/20">
            <p className="text-2xl font-bold text-secondary">1</p>
            <p className="text-xs text-muted-foreground">Sold</p>
          </div>
          <div className="bg-muted rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-foreground">1</p>
            <p className="text-xs text-muted-foreground">Draft</p>
          </div>
        </div>
      </div>

      {/* Listings List */}
      <div className="px-4 pb-6">
        <div className="space-y-4">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-card rounded-2xl p-5 shadow-card border border-border">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center">
                    <Package className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{listing.title}</h3>
                      {getStatusBadge(listing.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {listing.quantity} {listing.unit} • ₹{listing.price}/{listing.unit}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {listing.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {listing.date}
                      </div>
                    </div>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{listing.inquiries}</span>
                  <span className="text-sm text-muted-foreground">inquiries</span>
                </div>
                <div className="flex items-center gap-2">
                  {listing.status === "active" && (
                    <>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </>
                  )}
                  {listing.status === "draft" && (
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                      <Edit className="w-4 h-4 mr-1" />
                      Complete
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(listing.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FarmerBottomNav />
    </div>
  );
};

export default FarmerListings;