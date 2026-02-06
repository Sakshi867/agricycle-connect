import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, MapPin, Phone, Mail, Globe, Languages, Shield, Bell, CreditCard, HelpCircle, LogOut, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import FarmerBottomNav from "@/components/FarmerBottomNav";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface NotificationsState {
  listingUpdates: boolean;
  inquiryAlerts: boolean;
  marketPrices: boolean;
  promotional: boolean;
}

interface ProfileDataState {
  name: string;
  phone: string;
  email: string;
  location: string;
  farmSize: string;
  crops: string[];
}

interface ErrorsState {
  name?: string;
  email?: string;
  phone?: string;
}

const FarmerSettings = () => {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();

  const [notifications, setNotifications] = useState<NotificationsState>({
    listingUpdates: true,
    inquiryAlerts: true,
    marketPrices: false,
    promotional: true
  });

  const [profileData, setProfileData] = useState<ProfileDataState>({
    name: currentUser?.displayName || "",
    phone: "+91 98765 43210",
    email: currentUser?.email || "",
    location: "Pune, Maharashtra",
    farmSize: "15 acres",
    crops: ["Rice", "Wheat", "Sugarcane"]
  });

  useEffect(() => {
    if (currentUser) {
      setProfileData(prev => ({
        ...prev,
        name: currentUser.displayName || prev.name,
        email: currentUser.email || prev.email
      }));
    }
  }, [currentUser]);

  const [saving, setSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorsState>({});

  const validateForm = (): boolean => {
    const newErrors: ErrorsState = {};

    if (!profileData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!profileData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!profileData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;

    setSaving(true);

    try {
      // Simulate API call to save profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real application, you would call an API here
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profileData)
      // });

      // if (response.ok) {
      toast({
        title: "Success!",
        description: "Your profile has been updated successfully.",
      });
      // You might want to update the user context here
      // setUserContext(prev => ({...prev, ...profileData}));
      // } else {
      //   throw new Error('Failed to update profile');
      // }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationChange = (field: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link to="/farmer/profile" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your preferences</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Account Settings */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Account Settings</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="Full Name"
                  className={`${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="Email Address"
                  className={`${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Phone className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <Input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="Phone Number"
                  className={`${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <MapPin className="w-5 h-5 text-muted-foreground" />
              </div>
              <Input
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                placeholder="Location"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Globe className="w-5 h-5 text-muted-foreground" />
              </div>
              <Input
                value={profileData.farmSize}
                onChange={(e) => setProfileData({ ...profileData, farmSize: e.target.value })}
                placeholder="Farm Size"
              />
            </div>
          </div>

          <Button
            onClick={handleSaveProfile}
            className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Save Changes
          </Button>
        </div>

        {/* Notification Settings */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Notifications</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Listing Updates</p>
                  <p className="text-sm text-muted-foreground">Get notified when your listings receive updates</p>
                </div>
              </div>
              <Switch
                checked={notifications.listingUpdates}
                onCheckedChange={() => handleNotificationChange('listingUpdates')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Inquiry Alerts</p>
                  <p className="text-sm text-muted-foreground">Receive alerts when buyers inquire about your products</p>
                </div>
              </div>
              <Switch
                checked={notifications.inquiryAlerts}
                onCheckedChange={() => handleNotificationChange('inquiryAlerts')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Market Prices</p>
                  <p className="text-sm text-muted-foreground">Get updates on market prices for your crops</p>
                </div>
              </div>
              <Switch
                checked={notifications.marketPrices}
                onCheckedChange={() => handleNotificationChange('marketPrices')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Promotional</p>
                  <p className="text-sm text-muted-foreground">Receive promotional offers and updates</p>
                </div>
              </div>
              <Switch
                checked={notifications.promotional}
                onCheckedChange={() => handleNotificationChange('promotional')}
              />
            </div>
          </div>
        </div>

        {/* Language & Region */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Language & Region</h2>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Languages className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Language</p>
                <p className="text-sm text-muted-foreground">English (India)</p>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">Change</span>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Privacy & Security</h2>

          <div className="space-y-3">
            <Link to="/farmer/privacy" className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Privacy Policy</span>
              </div>
              <span className="text-sm text-muted-foreground">View</span>
            </Link>

            <Link to="/farmer/security" className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Security Settings</span>
              </div>
              <span className="text-sm text-muted-foreground">Manage</span>
            </Link>
          </div>
        </div>

        {/* Help & Support */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Help & Support</h2>

          <div className="space-y-3">
            <Link to="/farmer/help" className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Help Center</span>
              </div>
              <span className="text-sm text-muted-foreground">Get help</span>
            </Link>

            <Link to="/farmer/contact" className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Contact Us</span>
              </div>
              <span className="text-sm text-muted-foreground">Reach out</span>
            </Link>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-3 text-red-600 hover:bg-red-50/50 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </div>
            <span className="text-sm">Sign out</span>
          </button>
        </div>
      </main>

      <FarmerBottomNav />
    </div>
  );
};

export default FarmerSettings;