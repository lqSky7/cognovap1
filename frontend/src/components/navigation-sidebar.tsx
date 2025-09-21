import { useState } from "react";
import { Sidebar, SidebarLink, useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  MessageCircle,
  BookOpen,
  BarChart3,
  Settings,
  User,
  LogOut,
  Brain,
  Sparkles,
} from "lucide-react";
import type { User as UserType } from "@/services/api";

interface NavigationSidebarProps {
  user: UserType;
  onLogout: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

// Custom rounded sidebar component
const RoundedDesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 w-[300px] shrink-0 rounded-tr-2xl",
          className
        )}
        animate={{
          width: animate ? (open ? "300px" : "60px") : "300px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export function NavigationSidebar({
  user,
  onLogout,
  currentView,
  onViewChange,
}: NavigationSidebarProps) {
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Chat",
      href: "#",
      icon: (
        <MessageCircle 
          className={`h-5 w-5 ${currentView === 'chat' ? 'text-primary' : 'text-neutral-700 dark:text-neutral-200'}`} 
        />
      ),
      onClick: () => onViewChange("chat"),
    },
    {
      label: "Journal",
      href: "#",
      icon: (
        <BookOpen 
          className={`h-5 w-5 ${currentView === 'journal' ? 'text-primary' : 'text-neutral-700 dark:text-neutral-200'}`} 
        />
      ),
      onClick: () => onViewChange("journal"),
    },
    {
      label: "Analytics",
      href: "#",
      icon: (
        <BarChart3 
          className={`h-5 w-5 ${currentView === 'analytics' ? 'text-primary' : 'text-neutral-700 dark:text-neutral-200'}`} 
        />
      ),
      onClick: () => onViewChange("analytics"),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <User 
          className={`h-5 w-5 ${currentView === 'profile' ? 'text-primary' : 'text-neutral-700 dark:text-neutral-200'}`} 
        />
      ),
      onClick: () => onViewChange("profile"),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <Settings 
          className={`h-5 w-5 ${currentView === 'settings' ? 'text-primary' : 'text-neutral-700 dark:text-neutral-200'}`} 
        />
      ),
      onClick: () => onViewChange("settings"),
    },
  ];

  return (
    <div className="relative">
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <RoundedDesktopSidebar className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Logo */}
            <div className="flex items-center space-x-2 py-4 px-2">
              <Brain className="h-6 w-6 text-primary" />
              {open && (
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Cognova
                  </span>
                  <Sparkles className="h-4 w-4 text-purple-500" />
                </div>
              )}
            </div>

          {/* Navigation Links */}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <div
                key={idx}
                onClick={link.onClick}
                className="cursor-pointer"
              >
                <SidebarLink
                  link={link}
                  className={`${
                    currentView === link.label.toLowerCase()
                      ? "bg-primary/10 border-r-2 border-primary"
                      : ""
                  } hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-4">
          {/* Theme Toggle */}
          <div className="flex justify-center">
            <AnimatedThemeToggler />
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 p-2 rounded-lg transition-colors w-full">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${user.email}`}
                      alt={user.first_name}
                    />
                    <AvatarFallback>
                      {user.first_name?.[0]}
                      {user.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  {open && (
                    <div className="flex flex-col text-sm">
                      <span className="font-medium text-neutral-700 dark:text-neutral-200">
                        {user.first_name} {user.last_name}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {user.email}
                      </span>
                    </div>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={() => onViewChange("profile")}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onViewChange("settings")}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </RoundedDesktopSidebar>
    </Sidebar>
    </div>
  );
}
