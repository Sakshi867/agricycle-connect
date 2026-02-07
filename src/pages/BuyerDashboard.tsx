import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, MapPin, Sparkles, Bookmark, Package, ChevronDown, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BuyerBottomNav from "@/components/BuyerBottomNav";
import { useListings } from "@/context/ListingsContext";
import { useAuth } from "@/context/AuthContext";

const BuyerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { buyerListings: listings, toggleBookmark } = useListings();
  const { currentUser } = useAuth();

  const displayName = currentUser?.displayName || "Buyer";

  const filters = [
    { id: "all", label: "All" },
    { id: "rice-husk", label: "Rice Husk" },
    { id: "wheat-straw", label: "Wheat Straw" },
    { id: "sugarcane", label: "Sugarcane" },
    { id: "cotton", label: "Cotton" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-secondary px-4 pt-safe-top">
        <div className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-foreground/70 text-sm">Welcome back,</p>
              <h1 className="text-xl font-bold text-secondary-foreground">{displayName}</h1>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-secondary-foreground/20 flex items-center justify-center overflow-hidden">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-6 h-6 text-secondary-foreground" />
              )}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="pb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search waste types, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary-foreground border-0 shadow-md"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedFilter === filter.id
                  ? "bg-secondary-foreground text-secondary"
                  : "bg-secondary-foreground/10 text-secondary-foreground hover:bg-secondary-foreground/20"
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Results Header */}
      <div className="px-4 py-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{listings.length}</span> listings found
        </p>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Filter className="w-4 h-4 mr-1" />
          Filters
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Listings Grid */}
      <div className="px-4 grid gap-4">
        {listings.map((listing) => (
          <Link
            key={listing.id}
            to={`/buyer/listing/${listing.id}`}
            className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow"
          >
            <div className="flex">
              {/* Image */}
              <div className="w-28 h-28 bg-stone-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {listing.image ? (
                  <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-10 h-10 text-muted-foreground" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{listing.title}</h3>
                    <p className="text-sm text-muted-foreground">{listing.quantity} {listing.unit}</p>
                  </div>
                  <button
                    className={`p-2 -m-2 transition-colors ${listing.isBookmarked
                      ? "text-secondary"
                      : "text-muted-foreground hover:text-secondary"
                      }`}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleBookmark(listing.id);
                    }}
                  >
                    <Bookmark className={`w-5 h-5 ${listing.isBookmarked ? "fill-current" : ""}`} />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-secondary">₹{listing.price}/{listing.unit}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${listing.quality === "Excellent"
                    ? "bg-primary/10 text-primary"
                    : listing.quality === "Good"
                      ? "bg-accent/20 text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                    }`}>
                    {listing.quality}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {listing.location}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-accent">
                    <Sparkles className="w-3 h-3" />
                    {listing.confidence}% AI
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <BuyerBottomNav />
    </div>
  );
};

export default BuyerDashboard;
