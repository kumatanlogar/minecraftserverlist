import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Index from "./pages/Index";
import ServerList from "./pages/ServerList";
import ServerDetail from "./pages/ServerDetail";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import SubmitServer from "./pages/SubmitServer";
import EditServer from "./pages/EditServer";
import Chat from "./pages/Chat";
import Premium from "./pages/Premium";
import Guidelines from "./pages/Guidelines";
import Support from "./pages/Support";
import Privacy from "./pages/Privacy";
import Settings from "./pages/Settings";
import Tools from "./pages/Tools";
import GiveCommandGenerator from "./pages/GiveCommandGenerator";
import SmallUppercaseGenerator from "./pages/SmallUppercaseGenerator";
import ColorCodeGenerator from "./pages/ColorCodeGenerator";
import MinecraftAvatarGenerator from "./pages/MinecraftAvatarGenerator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/servers" element={<ServerList />} />
            <Route path="/server/:id" element={<ServerDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/submit-server" element={<SubmitServer />} />
            <Route path="/edit-server/:id" element={<EditServer />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/guidelines" element={<Guidelines />} />
            <Route path="/support" element={<Support />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/give-command-generator" element={<GiveCommandGenerator />} />
            <Route path="/tools/small-uppercase-generator" element={<SmallUppercaseGenerator />} />
            <Route path="/tools/color-code-generator" element={<ColorCodeGenerator />} />
            <Route path="/tools/avatar-generator" element={<MinecraftAvatarGenerator />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
