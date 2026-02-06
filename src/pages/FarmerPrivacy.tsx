import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Lock, Key, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import FarmerBottomNav from "@/components/FarmerBottomNav";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const FarmerPrivacy = () => {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    contactInfoVisibility: false,
    locationVisibility: true,
    cropInformationVisibility: true
  });

  const handlePrivacyChange = (field: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
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
            <h1 className="text-lg font-semibold text-foreground">Privacy</h1>
            <p className="text-sm text-muted-foreground">Control your privacy settings</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Visibility Settings */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Profile Visibility</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Profile Visibility</p>
                  <p className="text-sm text-muted-foreground">Allow other users to view your profile</p>
                </div>
              </div>
              <Switch
                checked={privacySettings.profileVisibility}
                onCheckedChange={() => handlePrivacyChange('profileVisibility')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Contact Information</p>
                  <p className="text-sm text-muted-foreground">Show your contact information to other users</p>
                </div>
              </div>
              <Switch
                checked={privacySettings.contactInfoVisibility}
                onCheckedChange={() => handlePrivacyChange('contactInfoVisibility')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Location Privacy</p>
                  <p className="text-sm text-muted-foreground">Hide your exact location from other users</p>
                </div>
              </div>
              <Switch
                checked={privacySettings.locationVisibility}
                onCheckedChange={() => handlePrivacyChange('locationVisibility')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Crop Information</p>
                  <p className="text-sm text-muted-foreground">Show details about crops you grow</p>
                </div>
              </div>
              <Switch
                checked={privacySettings.cropInformationVisibility}
                onCheckedChange={() => handlePrivacyChange('cropInformationVisibility')}
              />
            </div>
          </div>
        </div>

        {/* Data Sharing */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Data Sharing</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Third-party sharing</p>
                <p className="text-sm text-muted-foreground">We do not share your personal information with third parties without your consent.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Aggregated data</p>
                <p className="text-sm text-muted-foreground">We may use anonymized, aggregated data for analytics and service improvement purposes.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Security Tips</h2>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Strong Password</p>
                <p className="text-sm text-muted-foreground">Use a strong password with a mix of letters, numbers, and special characters.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Enable two-factor authentication for an extra layer of security.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Secure Networks</p>
                <p className="text-sm text-muted-foreground">Avoid accessing your account on public Wi-Fi networks.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Privacy Policy</h2>
          
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
            </p>
            
            <p>
              We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
            </p>
            
            <p>
              Information Collection and Use: While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You.
            </p>
            
            <p>
              Security of Your Personal Data: The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure.
            </p>
          </div>
        </div>
      </main>

      <FarmerBottomNav />
    </div>
  );
};

export default FarmerPrivacy;