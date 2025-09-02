import { useState, useEffect } from 'react'
import { LoginForm } from '@/components/login-form'
import { RegisterForm } from '@/components/register-form'
import { Navbar } from '@/components/navbar'
import { ChatInterface } from '@/components/chat-interface'
import { Journal } from '@/components/journal'
import { Analytics } from '@/components/analytics'
import { authAPI, type User } from '@/services/api'

type AppView = 'login' | 'register' | 'chat' | 'journal' | 'analytics' | 'profile' | 'settings'

function LandingPage({ onViewChange }: { onViewChange: (view: AppView) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Welcome to Cognova
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your personal AI-powered mental health companion. Chat with specialized AI therapists, 
            track your mood, and maintain a meaningful journal - all in one beautiful, secure platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onViewChange('register')}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
            >
              Get Started Free
            </button>
            <button
              onClick={() => onViewChange('login')}
              className="px-8 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              🤖
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Therapy Chat</h3>
            <p className="text-muted-foreground">
              Choose from 5 specialized AI therapists, each with unique approaches to mental health support.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              📝
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Journaling</h3>
            <p className="text-muted-foreground">
              Track your thoughts, mood, and progress with an AI-integrated journaling system.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              📊
            </div>
            <h3 className="text-xl font-semibold mb-2">Progress Analytics</h3>
            <p className="text-muted-foreground">
              Visualize your mental health journey with detailed insights and achievements.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Dashboard({ user, onLogout, currentView, onViewChange }: { 
  user: User
  onLogout: () => void
  currentView: AppView
  onViewChange: (view: AppView) => void
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        user={user} 
        onLogout={onLogout} 
        currentView={currentView}
        onViewChange={(view) => onViewChange(view as AppView)}
      />
      <main className="pt-4 pb-8">
        {currentView === 'chat' && <ChatInterface user={user} />}
        {currentView === 'journal' && <Journal user={user} />}
        {currentView === 'analytics' && <Analytics user={user} />}
        {currentView === 'profile' && (
          <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
              <div className="space-y-4">
                <div>
                  <span className="font-medium">Name:</span> {user.first_name} {user.last_name}
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
        {currentView === 'settings' && (
          <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
              <p className="text-muted-foreground">Settings panel coming soon...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function App() {
  const [currentView, setCurrentView] = useState<AppView>('chat')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authAPI.getProfile()
        setCurrentUser(response.user)
        setCurrentView('chat')
      } catch (error) {
        // User not logged in
        setCurrentView('login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user)
    setCurrentView('chat')
  }

  const handleRegisterSuccess = (user: User) => {
    setCurrentUser(user)
    setCurrentView('chat')
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setCurrentUser(null)
      setCurrentView('login')
    }
  }

  const switchToRegister = () => setCurrentView('register')
  const switchToLogin = () => setCurrentView('login')

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show dashboard if user is logged in
  if (currentUser) {
    return (
      <Dashboard 
        user={currentUser} 
        onLogout={handleLogout}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
    )
  }

  // Show auth forms or landing page
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          <LoginForm
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={switchToRegister}
          />
        </div>
      </div>
    )
  }

  if (currentView === 'register') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          <RegisterForm
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={switchToLogin}
          />
        </div>
      </div>
    )
  }

  // Default to landing page
  return <LandingPage onViewChange={setCurrentView} />
}

export default App
