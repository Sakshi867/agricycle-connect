import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ListingsProvider } from "@/context/ListingsContext";
import { AuthProvider } from "@/context/AuthContext";
import RouteGuard from "@/components/RouteGuard";

// Pages
import Landing from "./pages/Landing";
import RoleSelect from "./pages/RoleSelect";
import Auth from "./pages/Auth";

// Farmer Pages
import FarmerOnboarding from "./pages/FarmerOnboarding";
import FarmerDashboard from "./pages/FarmerDashboard";
import CreateListing from "./pages/CreateListing";
import AIAnalysis from "./pages/AIAnalysis";
import ListingDetails from "./pages/ListingDetails";
import FarmerListings from "./pages/FarmerListings";
import FarmerMessages from "./pages/FarmerMessages";
import FarmerProfile from "./pages/FarmerProfile";
import FarmerSettings from "./pages/FarmerSettings";
import FarmerPrivacy from "./pages/FarmerPrivacy";
import FarmerSecurity from "./pages/FarmerSecurity";
import FarmerHelp from "./pages/FarmerHelp";
import FarmerContact from "./pages/FarmerContact";

// Buyer Pages
import BuyerOnboarding from "./pages/BuyerOnboarding";
import BuyerDashboard from "./pages/BuyerDashboard";
import BuyerListingDetail from "./pages/BuyerListingDetail";
import BuyerListings from "./pages/BuyerListings";
import BuyerShortlist from "./pages/BuyerShortlist";
import BuyerMessages from "./pages/BuyerMessages";
import BuyerProfile from "./pages/BuyerProfile";
import BuyerSettings from "./pages/BuyerSettings";
import BuyerPrivacy from "./pages/BuyerPrivacy";
import BuyerSecurity from "./pages/BuyerSecurity";
import BuyerHelp from "./pages/BuyerHelp";
import BuyerContact from "./pages/BuyerContact";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ListingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/role-select" element={<RoleSelect />} />
              <Route path="/auth" element={<Auth />} />

              {/* Farmer Routes */}
              <Route path="/farmer/onboarding" element={<RouteGuard requiredRole="farmer"><FarmerOnboarding /></RouteGuard>} />
              <Route path="/farmer/dashboard" element={<RouteGuard requiredRole="farmer"><FarmerDashboard /></RouteGuard>} />
              <Route path="/farmer/create" element={<RouteGuard requiredRole="farmer"><CreateListing /></RouteGuard>} />
              <Route path="/farmer/analyze" element={<RouteGuard requiredRole="farmer"><AIAnalysis /></RouteGuard>} />
              <Route path="/farmer/listing-details" element={<RouteGuard requiredRole="farmer"><ListingDetails /></RouteGuard>} />
              <Route path="/farmer/listing/:id" element={<RouteGuard requiredRole="farmer"><ListingDetails /></RouteGuard>} />
              <Route path="/farmer/listings" element={<RouteGuard requiredRole="farmer"><FarmerListings /></RouteGuard>} />
              <Route path="/farmer/messages" element={<RouteGuard requiredRole="farmer"><FarmerMessages /></RouteGuard>} />
              <Route path="/farmer/messages/:id" element={<RouteGuard requiredRole="farmer"><FarmerMessages /></RouteGuard>} />
              <Route path="/farmer/profile" element={<RouteGuard requiredRole="farmer"><FarmerProfile /></RouteGuard>} />
              <Route path="/farmer/settings" element={<RouteGuard requiredRole="farmer"><FarmerSettings /></RouteGuard>} />
              <Route path="/farmer/privacy" element={<RouteGuard requiredRole="farmer"><FarmerPrivacy /></RouteGuard>} />
              <Route path="/farmer/security" element={<RouteGuard requiredRole="farmer"><FarmerSecurity /></RouteGuard>} />
              <Route path="/farmer/help" element={<RouteGuard requiredRole="farmer"><FarmerHelp /></RouteGuard>} />
              <Route path="/farmer/contact" element={<RouteGuard requiredRole="farmer"><FarmerContact /></RouteGuard>} />

              {/* Buyer Routes */}
              <Route path="/buyer/onboarding" element={<RouteGuard requiredRole="buyer"><BuyerOnboarding /></RouteGuard>} />
              <Route path="/buyer/dashboard" element={<RouteGuard requiredRole="buyer"><BuyerDashboard /></RouteGuard>} />
              <Route path="/buyer/listings" element={<RouteGuard requiredRole="buyer"><BuyerListings /></RouteGuard>} />
              <Route path="/buyer/listing/:id" element={<RouteGuard requiredRole="buyer"><BuyerListingDetail /></RouteGuard>} />
              <Route path="/buyer/shortlist" element={<RouteGuard requiredRole="buyer"><BuyerShortlist /></RouteGuard>} />
              <Route path="/buyer/messages" element={<RouteGuard requiredRole="buyer"><BuyerMessages /></RouteGuard>} />
              <Route path="/buyer/messages/:id" element={<RouteGuard requiredRole="buyer"><BuyerMessages /></RouteGuard>} />
              <Route path="/buyer/profile" element={<RouteGuard requiredRole="buyer"><BuyerProfile /></RouteGuard>} />
              <Route path="/buyer/settings" element={<RouteGuard requiredRole="buyer"><BuyerSettings /></RouteGuard>} />
              <Route path="/buyer/privacy" element={<RouteGuard requiredRole="buyer"><BuyerPrivacy /></RouteGuard>} />
              <Route path="/buyer/security" element={<RouteGuard requiredRole="buyer"><BuyerSecurity /></RouteGuard>} />
              <Route path="/buyer/help" element={<RouteGuard requiredRole="buyer"><BuyerHelp /></RouteGuard>} />
              <Route path="/buyer/contact" element={<RouteGuard requiredRole="buyer"><BuyerContact /></RouteGuard>} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ListingsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
