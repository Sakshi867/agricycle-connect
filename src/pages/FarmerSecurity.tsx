import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Key, Eye, EyeOff, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import FarmerBottomNav from "@/components/FarmerBottomNav";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface PasswordDataState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const FarmerSecurity = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [passwordData, setPasswordData] = useState<PasswordDataState>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New password and confirmation do not match.",
      });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // Simulate API call to update password
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real application, you would call an API here
      // const response = await fetch('/api/user/password', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     currentPassword: passwordData.currentPassword,
      //     newPassword: passwordData.newPassword
      //   })
      // });
      
      // if (response.ok) {
        toast({
          title: "Success!",
          description: "Your password has been updated successfully.",
        });
        // Reset form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      // } else {
      //   throw new Error('Failed to update password');
      // }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
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
            <h1 className="text-lg font-semibold text-foreground">Security</h1>
            <p className="text-sm text-muted-foreground">Manage your account security</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Change Password */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Change Password</h2>
          
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword" className="text-sm font-medium text-foreground mb-1 block">
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="newPassword" className="text-sm font-medium text-foreground mb-1 block">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground mb-1 block">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <Button type="submit" className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Two-Factor Authentication</h2>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <button
              onClick={toggleTwoFactor}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                twoFactorEnabled ? 'bg-primary' : 'bg-input'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {twoFactorEnabled ? (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Two-factor authentication is enabled</p>
                  <p className="text-sm text-green-600">Your account has an extra layer of security.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Two-factor authentication is disabled</p>
                  <p className="text-sm text-yellow-600">Enable two-factor authentication to secure your account.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Recommendations */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Security Recommendations</h2>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Use Strong Passwords</p>
                <p className="text-sm text-muted-foreground">Create passwords with a combination of uppercase, lowercase, numbers, and special characters.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Update Regularly</p>
                <p className="text-sm text-muted-foreground">Change your passwords regularly and avoid reusing passwords across multiple accounts.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Monitor Account Activity</p>
                <p className="text-sm text-muted-foreground">Regularly review your account activity and log out of unused sessions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Recovery */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Account Recovery</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Key className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Recovery Email</p>
                <p className="text-sm text-muted-foreground">rajesh.kumar@email.com</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Key className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Backup Codes</p>
                <p className="text-sm text-muted-foreground">Store backup codes securely to regain access if needed.</p>
              </div>
            </div>
          </div>
          
          <Button variant="outline" className="w-full mt-4">
            Manage Recovery Options
          </Button>
        </div>
      </main>

      <FarmerBottomNav />
    </div>
  );
};

export default FarmerSecurity;