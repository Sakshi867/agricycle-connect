import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, HelpCircle, MessageSquare, Search, BookOpen, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BuyerBottomNav from "@/components/BuyerBottomNav";
import { Input } from "@/components/ui/input";

const BuyerHelp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const faqs = [
    {
      question: "How do I search for products?",
      answer: "Use the search bar or browse categories to find products. You can filter by location, price, and other criteria to find what you need."
    },
    {
      question: "How do I place an order?",
      answer: "Browse listings, select the product you want, specify the quantity, and click 'Send Inquiry' to connect with the seller."
    },
    {
      question: "How do I track my orders?",
      answer: "Visit the 'My Orders' section in your dashboard to see the status of your purchases and communicate with sellers."
    },
    {
      question: "How do I make payments?",
      answer: "Payments are processed securely through our platform. You can use various payment methods depending on what the seller accepts."
    }
  ];

  const helpTopics = [
    { title: "Getting Started", icon: BookOpen, path: "/buyer/help/getting-started" },
    { title: "Searching Products", icon: Search, path: "/buyer/help/searching" },
    { title: "Making Purchases", icon: Star, path: "/buyer/help/purchasing" },
    { title: "Account Settings", icon: HelpCircle, path: "/buyer/help/account" },
    { title: "Troubleshooting", icon: MessageSquare, path: "/buyer/help/troubleshooting" }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link to="/buyer/settings" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Help Center</h1>
            <p className="text-sm text-muted-foreground">Find answers to your questions</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Search Bar */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Help Topics */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Popular Topics</h2>
          
          <div className="space-y-2">
            {helpTopics.map((topic, index) => (
              <Link
                key={index}
                to={topic.path}
                className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <topic.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="font-medium text-foreground">{topic.title}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-border last:border-0 pb-4 last:pb-0">
                <h3 className="font-medium text-foreground mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Contact Support</h2>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Still need help? Our support team is here to assist you.
            </p>
            
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Contact Support
            </Button>
            
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                Response time: Usually within 24 hours
              </p>
            </div>
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
};

export default BuyerHelp;