import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Phone, Mail, ArrowRight, Eye, EyeOff, Tractor, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { validateSignUpFields, validateSignInFields } from "@/lib/authUtils";
import { useEffect } from "react";
import { authService } from "@/services/firebase/authService";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "farmer";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, role: currentRole, signIn, signUp, setRole, signInWithGoogle } = useAuth();

  // Auto-redirect if already logged in
  useEffect(() => {
    // If the user is logged in but the role in the URL is different from their current role,
    // we should NOT auto-redirect to the old dashboard.
    // However, usually currentUser + currentRole means they are already authenticated.
    if (currentUser && currentRole) {
      if (currentRole === role) {
        navigate(`/${currentRole}/dashboard`);
      }
    }
  }, [currentUser, currentRole, navigate, role]);

  // Google sign in function
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle(role as 'farmer' | 'buyer');
      toast({
        title: "Success!",
        description: "Successfully signed in with Google.",
      });

      // Navigate to dashboard using the role we just set or the one in context
      const targetRole = authService.getCurrentUserRole() || role;
      navigate(`/${targetRole}/dashboard`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with Google",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [isSignUp, setIsSignUp] = useState(false);
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("email"); // Changed default to email
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: "",
    name: "",
    otp: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Validate sign up fields
        const { isValid, errors } = validateSignUpFields(
          formData.email,
          formData.password,
          formData.name,
          role as 'farmer' | 'buyer'
        );

        if (!isValid) {
          throw new Error(errors.join(', '));
        }

        // Sign up with Firebase
        await signUp(formData.email, formData.password, formData.name, role as 'farmer' | 'buyer');
        toast({
          title: "Account created!",
          description: "Your account has been created successfully.",
        });

        // Set role in context
        setRole(role as 'farmer' | 'buyer');

        // Navigate to dashboard
        navigate(`/${role}/dashboard`);
      } else {
        // Validate sign in fields
        const { isValid, errors } = validateSignInFields(
          formData.email,
          formData.password
        );

        if (!isValid) {
          throw new Error(errors.join(', '));
        }

        // Sign in with Firebase
        await signIn(formData.email, formData.password);

        // Get the actual role from the account, not the URL
        const actualRole = authService.getCurrentUserRole();
        const finalRole = actualRole || role;

        toast({
          title: "Welcome back!",
          description: `Successfully signed in as ${finalRole}.`,
        });

        // Navigate to dashboard
        navigate(`/${finalRole}/dashboard`);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || (isSignUp ? "Failed to create account" : "Failed to sign in"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const RoleIcon = role === "farmer" ? Tractor : Building2;

  return (
    <div className="min-h-screen bg-gradient-warm flex flex-col">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <Logo />
          <Link to="/role-select" className="text-sm text-muted-foreground hover:text-foreground">
            Change role
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Role Badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`p-2 rounded-xl ${role === "farmer" ? "bg-primary/10" : "bg-secondary/10"}`}>
              <RoleIcon className={`w-5 h-5 ${role === "farmer" ? "text-primary" : "text-secondary"}`} />
            </div>
            <span className="text-sm font-medium text-muted-foreground capitalize">
              {role} Account
            </span>
          </div>

          {/* Card */}
          <div className="bg-card rounded-3xl shadow-elevated p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isSignUp
                  ? "Join thousands of farmers & buyers"
                  : "Sign in to your account"}
              </p>
            </div>

            {/* Auth Method Toggle */}
            <div className="flex bg-muted rounded-xl p-1 mb-6">
              <button
                onClick={() => setAuthMethod("phone")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${authMethod === "phone"
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground"
                  }`}
              >
                <Phone className="w-4 h-4" />
                Phone
              </button>
              <button
                onClick={() => setAuthMethod("email")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${authMethod === "email"
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground"
                  }`}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1.5"
                    required
                  />
                </div>
              )}

              {authMethod === "phone" ? (
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      +91
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-12"
                      required
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1.5"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-1.5">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pr-10"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {isSignUp && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Password must be at least 6 characters
                      </p>
                    )}
                    {formData.password && formData.password.length > 0 && formData.password.length < 6 && (
                      <p className="text-xs text-red-500 mt-1">
                        Password must be at least 6 characters
                      </p>
                    )}
                  </div>
                </>
              )}

              <Button
                type="submit"
                variant={role === "farmer" ? "farmer" : "buyer"}
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isSignUp ? "Create Account" : "Sign In"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Google Sign-In */}
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Sign in with Google
            </Button>

            {/* Toggle Sign In/Up */}
            <p className="text-center mt-6 text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary font-semibold hover:underline"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
