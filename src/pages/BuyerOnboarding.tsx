import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Factory, Leaf, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";

const BuyerOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 2;

  const [formData, setFormData] = useState({
    companyName: "",
    industryType: "",
    wasteUsage: "",
  });

  const industries = [
    { id: "biomass", label: "Biomass Energy", icon: Leaf },
    { id: "composting", label: "Composting", icon: Leaf },
    { id: "packaging", label: "Packaging", icon: Factory },
    { id: "animal-feed", label: "Animal Feed", icon: Factory },
    { id: "textiles", label: "Textiles", icon: Factory },
    { id: "other", label: "Other", icon: Building2 },
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate("/buyer/dashboard");
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
                  i < step ? "bg-secondary" : "bg-muted"
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
            {/* Step 1: Company Details */}
            {step === 1 && (
              <div className="animate-fade-in">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                  <Building2 className="w-7 h-7 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Tell Us About Your Business
                </h2>
                <p className="text-muted-foreground mb-8">
                  Help us match you with the right waste suppliers.
                </p>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="Enter your company name"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label>Industry Type</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {industries.map((industry) => (
                        <button
                          key={industry.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, industryType: industry.id })}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            formData.industryType === industry.id
                              ? "border-secondary bg-secondary/5"
                              : "border-border hover:border-secondary/30"
                          }`}
                        >
                          <industry.icon className={`w-5 h-5 mb-2 ${
                            formData.industryType === industry.id ? "text-secondary" : "text-muted-foreground"
                          }`} />
                          <p className="text-sm font-medium text-foreground">{industry.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Waste Usage */}
            {step === 2 && (
              <div className="animate-fade-in">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                  <Leaf className="w-7 h-7 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  How Will You Use the Waste?
                </h2>
                <p className="text-muted-foreground mb-8">
                  This helps farmers understand your needs better.
                </p>

                <div>
                  <Label htmlFor="wasteUsage">Intended Usage</Label>
                  <textarea
                    id="wasteUsage"
                    placeholder="Describe how you plan to use agricultural waste..."
                    value={formData.wasteUsage}
                    onChange={(e) => setFormData({ ...formData, wasteUsage: e.target.value })}
                    className="mt-1.5 w-full min-h-[150px] px-3 py-2 rounded-xl border border-input bg-background text-sm resize-none"
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              <Button variant="buyer" onClick={handleNext} className="flex-1">
                {step === totalSteps ? "Start Discovering" : "Continue"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuyerOnboarding;
