import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  UserCredential 
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  login: () => Promise<UserCredential | null>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const isValidDomain = (email: string) => {
    return email.endsWith('@surveysparrow.com');
  };

  const login = async (): Promise<UserCredential | null> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      if (!isValidDomain(user.email || '')) {
        // Sign out the user if they're not from the allowed domain
        await signOut(auth);
        toast({
          title: "Access Denied",
          description: "Only @surveysparrow.com email addresses are allowed.",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Welcome!",
        description: `Hello ${user.displayName || user.email}`,
      });
      
      return result;
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login.",
        variant: "destructive",
      });
      return null;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: error.message || "An error occurred during logout.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !isValidDomain(user.email || '')) {
        // If user somehow gets through but doesn't have valid domain, sign them out
        signOut(auth);
        setCurrentUser(null);
      } else {
        setCurrentUser(user);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 