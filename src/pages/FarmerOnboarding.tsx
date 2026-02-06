import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Globe, Camera, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";

const FarmerOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    name: "",
    language: "en",
    state: "",
    district: "",
  });

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी" },
    { code: "mr", label: "मराठी" },
    { code: "pa", label: "ਪੰਜਾਬੀ" },
    { code: "ta", label: "தமிழ்" },
    { code: "te", label: "తెలుగు" },
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate("/farmer/dashboard");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex flex-col">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="container mx-auto">
          <Logo />
        </div>
      </header>

      {/* Progress */}
      <div className="px-4">
        <div className="container mx-auto max-w-lg">
          <div className="flex items-center gap-2 mb-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i < step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Step {step} of {totalSteps}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="bg-card rounded-3xl shadow-elevated p-8">
            {/* Step 1: Basic Details */}
            {step === 1 && (
              <div className="animate-fade-in">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Globe className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Welcome, Farmer!
                </h2>
                <p className="text-muted-foreground mb-8">
                  Let's set up your profile. Choose your preferred language.
                </p>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label>Preferred Language</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => setFormData({ ...formData, language: lang.code })}
                          className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            formData.language === lang.code
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <div className="animate-fade-in">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <MapPin className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Your Location
                </h2>
                <p className="text-muted-foreground mb-8">
                  This helps buyers find your listings nearby.
                </p>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="e.g., Maharashtra"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      placeholder="e.g., Pune"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>

                  <Button variant="outline" className="w-full" type="button">
                    <MapPin className="w-4 h-4" />
                    Detect My Location
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: How It Works */}
            {step === 3 && (
              <div className="animate-fade-in">
                <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-6">
                  <Camera className="w-7 h-7 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  You're All Set!
                </h2>
                <p className="text-muted-foreground mb-8">
                  Here's how easy it is to create your first listing:
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    "Take a photo of your agricultural waste",
                    "Our AI will identify the type and suggest pricing",
                    "Review and publish your listing",
                    "Buyers will contact you directly",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              <Button variant="farmer" onClick={handleNext} className="flex-1">
                {step === totalSteps ? "Start Listing" : "Continue"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerOnboarding;
