import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import {
  MessageCircle,
  BookOpen,
  BarChart3,
  Settings,
  User,
  LogOut,
  Menu,
  Brain,
  Sparkles,
} from "lucide-react";
import type { User as UserType } from "@/services/api";

interface NavbarProps {
  user?: UserType | null;
  onLogout?: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Navbar({
  user,
  onLogout,
  currentView,
  onViewChange,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "journal", label: "Journal", icon: BookOpen },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Cognova
            </span>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </div>
        </div>

        {/* Desktop Navigation - Center */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <Dock direction="middle" className="relative">
            {navItems.map((item) => (
              <DockIcon key={item.id} size={40}>
                <Button
                  variant={currentView === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewChange(item.id)}
                  className="h-9 w-9 p-0"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="sr-only">{item.label}</span>
                </Button>
              </DockIcon>
            ))}
          </Dock>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-2">
          <AnimatedThemeToggler />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${user.email}`}
                      alt={user.first_name}
                    />
                    <AvatarFallback>
                      {user.first_name?.[0]}
                      {user.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex-col items-start">
                  <div className="font-medium">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.email}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onViewChange("profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewChange("settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => onViewChange("login")} size="sm">
              Sign In
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-6">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => {
                      onViewChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
