import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  User,
  OAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from './config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './config';

// Define user role type
export type UserRole = 'farmer' | 'buyer';

// Extended user interface to include role
export interface AppUser extends User {
  role?: UserRole;
}

// Authentication service class
class AuthService {
  // Sign up with email and password
  async signUp(
    email: string, 
    password: string, 
    displayName: string, 
    role: UserRole
  ): Promise<AppUser> {
    try {
      // Validate password strength
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: displayName
      });

      // Store role in Firestore for persistent role storage
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        role: role,
        email: userCredential.user.email,
        displayName: displayName,
        createdAt: new Date()
      });
      
      // Store role in localStorage as well for immediate access
      this.setCurrentUserRole(role);
      
      return {
        ...userCredential.user,
        role
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account');
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<AppUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get the user's role from localStorage first (faster)
      let userRole: UserRole | null = this.getCurrentUserRole();
      
      // If not in localStorage, try to get from Firestore
      if (!userRole) {
        try {
          const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            userRole = userData.role as UserRole;
            
            // Store role in localStorage for immediate access
            if (userRole) {
              this.setCurrentUserRole(userRole);
            }
          }
        } catch (error: any) {
          // Handle offline scenario - don't block login
          if (error.code !== 'unavailable' && !error.message?.includes('offline')) {
            console.error('Error fetching user role from Firestore:', error);
          }
        }
      }
      
      // Return the user with their role
      return {
        ...userCredential.user,
        role: userRole
      } as AppUser;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in');
    }
  }

  // Sign in with phone number (will need additional setup)
  async signInWithPhone(phoneNumber: string): Promise<void> {
    // This requires Firebase phone authentication setup with reCAPTCHA
    // Implementation would require additional UI components
    throw new Error('Phone authentication not implemented yet. Requires additional setup.');
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<AppUser> {
    try {
      const provider = new OAuthProvider('google.com');
      const result = await signInWithPopup(auth, provider);
      return result.user as AppUser;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  }

  // Complete Google sign in (with role)
  async signInWithGoogleAndRole(role: UserRole): Promise<AppUser> {
    try {
      const provider = new OAuthProvider('google.com');
      const result = await signInWithPopup(auth, provider);
      
      // Store role in Firestore for persistent role storage
      try {
        const userRef = doc(db, 'users', result.user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          // Only create user document if it doesn't exist
          await setDoc(userRef, {
            role: role,
            email: result.user.email,
            displayName: result.user.displayName,
            createdAt: new Date(),
            provider: 'google'
          });
        }
      } catch (error) {
        console.error('Error storing user role in Firestore:', error);
      }
      
      // Store role in localStorage
      this.setCurrentUserRole(role);
      
      return {
        ...result.user,
        role
      } as AppUser;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send password reset email');
    }
  }

  // Get current user
  getCurrentUser(): AppUser | null {
    return auth.currentUser as AppUser | null;
  }

  // Get current user role
  getCurrentUserRole(): UserRole | null {
    // First try to get from localStorage
    const roleFromStorage = localStorage.getItem('userRole') as UserRole | null;
    if (roleFromStorage) {
      return roleFromStorage;
    }
    
    // If not in storage, we could fetch from Firestore, but for now return null
    // The role should have been fetched during sign-in
    return null;
  }

  // Set user role (stored locally for now)
  setCurrentUserRole(role: UserRole): void {
    localStorage.setItem('userRole', role);
  }

  // Clear user role
  clearUserRole(): void {
    localStorage.removeItem('userRole');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!auth.currentUser;
  }
}

export const authService = new AuthService();