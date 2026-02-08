import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, MapPin, Sparkles, Bookmark, Package, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BuyerBottomNav from "@/components/BuyerBottomNav";
import { useListings } from "@/context/ListingsContext";

const BuyerListings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    location: "all",
    price: "all",
    quality: "all"
  });
  const { buyerListings: listings, toggleBookmark } = useListings();

  const filters = [
    { id: "all", label: "All Types" },
    { id: "Rice Husk", label: "Rice Husk" },
    { id: "Wheat Straw", label: "Wheat Straw" },
    { id: "Sugarcane", label: "Sugarcane" },
    { id: "Cotton", label: "Cotton" },
  ];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.farmerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedFilter === "all" || listing.title === selectedFilter;

    const matchesLocation = activeFilters.location === "all" ||
      listing.location.toLowerCase().includes(activeFilters.location.toLowerCase());

    const matchesQuality = activeFilters.quality === "all" ||
      listing.quality === activeFilters.quality;

    const priceNum = parseFloat(listing.price);
    let matchesPrice = true;
    if (activeFilters.price === "Below ₹3/kg") matchesPrice = priceNum < 3;
    else if (activeFilters.price === "₹3-5/kg") matchesPrice = priceNum >= 3 && priceNum <= 5;
    else if (activeFilters.price === "Above ₹5/kg") matchesPrice = priceNum > 5;

    return matchesSearch && matchesType && matchesLocation && matchesQuality && matchesPrice;
  });

  const filterOptions = [
    { id: "location", label: "Location", options: ["Pune", "Mumbai", "Nashik", "Nagpur"] },
    { id: "price", label: "Price Range", options: ["Below ₹3/kg", "₹3-5/kg", "Above ₹5/kg"] },
    { id: "quality", label: "Quality", options: ["Excellent", "Good", "Average"] },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-secondary px-4 pt-safe-top">
        <div className="py-4">
          <p className="text-secondary-foreground/70 text-sm">Browse Listings</p>
          <h1 className="text-xl font-bold text-secondary-foreground">Agricultural Waste</h1>
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
          <span className="font-semibold text-foreground">{filteredListings.length}</span> listings found
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4 mr-1" />
          Filters
          <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="px-4 mb-4">
          <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Filter Options</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {filterOptions.map((filter) => (
                <div key={filter.id}>
                  <p className="text-sm font-medium text-foreground mb-2">{filter.label}</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveFilters({ ...activeFilters, [filter.id]: "all" })}
                      className={`px-3 py-1.5 text-sm rounded-full transition-colors ${activeFilters[filter.id as keyof typeof activeFilters] === "all"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted hover:bg-muted/80"
                        }`}
                    >
                      All
                    </button>
                    {filter.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => setActiveFilters({ ...activeFilters, [filter.id]: option })}
                        className={`px-3 py-1.5 text-sm rounded-full transition-colors ${activeFilters[filter.id as keyof typeof activeFilters] === option
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted hover:bg-muted/80"
                          }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="secondary" className="flex-1" onClick={() => setShowFilters(false)}>Close</Button>
              <Button variant="outline" className="flex-1" onClick={() => setActiveFilters({ location: "all", price: "all", quality: "all" })}>Reset</Button>
            </div>
          </div>
        </div>
      )}

      {/* Listings Grid */}
      <div className="px-4 grid gap-4">
        {filteredListings.map((listing) => (
          <div
            key={listing.id}
            className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all hover:-translate-y-0.5"
          >
            <Link to={`/buyer/listing/${listing.id}`} className="block">
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
                      onClick={(e) => {
                        e.preventDefault();
                        toggleBookmark(listing.id);
                      }}
                      className={`p-2 -m-2 transition-colors ${listing.isBookmarked
                        ? "text-secondary"
                        : "text-muted-foreground hover:text-secondary"
                        }`}
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

                  <p className="text-xs text-muted-foreground mt-2">
                    Listed by {listing.farmerName}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <BuyerBottomNav />
    </div>
  );
};

export default BuyerListings;