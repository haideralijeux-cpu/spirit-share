import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Define the shape of our authentication context
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component that wraps the app and provides authentication state
 * 
 * This provider manages:
 * - User authentication state (logged in/out)
 * - Session management with Supabase
 * - Loading states during auth operations
 * - Sign in, sign up, and sign out functionality
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // State for storing current user info
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up real-time listener for auth state changes
    // This fires whenever user logs in, logs out, or session changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check if there's already an active session when component mounts
    // This is important for page refreshes or when user returns to the app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Clean up the subscription when component unmounts
    return () => subscription.unsubscribe();
  }, []);

  /**
   * Sign in an existing user with email and password
   */
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  /**
   * Register a new user account
   * Includes email confirmation redirect to the main app
   */
  const signUp = async (email: string, password: string) => {
    // Set up redirect URL for email confirmation
    const redirectUrl = `${window.location.origin}/home`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  /**
   * Sign out the current user and clear their session
   */
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Bundle all auth state and functions into context value
  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to access authentication context
 * 
 * This hook provides easy access to auth state and functions
 * throughout the component tree. Throws an error if used outside
 * of an AuthProvider to catch developer mistakes early.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}