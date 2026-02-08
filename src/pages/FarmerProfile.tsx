import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, MapPin, Phone, Mail, Edit, Settings, Shield, HelpCircle, LogOut, Camera, Upload, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import FarmerBottomNav from "@/components/FarmerBottomNav";
import { useAuth } from "@/context/AuthContext";
import { messagingService } from "@/services/firebase/messagingService";
import { useEffect, useState, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { updateProfile } from "firebase/auth";
import { compressImage } from "@/lib/imageUtils";

const FarmerProfile = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  const [farmerData, setFarmerData] = useState({
    name: currentUser?.displayName || "Farmer",
    phone: "+91 98765 43210",
    email: currentUser?.email || "No email",
    location: "Pune, Maharashtra",
    farmSize: "15 acres",
    crops: ["Rice", "Wheat", "Sugarcane"],
    memberSince: currentUser?.metadata.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : "Jan 2024",
    totalListings: 12,
    totalEarnings: "₹45,200",
    photoURL: currentUser?.photoURL || ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(farmerData);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.uid) {
        try {
          const userData = await messagingService.getUserProfile(currentUser.uid);
          if (userData) {
            setFarmerData(prev => ({
              ...prev,
              name: userData.displayName || prev.name,
              phone: userData.phoneNumber || prev.phone,
              location: userData.location || prev.location,
              farmSize: userData.farmSize || prev.farmSize,
              crops: userData.crops || prev.crops
            }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Don't show error to user, just use default/fallback data
        }
      }
    };

    fetchUserData();
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
        // Read file as base64
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

        setFarmerData(prev => ({ ...prev, photoURL }));
        setTempData(prev => ({ ...prev, photoURL }));

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
    setTempData(farmerData);
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
          farmSize: tempData.farmSize,
          crops: tempData.crops
        });

        // Update Firebase Auth
        if (currentUser.displayName !== tempData.name) {
          await updateProfile(currentUser, { displayName: tempData.name });
        }

        setFarmerData(tempData);
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
    setTempData(farmerData);
  };

  const menuItems = [
    { icon: Settings, label: "Account Settings", path: "/farmer/settings" },
    { icon: Shield, label: "Privacy & Security", path: "/farmer/privacy" },
    { icon: HelpCircle, label: "Help & Support", path: "/farmer/help" },
    { icon: LogOut, label: "Logout", path: "/auth", action: "logout" },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link to="/farmer/dashboard" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
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
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 pattern-dots opacity-10" />

          <div className="relative z-10">
            <div className="flex items-end gap-4 mb-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center overflow-hidden">
                  {farmerData.photoURL ? (
                    <img
                      src={farmerData.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-primary-foreground" />
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
                <h2 className="text-xl font-bold">{isEditing ? (
                  <input
                    value={tempData.name}
                    onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                    className="bg-transparent border-b border-primary-foreground/30 focus:outline-none focus:border-primary-foreground text-primary-foreground"
                    placeholder="Enter name"
                  />
                ) : farmerData.name}</h2>
                <p className="text-primary-foreground/70">Farmer</p>
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
                  className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary-foreground/20"
                  onClick={handleEditClick}
                >
                  <Edit className="w-5 h-5 text-primary-foreground" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary-foreground/20">
              <div>
                <p className="text-xs text-primary-foreground/70 uppercase tracking-wide">Member Since</p>
                <p className="font-semibold">{farmerData.memberSince}</p>
              </div>
              <div>
                <p className="text-xs text-primary-foreground/70 uppercase tracking-wide">Total Listings</p>
                <p className="font-semibold">{farmerData.totalListings}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
            <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
            <p className="text-2xl font-bold text-foreground">{farmerData.totalEarnings}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
            <p className="text-sm text-muted-foreground mb-1">Farm Size</p>
            <p className="text-2xl font-bold text-foreground">{farmerData.farmSize}</p>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Phone className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium text-foreground">{farmerData.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Mail className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">{farmerData.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <MapPin className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium text-foreground">{farmerData.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Crops */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Crops Grown</h3>
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <div className="flex flex-wrap gap-2">
            {farmerData.crops.map((crop, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {crop}
              </span>
            ))}
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
              className={`flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors ${index !== menuItems.length - 1 ? "border-b border-border" : ""
                }`}
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

      <FarmerBottomNav />
    </div>
  );
};

export default FarmerProfile;