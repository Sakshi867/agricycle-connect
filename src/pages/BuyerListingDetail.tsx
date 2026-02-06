import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Sparkles, User, MessageSquare, Phone, Bookmark, Share2, Package, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const BuyerListingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  // Mock listing data
  const listing = {
    id: id,
    title: "Rice Husk",
    quantity: "500 kg",
    price: "₹5/kg",
    totalValue: "₹2,500",
    location: "Pune, Maharashtra",
    quality: "Good",
    confidence: 94,
    farmerName: "Rajesh Kumar",
    farmerRating: 4.8,
    description: "Fresh rice husk from recent harvest. Clean and dry, suitable for biomass energy, animal bedding, or composting.",
    availability: "Immediate",
    industries: ["Biomass Energy", "Animal Bedding", "Composting"],
    image: "/placeholder.svg",
  };

  const handleContact = () => {
    toast({
      title: "Contact Request Sent",
      description: "The farmer will receive your inquiry shortly.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Added to Shortlist",
      description: "This listing has been saved to your shortlist.",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Image Header */}
      <div className="relative h-64 bg-muted">
        <div className="absolute inset-0 flex items-center justify-center">
          <Package className="w-20 h-20 text-muted-foreground" />
        </div>

        {/* Top Actions */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-md"
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-md">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            {listing.confidence}% AI Verified
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Title & Price */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{listing.title}</h1>
              <p className="text-muted-foreground">{listing.quantity}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-secondary">{listing.price}</p>
              <p className="text-sm text-muted-foreground">Total: {listing.totalValue}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              listing.quality === "Excellent"
                ? "bg-primary/10 text-primary"
                : "bg-accent/20 text-accent-foreground"
            }`}>
              {listing.quality} Quality
            </span>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {listing.location}
            </div>
          </div>
        </div>

        {/* Farmer Info */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{listing.farmerName}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>⭐ {listing.farmerRating}</span>
                <span>•</span>
                <span>Verified Farmer</span>
              </div>
            </div>
            <CheckCircle className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-semibold text-foreground mb-2">Description</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{listing.description}</p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Availability</span>
            </div>
            <p className="font-semibold text-foreground">{listing.availability}</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">AI Confidence</span>
            </div>
            <p className="font-semibold text-foreground">{listing.confidence}%</p>
          </div>
        </div>

        {/* Industries */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Suitable For</h3>
          <div className="flex flex-wrap gap-2">
            {listing.industries.map((industry) => (
              <span
                key={industry}
                className="px-3 py-1.5 bg-secondary/10 text-secondary rounded-full text-sm font-medium"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 safe-bottom">
        <div className="flex gap-3">
          <Button variant="outline" size="lg" className="flex-1" onClick={handleContact}>
            <Phone className="w-4 h-4" />
            Call
          </Button>
          <Button variant="buyer" size="lg" className="flex-[2]" onClick={handleContact}>
            <MessageSquare className="w-4 h-4" />
            Contact Farmer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuyerListingDetail;
