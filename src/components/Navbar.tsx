import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { isAuthenticated, logout } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await isAuthenticated();
        setIsLoggedIn(auth);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsLoggedIn(false);
      }
    };

    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setIsLoggedIn(true);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout error in Navbar:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-white shadow-md border-b border-fitcraft-light sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-fitcraft-primary">Fit</span>
                <span className="text-2xl font-bold text-fitcraft-secondary">Craft</span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-fitcraft-dark hover:border-fitcraft-primary transition-colors">
                Home
              </Link>
              {isLoggedIn && (
                <>
                  <Link to="/dashboard" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-fitcraft-dark hover:border-fitcraft-primary transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/workout-plan" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-fitcraft-dark hover:border-fitcraft-primary transition-colors">
                    Workouts
                  </Link>
                  <Link to="/meal-plan" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-fitcraft-dark hover:border-fitcraft-primary transition-colors">
                    Nutrition
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center">

            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {isLoggedIn ? (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => navigate('/login')}
                    variant="outline"
                    className="mr-2"
                  >
                    Log in
                  </Button>
                  <Button
                    onClick={() => navigate('/signup')}
                    className="bg-fitcraft-primary hover:bg-fitcraft-secondary"
                  >
                    Sign up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-fitcraft-primary dark:hover:bg-gray-800"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="sm:hidden bg-background border-t border-border">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-foreground hover:bg-muted hover:border-gray-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  to="/dashboard"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-foreground hover:bg-muted hover:border-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/workout-plan"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-foreground hover:bg-muted hover:border-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Workouts
                </Link>
                <Link
                  to="/meal-plan"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-foreground hover:bg-muted hover:border-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Nutrition
                </Link>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-border">
            <div className="flex items-center px-4 space-x-2">
              {isLoggedIn ? (
                <Button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Log in
                  </Button>
                  <Button
                    onClick={() => {
                      navigate('/signup');
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-fitcraft-primary hover:bg-fitcraft-secondary"
                  >
                    Sign up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
