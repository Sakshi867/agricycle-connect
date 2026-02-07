import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Package, MapPin, Sparkles, Bookmark, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import BuyerBottomNav from "@/components/BuyerBottomNav";
import { useListings } from "@/context/ListingsContext";

const BuyerShortlist = () => {
  const navigate = useNavigate();
  const { buyerListings, toggleBookmark } = useListings();

  const shortlistedItems = buyerListings.filter(item => item.isBookmarked);
  const uniqueSellers = new Set(shortlistedItems.map(item => item.farmerId)).size;
  const totalValue = shortlistedItems.reduce((sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.price) || 0), 0);

  const contactSeller = (id: string) => {
    navigate(`/buyer/listing/${id}`);
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
            <h1 className="text-lg font-semibold text-foreground">Shortlist</h1>
            <p className="text-sm text-muted-foreground">{shortlistedItems.length} items saved</p>
          </div>
        </div>
      </header>

      {shortlistedItems.length > 0 ? (
        <>
          {/* Stats */}
          <div className="px-4 py-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-secondary/5 rounded-2xl p-4 text-center border border-secondary/20">
                <p className="text-2xl font-bold text-secondary">{shortlistedItems.length}</p>
                <p className="text-xs text-muted-foreground">Items</p>
              </div>
              <div className="bg-primary/5 rounded-2xl p-4 text-center border border-primary/20">
                <p className="text-2xl font-bold text-primary">{uniqueSellers}</p>
                <p className="text-xs text-muted-foreground">Sellers</p>
              </div>
              <div className="bg-accent/10 rounded-2xl p-4 text-center border border-accent/30">
                <p className="text-2xl font-bold text-accent">₹{(totalValue / 1000).toFixed(1)}k</p>
                <p className="text-xs text-muted-foreground">Est. Value</p>
              </div>
            </div>
          </div>

          {/* Shortlist Items */}
          <div className="px-4 pb-6">
            <div className="space-y-4">
              {shortlistedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-2xl overflow-hidden shadow-card border border-border"
                >
                  <Link to={`/buyer/listing/${item.id}`} className="block">
                    <div className="flex">
                      {/* Image */}
                      <div className="w-28 h-28 bg-muted flex items-center justify-center flex-shrink-0">
                        <Package className="w-10 h-10 text-muted-foreground" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.quantity} {item.unit}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleBookmark(item.id);
                            }}
                            className="p-2 -m-2 text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-secondary">₹{item.price}/{item.unit}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.quality === "Excellent"
                              ? "bg-primary/10 text-primary"
                              : item.quality === "Good"
                                ? "bg-accent/20 text-accent-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}>
                            {item.quality}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                          <MapPin className="w-3 h-3" />
                          {item.location}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-accent">
                            <Sparkles className="w-3 h-3" />
                            {item.confidence}% AI
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {item.farmerName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Action Buttons */}
                  <div className="px-4 py-3 bg-muted/30 border-t border-border flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => contactSeller(item.id)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Contact Seller
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => toggleBookmark(item.id)}
                    >
                      <Bookmark className="w-4 h-4 mr-2 fill-current" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="px-4 py-12 text-center">
          <div className="w-24 h-24 rounded-2xl bg-muted mx-auto flex items-center justify-center mb-4">
            <Bookmark className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Your shortlist is empty</h3>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
            Save items you're interested in by tapping the bookmark icon on listings
          </p>
          <Link to="/buyer/dashboard">
            <Button variant="secondary">Browse Listings</Button>
          </Link>
        </div>
      )}

      <BuyerBottomNav />
    </div>
  );
};

export default BuyerShortlist;