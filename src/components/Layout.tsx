import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Home, Plus, User, LogOut, Quote } from 'lucide-react';

export function Layout() {
  const { user, signOut, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4 animate-glow">
            <Quote className="h-8 w-8 text-white" />
          </div>
          <div className="text-lg text-muted-foreground font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const navigation = [
    { name: 'Home', href: '/home', icon: Home },
    { name: 'Submit', href: '/home/submit', icon: Plus },
    { name: 'Profile', href: '/home/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      <header className="border-b border-border/50 bg-card/70 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/home"
              className="flex items-center space-x-3 group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                <Quote className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-serif font-bold bg-gradient-primary bg-clip-text text-transparent">
                QuickQuotes
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-primary text-white shadow-glow'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:scale-105'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={signOut}
              className="border-border/50 bg-background/50 backdrop-blur-sm hover:bg-destructive hover:text-white hover:border-destructive transition-all duration-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden mt-4 flex justify-center space-x-8 bg-card/50 backdrop-blur-sm rounded-xl p-2 border border-border/50">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}