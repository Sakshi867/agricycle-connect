import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Edit,
  Settings,
  Shield,
  HelpCircle,
  LogOut,
  Camera,
  Upload,
  Check,
  X,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BuyerBottomNav from "@/components/BuyerBottomNav";
import { useAuth } from "@/context/AuthContext";
import { messagingService } from "@/services/firebase/messagingService";
import { useEffect, useState, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { updateProfile } from "firebase/auth";
import { compressImage } from "@/lib/imageUtils";

interface BuyerProfileData {
  name: string;
  phone: string;
  email: string;
  location: string;
  businessType: string;
  industry: string;
  photoURL: string;
  memberSince: string;
  totalPurchases: number;
  totalSpent: string;
}

const ProductionBuyerProfile = () => {
  const { currentUser, signOut } = useAuth();
  const [profileData, setProfileData] = useState<BuyerProfileData>({
    name: currentUser?.displayName || "Buyer",
    phone: "+91 98765 43210",
    email: currentUser?.email || "No email",
    location: "Pune, Maharashtra",
    businessType: "Biomass Energy Company",
    industry: "Renewable Energy",
    photoURL: currentUser?.photoURL || "",
    memberSince: currentUser?.metadata.creationTime
      ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
      : "Jan 2024",
    totalPurchases: 8,
    totalSpent: "₹32,500"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<BuyerProfileData>(profileData);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false); // Default to false for instant render
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user data from Firestore on mount
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser?.uid) {
        try {
          const userData = await messagingService.getUserProfile(currentUser.uid);
          if (userData) {
            const updatedData: BuyerProfileData = {
              name: userData.displayName || profileData.name,
              phone: userData.phoneNumber || profileData.phone,
              email: userData.email || profileData.email,
              location: userData.location || profileData.location,
              businessType: userData.businessType || profileData.businessType,
              industry: userData.industry || profileData.industry,
              photoURL: userData.photoURL || currentUser.photoURL || profileData.photoURL,
              memberSince: profileData.memberSince,
              totalPurchases: profileData.totalPurchases,
              totalSpent: profileData.totalSpent
            };
            setProfileData(updatedData);
            setTempData(updatedData);
          } else {
            // Offline mode or no data found - use current user data as fallback
            const fallbackData: BuyerProfileData = {
              ...profileData,
              name: currentUser.displayName || profileData.name,
              email: currentUser.email || profileData.email,
              photoURL: currentUser.photoURL || profileData.photoURL
            };
            setProfileData(fallbackData);
            setTempData(fallbackData);
          }
        } catch (error: any) {
          console.error('Error loading user data:', error);
          // Don't show error toast for offline scenarios
          if (!error.message?.includes('offline') && error.code !== 'unavailable') {
            toast({
              title: "Error",
              description: "Failed to load profile data",
              variant: "destructive"
            });
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadUserData();
  }, [currentUser]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      if (currentUser?.uid) {
        // Read file as base64 and compress
        const reader = new FileReader();
        const photoURL = await new Promise<string>((resolve, reject) => {
          reader.onload = async (e) => {
            try {
              const originalBase64 = e.target?.result as string;
              // Compress aggressively for profile picture (200px)
              const compressed = await compressImage(originalBase64, 30); // 30KB target
              const uploadedURL = await messagingService.uploadUserPhoto(currentUser.uid, compressed);
              resolve(uploadedURL);
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });

        // Update local state
        const updatedData = { ...profileData, photoURL };
        setProfileData(updatedData);
        setTempData(updatedData);

        // Update Firebase Auth photoURL
        await updateProfile(currentUser, { photoURL });

        toast({
          title: "Success!",
          description: "Profile picture updated successfully."
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setTempData(profileData);
  };

  const handleSave = async () => {
    try {
      if (currentUser?.uid) {
        // Save to Firestore
        await messagingService.updateUserProfile(currentUser.uid, {
          displayName: tempData.name,
          phoneNumber: tempData.phone,
          email: tempData.email,
          location: tempData.location,
          businessType: tempData.businessType,
          industry: tempData.industry,
          photoURL: tempData.photoURL
        });

        // Update Firebase Auth
        if (currentUser.displayName !== tempData.name) {
          await updateProfile(currentUser, { displayName: tempData.name });
        }

        setProfileData(tempData);
        setIsEditing(false);

        toast({
          title: "Success!",
          description: "Profile updated successfully."
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData(profileData);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    { icon: Settings, label: "Account Settings", path: "/buyer/settings" },
    { icon: Shield, label: "Privacy & Security", path: "/buyer/privacy" },
    { icon: HelpCircle, label: "Help & Support", path: "/buyer/help" },
    { icon: LogOut, label: "Logout", path: "/auth", action: "logout" },
  ];

  // Removed blocking loading check for faster navigation

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link to="/buyer/dashboard" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Profile</h1>
            <p className="text-sm text-muted-foreground">Manage your account</p>
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="px-4 py-6">
        <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl p-6 text-secondary-foreground relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 pattern-grid opacity-10" />

          <div className="relative z-10">
            <div className="flex items-end gap-4 mb-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-secondary-foreground/20 flex items-center justify-center overflow-hidden">
                  {profileData.photoURL ? (
                    <img
                      src={profileData.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-10 h-10 text-secondary-foreground" />
                  )}
                </div>
                <button
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent flex items-center justify-center hover:bg-accent/80 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 text-accent-foreground" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">
                  {isEditing ? (
                    <input
                      value={tempData.name}
                      onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                      className="bg-transparent border-b border-secondary-foreground/30 focus:outline-none focus:border-secondary-foreground text-secondary-foreground w-full"
                      placeholder="Enter business name"
                    />
                  ) : profileData.name}
                </h2>
                <p className="text-secondary-foreground/70">{profileData.businessType}</p>
              </div>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 bg-green-500/20 hover:bg-green-500/30"
                    onClick={handleSave}
                  >
                    <Check className="w-5 h-5 text-green-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30"
                    onClick={handleCancel}
                  >
                    <X className="w-5 h-5 text-red-500" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 bg-secondary-foreground/10 hover:bg-secondary-foreground/20"
                  onClick={handleEditClick}
                >
                  <Edit className="w-5 h-5 text-secondary-foreground" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-secondary-foreground/20">
              <div>
                <p className="text-xs text-secondary-foreground/70 uppercase tracking-wide">Member Since</p>
                <p className="font-semibold">{profileData.memberSince}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-foreground/70 uppercase tracking-wide">Total Purchases</p>
                <p className="font-semibold">{profileData.totalPurchases}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
            <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-foreground">{profileData.totalSpent}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
            <p className="text-sm text-muted-foreground mb-1">Industry</p>
            <p className="text-2xl font-bold text-foreground">
              {isEditing ? (
                <input
                  value={tempData.industry}
                  onChange={(e) => setTempData({ ...tempData, industry: e.target.value })}
                  className="bg-transparent border-b border-foreground/30 focus:outline-none focus:border-foreground w-full"
                  placeholder="Industry"
                />
              ) : profileData.industry}
            </p>
          </div>
        </div>
      </div>

      {/* Business Info */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Business Information</h3>
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Building2 className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Business Type</p>
              <p className="font-medium text-foreground">
                {isEditing ? (
                  <input
                    value={tempData.businessType}
                    onChange={(e) => setTempData({ ...tempData, businessType: e.target.value })}
                    className="bg-transparent border-b border-foreground/30 focus:outline-none focus:border-foreground w-full"
                    placeholder="Business type"
                  />
                ) : profileData.businessType}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Phone className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium text-foreground">
                {isEditing ? (
                  <input
                    value={tempData.phone}
                    onChange={(e) => setTempData({ ...tempData, phone: e.target.value })}
                    className="bg-transparent border-b border-foreground/30 focus:outline-none focus:border-foreground w-full"
                    placeholder="Phone number"
                  />
                ) : profileData.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Mail className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">
                {isEditing ? (
                  <input
                    value={tempData.email}
                    onChange={(e) => setTempData({ ...tempData, email: e.target.value })}
                    className="bg-transparent border-b border-foreground/30 focus:outline-none focus:border-foreground w-full"
                    placeholder="Email address"
                  />
                ) : profileData.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <MapPin className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium text-foreground">
                {isEditing ? (
                  <input
                    value={tempData.location}
                    onChange={(e) => setTempData({ ...tempData, location: e.target.value })}
                    className="bg-transparent border-b border-foreground/30 focus:outline-none focus:border-foreground w-full"
                    placeholder="Location"
                  />
                ) : profileData.location}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Settings</h3>
        <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
          {menuItems.map((item, index) => (
            <div
              key={item.label}
              onClick={item.action === "logout" ? handleLogout : undefined}
              className={`flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors ${index !== menuItems.length - 1 ? "border-b border-border" : ""}`}
            >
              {item.action !== "logout" ? (
                <Link to={item.path} className="flex items-center gap-4 w-full">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.label}</p>
                  </div>
                </Link>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.label}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <BuyerBottomNav />
    </div>
  );
};

export default ProductionBuyerProfile;