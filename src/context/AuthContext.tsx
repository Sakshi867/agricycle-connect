import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { auth } from '@/services/firebase/config';
import { authService, AppUser, UserRole } from '@/services/firebase/authService';

interface AuthContextType {
  currentUser: AppUser | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  signInWithGoogle: (role: UserRole) => Promise<void>;
  setRole: (role: UserRole) => void;
  clearRole: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user as AppUser);

      // Get role from localStorage or determine from other factors
      if (user) {
        const userRole = authService.getCurrentUserRole();
        setRole(userRole);
      }

      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await authService.signIn(email, password);
      setCurrentUser(user);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, displayName: string, role: UserRole) => {
    setLoading(true);
    try {
      const user = await authService.signUp(email, password, displayName, role);
      setCurrentUser(user);
      authService.setCurrentUserRole(role);
      setRole(role);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      authService.clearUserRole();
      setCurrentUser(null);
      setRole(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Send password reset email
  const sendPasswordResetEmail = async (email: string) => {
    return await authService.sendPasswordResetEmail(email);
  };

  // Send email verification
  const sendEmailVerificationLocal = async () => {
    if (!auth.currentUser) {
      throw new Error('No user is signed in');
    }
    await sendEmailVerification(auth.currentUser);
  };

  // Sign in with Google
  const signInWithGoogle = async (role: UserRole) => {
    setLoading(true);
    try {
      const user = await authService.signInWithGoogleAndRole(role);
      setCurrentUser(user);
      setRole(role);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Set user role
  const setUserRole = (userRole: UserRole) => {
    setRole(userRole);
    authService.setCurrentUserRole(userRole);
  };

  // Clear user role
  const clearRole = () => {
    setRole(null);
    authService.clearUserRole();
  };

  const value = {
    currentUser,
    role,
    loading,
    signIn,
    signUp,
    signOut,
    sendPasswordResetEmail,
    sendEmailVerification: sendEmailVerificationLocal,
    signInWithGoogle,
    setRole: setUserRole,
    clearRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};