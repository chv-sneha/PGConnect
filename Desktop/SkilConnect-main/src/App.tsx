import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/AuthContext";
import Chatbot from "@/components/Chatbot";
import SparkleTrail from "@/components/SparkleTrail";
import Index from "./pages/Index";
import CareerLens from "./pages/CareerLens";
import SkillExchange from "./pages/SkillExchange";
import SkillMatchExplorer from "./pages/SkillMatchExplorer";
import SkillLink from "./pages/SkillLink";
import MentorConnect from "./pages/MentorConnect";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/career-lens" element={<CareerLens />} />
            <Route path="/skill-exchange" element={<SkillExchange />} />
            <Route path="/connect/skill" element={<SkillMatchExplorer />} />
            <Route path="/skill-link" element={<SkillLink />} />
            <Route path="/mentor-connect" element={<MentorConnect />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <SparkleTrail />
          <Chatbot />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
