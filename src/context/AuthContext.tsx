import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { auth } from '@/services/firebase/config';
import { authService, AppUser, UserRole } from '@/services/firebase/authService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase/config';

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
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

  // Background function to fetch role from Firestore with offline support
  const fetchRoleFromFirestore = async (userId: string): Promise<void> => {
    try {
      // Only fetch if role is not already set from localStorage
      const localRole = authService.getCurrentUserRole();
      if (localRole) {
        setRole(localRole);
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role as UserRole;
        if (userRole) {
          setRole(userRole);
          authService.setCurrentUserRole(userRole);
        }
      }
    } catch (error: any) {
      // Handle offline scenario gracefully
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        console.warn('Offline mode: Using cached role data');
        // Try to get role from localStorage as fallback
        const cachedRole = authService.getCurrentUserRole();
        if (cachedRole) {
          setRole(cachedRole);
        }
      } else {
        console.error('Error fetching user role from Firestore:', error);
      }
    }
  };

  // Cleanup function for auth listener
  const cleanupAuthListener = () => {
    if (unsubscribe) {
      unsubscribe();
      setUnsubscribe(null);
    }
  };

  useEffect(() => {
    // Setup auth state listener
    const unsubscribeFn = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user as AppUser);

      if (user) {
        // Get role from localStorage first (instant access - critical for routing)
        const userRole = authService.getCurrentUserRole();
        if (userRole) {
          setRole(userRole);
        }
        
        // Background sync with Firestore (non-blocking)
        fetchRoleFromFirestore(user.uid);
      } else {
        // Clear role if user is not authenticated
        setRole(null);
        authService.clearUserRole();
      }

      // Set loading to false after auth state and role are determined
      setLoading(false);
    });

    setUnsubscribe(() => unsubscribeFn);

    // Cleanup on unmount
    return cleanupAuthListener;
  }, []);

  // Sign in function - ensure immediate role setting
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await authService.signIn(email, password);
      setCurrentUser(user);
      
      // Set role from the user object immediately (critical for routing)
      if (user.role) {
        setRole(user.role);
        authService.setCurrentUserRole(user.role);
      } else {
        // Fallback: try to get role from localStorage
        const localRole = authService.getCurrentUserRole();
        if (localRole) {
          setRole(localRole);
        }
      }
      
      // Background sync - don't block UI
      if (user.uid) {
        fetchRoleFromFirestore(user.uid);
      }
      
      // Only set loading to false after role is confirmed
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

  // Sign in with Google - ensure immediate role setting
  const signInWithGoogle = async (role: UserRole) => {
    setLoading(true);
    try {
      const user = await authService.signInWithGoogleAndRole(role);
      setCurrentUser(user);
      setRole(role);
      authService.setCurrentUserRole(role);
      
      // Background sync - don't block UI
      if (user.uid) {
        fetchRoleFromFirestore(user.uid);
      }
      
      // Only set loading to false after role is confirmed
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