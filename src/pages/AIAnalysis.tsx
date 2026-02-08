import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles, Check, Loader2, Leaf, TrendingUp, Factory, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { analyzeWasteImage } from "@/services/ai";

const AIAnalysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const imageUrl = location.state?.image || "/placeholder.svg";

  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState({
    wasteType: "Unknown",
    quality: "Unknown",
    confidence: 0,
    suggestedPrice: "Calculating...",
    industries: [] as string[],
    estimatedWeight: "Calculating...",
  });

  useEffect(() => {
    analyzeImageFunc();
  }, []);

  const analyzeImageFunc = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);

      // Convert data URL to blob with error handling
      let blob;
      try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }
        blob = await response.blob();
      } catch (fetchError) {
        console.error('Image fetch error:', fetchError);
        throw new Error('Failed to load image for analysis');
      }

      // Use the new AI service directly
      const result = await analyzeWasteImage(blob, 'waste-image.jpg');

      if (!result.success) {
        throw new Error(result.error || 'Analysis failed');
      }

      // Update results mapping to match new service output
      setAnalysisResults({
        wasteType: result.wasteType,
        quality: result.quality,
        confidence: result.confidence,
        suggestedPrice: result.suggestedPrice,
        industries: result.industries || [],
        estimatedWeight: result.estimatedWeight,
      });

      setIsAnalyzing(false);
      setAnalysisComplete(true);

      toast({
        title: "Analysis Complete! 🎉",
        description: `Identified as ${result.wasteType} with ${result.confidence}% confidence`,
      });

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
      setIsAnalyzing(false);

      // Fallback results
      setAnalysisResults({
        wasteType: "Rice Husk",
        quality: "Good",
        confidence: 88,
        suggestedPrice: "₹4 - ₹6 per kg",
        industries: ["Biomass Energy", "Composting", "Animal Feed"],
        estimatedWeight: "200-800 kg",
      });
      setAnalysisComplete(true);

      toast({
        title: "Analysis Completed with Fallback",
        description: "Using default values due to API error",
        variant: "destructive",
      });
    }
  };

  const handleContinue = () => {
    navigate("/farmer/listing-details", { state: { analysis: analysisResults, image: imageUrl } });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Image with overlay */}
      <div className="relative h-[40vh] overflow-hidden">
        <img
          src={imageUrl}
          alt="Waste analysis"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 to-background" />

        {/* Scan Animation */}
        {isAnalyzing && (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-4 border-accent animate-ping opacity-30" />
            </div>
            <div
              className="absolute left-0 right-0 h-1 bg-accent animate-scan"
              style={{ boxShadow: "0 0 20px 10px rgba(232, 184, 74, 0.3)" }}
            />
          </>
        )}

        {/* Analyzing Badge */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md ${error ? "bg-destructive text-destructive-foreground" :
            analysisComplete ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
            }`}>
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Analyzing with Gemini AI...</span>
              </>
            ) : error ? (
              <>
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Analysis Error</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Analysis Complete</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-accent mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-semibold">AI Analysis Results</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {analysisComplete ? analysisResults.wasteType : "Analyzing..."}
          </h1>
        </div>

        {analysisComplete && !error && (
          <div className="stagger-children space-y-4">
            {/* Confidence & Quality */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">AI Confidence</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${analysisResults.confidence}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold text-primary">{analysisResults.confidence}%</span>
                </div>
              </div>
              <div className="bg-accent/10 rounded-2xl p-4 border border-accent/30">
                <p className="text-sm text-muted-foreground mb-1">Quality</p>
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-accent" />
                  <span className="text-lg font-bold text-foreground">{analysisResults.quality}</span>
                </div>
              </div>
            </div>

            {/* Price Suggestion */}
            <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Suggested Price Range</p>
                  <p className="text-xl font-bold text-foreground">{analysisResults.suggestedPrice}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Based on current market rates and waste quality
              </p>
            </div>

            {/* Industries */}
            <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Factory className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Potential Industries</p>
                  <p className="font-semibold text-foreground">Who might buy this</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisResults.industries.map((industry) => (
                  <span
                    key={industry}
                    className="px-3 py-1.5 bg-muted rounded-full text-sm font-medium text-foreground"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>

            {/* Estimated Weight */}
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">Estimated Quantity</p>
              <p className="text-lg font-semibold text-foreground">{analysisResults.estimatedWeight}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Analysis Error</h3>
                <p className="text-sm text-muted-foreground mb-3">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={analyzeImageFunc}
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 safe-bottom">
        <Button
          variant="farmer"
          size="xl"
          className="w-full"
          onClick={handleContinue}
          disabled={!analysisComplete || isAnalyzing}
        >
          Continue to Listing
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default AIAnalysis;
