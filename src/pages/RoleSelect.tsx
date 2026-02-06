import { Link, useNavigate } from "react-router-dom";
import { Tractor, Building2, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const RoleSelect = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: "farmer",
      icon: Tractor,
      title: "I am a Farmer",
      subtitle: "Sell Agricultural Waste",
      description: "List your crop residues, husks, and other farm waste. Get fair prices from verified buyers.",
      benefits: [
        "AI-powered pricing suggestions",
        "Direct buyer connections",
        "Earn from waste you'd discard",
      ],
      color: "primary",
      path: "/auth?role=farmer",
    },
    {
      id: "buyer",
      icon: Building2,
      title: "I am a Buyer",
      subtitle: "Source Agri-Waste for Business",
      description: "Find quality agricultural waste for biomass, composting, packaging, and more.",
      benefits: [
        "Verified quality listings",
        "AI quality assessments",
        "Sustainable sourcing",
      ],
      color: "secondary",
      path: "/auth?role=buyer",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-warm flex flex-col">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="container mx-auto">
          <Logo />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Choose Your Role
            </h1>
            <p className="text-muted-foreground">
              Select how you'd like to use KrishiProfit
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => navigate(role.path)}
                className={`group relative bg-card rounded-3xl p-8 text-left shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-${role.color}/30`}
              >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${role.id === "farmer" ? "bg-primary/10" : "bg-secondary/10"} flex items-center justify-center mb-6`}>
                  <role.icon className={`w-8 h-8 ${role.id === "farmer" ? "text-primary" : "text-secondary"}`} />
                </div>

                {/* Content */}
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {role.title}
                </h2>
                <p className={`text-sm font-semibold ${role.id === "farmer" ? "text-primary" : "text-secondary"} mb-3`}>
                  {role.subtitle}
                </p>
                <p className="text-muted-foreground text-sm mb-6">
                  {role.description}
                </p>

                {/* Benefits */}
                <ul className="space-y-2 mb-6">
                  {role.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className={`inline-flex items-center gap-2 font-semibold ${role.id === "farmer" ? "text-primary" : "text-secondary"}`}>
                  Continue
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>

          {/* Already have account */}
          <p className="text-center mt-8 text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link to="/auth" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default RoleSelect;
