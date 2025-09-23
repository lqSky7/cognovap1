import { useState, useEffect } from "react";
import { LoginForm } from "@/components/login-form";
import { RegisterForm } from "@/components/register-form";
import { NavigationSidebar } from "@/components/navigation-sidebar";
import { JournalPage } from "@/components/journal-page";
import { Analytics } from "@/components/analytics";
import { authAPI, type User } from "@/services/api";
import LayoutEnhanced from "./enhanced/LayoutEnhanced.js";
import { ThemeProvider } from "./contexts/ThemeContext.js";

type AppView =
  | "login"
  | "register"
  | "chat"
  | "journal"
  | "analytics"
  | "profile"
  | "settings";

function Dashboard({
  user,
  onLogout,
  currentView,
  onViewChange,
}: {
  user: User;
  onLogout: () => void;
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}) {
  // Use the enhanced layout for chat view, traditional layout for others
  if (currentView === "chat") {
    return <LayoutEnhanced user={user} />;
  }

  return (
    <div className="flex h-screen bg-background">
      <NavigationSidebar
        user={user}
        onLogout={onLogout}
        currentView={currentView}
        onViewChange={(view) => onViewChange(view as AppView)}
      />
      <main className="flex-1 overflow-hidden">
        {currentView === "journal" && <JournalPage user={user} />}
        {currentView === "analytics" && <Analytics user={user} />}
        {currentView === "profile" && (
          <div className="max-w-4xl mx-auto p-6 h-full overflow-y-auto">
            <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
              <div className="space-y-4">
                <div>
                  <span className="font-medium">Name:</span> {user.first_name}{" "}
                  {user.last_name}
                </div>
                <div>
                  <span className="font-medium">Username:</span> {user.username}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {user.email}
                </div>
              </div>
            </div>
          </div>
        )}
        {currentView === "settings" && (
          <div className="max-w-4xl mx-auto p-6 h-full overflow-y-auto">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
              <p className="text-muted-foreground">
                Settings panel coming soon...
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  const [currentView, setCurrentView] = useState<AppView>("chat");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authAPI.getProfile();
        setCurrentUser(response.user);
        setCurrentView("chat");
      } catch (error) {
        // User not logged in - show enhanced layout as guest
        setCurrentView("chat");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView("chat");
  };

  const handleRegisterSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView("chat");
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setCurrentUser(null);
      setCurrentView("chat");
    }
  };

  const switchToRegister = () => setCurrentView("register");
  const switchToLogin = () => setCurrentView("login");

  // Show loading state
  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-oled text-white">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#FF7900] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-text">Loading...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // Show dashboard if user is logged in or enhanced layout for guests
  if (currentView === "chat") {
    return (
      <ThemeProvider>
        <LayoutEnhanced user={currentUser || undefined} />
      </ThemeProvider>
    );
  }

  if (currentUser && (currentView === "journal" || currentView === "analytics" || currentView === "profile" || currentView === "settings")) {
    return (
      <ThemeProvider>
        <Dashboard
          user={currentUser}
          onLogout={handleLogout}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      </ThemeProvider>
    );
  }

  // Show auth forms
  if (currentView === "login") {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full">
            <LoginForm
              onLoginSuccess={handleLoginSuccess}
              onSwitchToRegister={switchToRegister}
            />
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (currentView === "register") {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full">
            <RegisterForm
              onRegisterSuccess={handleRegisterSuccess}
              onSwitchToLogin={switchToLogin}
            />
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // Default to enhanced layout
  return (
    <ThemeProvider>
      <LayoutEnhanced user={currentUser || undefined} />
    </ThemeProvider>
  );
}

export default App;
