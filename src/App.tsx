// Core UI components for notifications and tooltips
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// React Query for server state management
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Routing components
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Custom hooks and components
import { AuthProvider } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";

// Page components
import { Home } from "@/pages/Home";
import { Submit } from "@/pages/Submit";
import { Profile } from "@/pages/Profile";
import { Landing } from "@/pages/Landing";
import { Auth } from "@/pages/Auth";
import NotFound from "./pages/NotFound";

// Initialize React Query client with default settings
const queryClient = new QueryClient();

/**
 * Main App component that sets up the application structure
 * 
 * This component provides:
 * - React Query for server state management
 * - Authentication context throughout the app
 * - Toast notifications for user feedback
 * - Routing structure for navigation
 * - Tooltip functionality
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        {/* Toast components for user notifications */}
        <Toaster />
        <Sonner />
        
        <BrowserRouter>
          <Routes>
            {/* Public routes - accessible without authentication */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes - wrapped in Layout component for authenticated users */}
            <Route path="/home" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="submit" element={<Submit />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            
            {/* Catch-all route for 404 pages */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
