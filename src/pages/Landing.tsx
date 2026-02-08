import { Link, useNavigate } from "react-router-dom";
import { Camera, Sparkles, Building2, ArrowRight, Leaf, Recycle, Users, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import heroBg from "@/assets/hero-bg.jpg";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const { currentUser, role } = useAuth();

  useEffect(() => {
    if (currentUser && role) {
      navigate(`/${role}/dashboard`);
    }
  }, [currentUser, role, navigate]);
  const howItWorks = [
    {
      icon: Camera,
      title: "Capture Your Waste",
      description: "Take a photo of your agricultural waste using your phone. Our AI does the rest.",
    },
    {
      icon: Sparkles,
      title: "AI Analysis",
      description: "Our smart AI identifies the waste type, quality, and suggests the best price.",
    },
    {
      icon: Building2,
      title: "Connect with Buyers",
      description: "Industries find your listing and connect directly. You earn, they source sustainably.",
    },
  ];

  const impactStats = [
    { value: 15000, suffix: "+", label: "Farmers Empowered", icon: Users },
    { value: 50000, suffix: " tons", label: "Waste Reused", icon: Recycle },
    { value: 25, suffix: " Cr+", label: "Farmer Earnings", icon: TrendingUp },
    { value: 30, suffix: "%", label: "Carbon Reduced", icon: Leaf },
  ];

  const benefits = [
    "Zero cost to list your waste",
    "Fair prices powered by AI",
    "Direct buyer connections",
    "Support in your language",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header variant="transparent" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/90" />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-accent/20 blur-xl animate-float" />
        <div className="absolute bottom-1/3 right-16 w-32 h-32 rounded-full bg-secondary/20 blur-2xl animate-float" style={{ animationDelay: "1s" }} />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-32 text-center">
          <div className="max-w-4xl mx-auto stagger-children">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Leaf className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-primary-foreground">India's #1 Agri-Waste Marketplace</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Turn Agricultural Waste{" "}
              <span className="text-accent">Into Income</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Snap a photo of your farm waste. Our AI finds buyers from sustainable industries.
              You earn money while reducing pollution.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button variant="hero" size="xl" asChild>
                <Link to="/role-select">
                  <Users className="w-5 h-5" />
                  I am a Farmer
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/role-select">
                  <Building2 className="w-5 h-5" />
                  I am a Buyer
                </Link>
              </Button>
            </div>

            {/* Quick benefits */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-primary-foreground/50 animate-pulse" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-28 bg-gradient-warm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              How KrishiProfit Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to turn your agricultural waste into income. No complicated forms, just take a photo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((item, index) => (
              <div key={item.title} className="relative">
                <FeatureCard
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  step={index + 1}
                  variant="elevated"
                />
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-accent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 md:py-28 bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Impact</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mt-2 mb-4">
              Making a Difference Across India
            </h2>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto">
              Together with our farming community, we're building a sustainable future while creating real income.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {impactStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-primary-foreground/10"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-accent" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-warm pattern-dots">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Turn Waste Into Wealth?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of farmers and industries already using KrishiProfit. Start listing in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="farmer" size="xl" asChild>
                <Link to="/role-select">
                  Start as Farmer
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="buyer" size="xl" asChild>
                <Link to="/role-select">
                  Start as Buyer
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
