import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Package, MapPin, Calendar, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useListings } from "@/context/ListingsContext";

const ListingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { addListing } = useListings();

  const analysis = location.state?.analysis || {
    wasteType: "Rice Husk",
    suggestedPrice: "₹4 - ₹6",
    quality: "Good",
  };

  const [formData, setFormData] = useState({
    title: analysis.wasteType,
    quantity: "",
    unit: "kg",
    price: "5",
    description: "",
    availability: "immediate",
  });

  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    
    try {
      // Save listing to Firestore through context
      await addListing({
        title: formData.title,
        quantity: formData.quantity,
        unit: formData.unit,
        price: formData.price,
        description: formData.description,
        availability: formData.availability,
        quality: analysis.quality,
        location: "Pune, Maharashtra",
        image: location.state?.image || "/placeholder.svg",
      });

      // Wait a moment for Firestore sync
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Listing Published! 🎉",
        description: "Your waste listing is now live and visible to buyers.",
      });

      navigate("/farmer/dashboard");
    } catch (error) {
      console.error("Error publishing listing:", error);
      toast({
        title: "Error",
        description: "Failed to publish listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Listing Details</h1>
            <p className="text-sm text-muted-foreground">Review and publish</p>
          </div>
        </div>
      </header>

      {/* AI Badge */}
      <div className="mx-4 mt-4 bg-accent/10 border border-accent/30 rounded-xl p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-accent" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">AI-Powered Suggestions</p>
          <p className="text-xs text-muted-foreground">Fields pre-filled based on analysis</p>
        </div>
        <Check className="w-5 h-5 text-accent" />
      </div>

      {/* Form */}
      <form className="px-4 py-6 space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title">Waste Type</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1.5"
          />
        </div>

        {/* Quantity & Unit */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Enter amount"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="unit">Unit</Label>
            <select
              id="unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="mt-1.5 w-full h-11 px-3 rounded-xl border border-input bg-background text-sm"
            >
              <option value="kg">kg</option>
              <option value="ton">ton</option>
              <option value="quintal">quintal</option>
            </select>
          </div>
        </div>

        {/* Price */}
        <div>
          <Label htmlFor="price">Price per {formData.unit}</Label>
          <div className="relative mt-1.5">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="pl-8"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Suggested range: {analysis.suggestedPrice} per {formData.unit}
          </p>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Additional Details (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Any special notes for buyers..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1.5 min-h-[100px]"
          />
        </div>

        {/* Availability */}
        <div>
          <Label>Availability</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[
              { value: "immediate", label: "Immediate", icon: Calendar },
              { value: "weekly", label: "Within a Week", icon: Calendar },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, availability: option.value })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  formData.availability === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <option.icon className={`w-5 h-5 mb-2 ${
                  formData.availability === option.value ? "text-primary" : "text-muted-foreground"
                }`} />
                <p className="font-medium text-foreground">{option.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Preview Card */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <p className="text-sm text-muted-foreground mb-3">Listing Preview</p>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center">
              <Package className="w-7 h-7 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">{formData.title}</h4>
              <p className="text-sm text-muted-foreground">
                {formData.quantity || "—"} {formData.unit} • ₹{formData.price}/{formData.unit}
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                Pune, Maharashtra
              </div>
            </div>
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              {analysis.quality}
            </span>
          </div>
        </div>
      </form>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 safe-bottom">
        <Button
          variant="farmer"
          size="xl"
          className="w-full"
          onClick={handlePublish}
          disabled={!formData.quantity || isPublishing}
        >
          {isPublishing ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Check className="w-5 h-5" />
              Publish Listing
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ListingDetails;
