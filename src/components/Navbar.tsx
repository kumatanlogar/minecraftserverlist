import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, List, Plus, Shield, User, LogOut, LayoutDashboard, Settings, MessageSquare, Crown, Wrench } from "lucide-react";
import minecraftLogo from "@/assets/minecraft-logo.png";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationBell } from "@/components/NotificationBell";

export const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src={minecraftLogo} alt="MC Vault Logo" className="w-10 h-10 rounded-lg" />
            <span className="text-xl font-bold text-foreground">
              MC Vault
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link to="/servers">
              <Button variant="ghost" size="sm">
                <List className="h-4 w-4 mr-2" />
                All Servers
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </Link>
            <Link to="/tools">
              <Button variant="ghost" size="sm">
                <Wrench className="h-4 w-4 mr-2" />
                Tools
              </Button>
            </Link>
            <Link to="/premium">
              <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-400">
                <Crown className="h-4 w-4 mr-2" />
                Premium
              </Button>
            </Link>
            
            {user ? (
              <>
                <NotificationBell />
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/submit-server" className="cursor-pointer">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Server
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/auth">
                <Button size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
