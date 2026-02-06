import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import FarmerBottomNav from "@/components/FarmerBottomNav";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const FarmerContact = () => {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: currentUser?.displayName || "",
    email: currentUser?.email || "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.displayName || prev.name,
        email: currentUser.email || prev.email
      }));
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Contact form submitted:", formData);
    // Reset form
    setFormData({
      name: formData.name,
      email: formData.email,
      subject: "",
      message: ""
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link to="/farmer/settings" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Contact Us</h1>
            <p className="text-sm text-muted-foreground">Get in touch with our support team</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Contact Information */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Contact Information</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Email</p>
                <p className="text-sm text-muted-foreground">support@agricycleconnect.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Phone className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Phone</p>
                <p className="text-sm text-muted-foreground">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <MapPin className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Office</p>
                <p className="text-sm text-muted-foreground">Pune, Maharashtra, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Business Hours</h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-foreground">Monday - Friday</span>
              <span className="text-muted-foreground">9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground">Saturday</span>
              <span className="text-muted-foreground">10:00 AM - 2:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground">Sunday</span>
              <span className="text-muted-foreground">Closed</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Send us a message</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                readOnly
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email address"
                readOnly
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">
                Subject
              </label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject of your message"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message..."
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </form>
        </div>

        {/* Emergency Support */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Emergency Support</h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">For urgent matters</p>
                <p className="text-sm text-muted-foreground">If you have an urgent issue that needs immediate attention, please call our emergency support line.</p>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Call Emergency Support
            </Button>
          </div>
        </div>
      </main>

      <FarmerBottomNav />
    </div>
  );
};

export default FarmerContact;