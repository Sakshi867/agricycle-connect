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

      // Store role in user's metadata (we'll use Firestore for persistent role storage)
      // For now, we'll handle role assignment in the app
      
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
      return userCredential.user as AppUser;
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

  // Get current user role (would typically be stored in Firestore)
  getCurrentUserRole(): UserRole | null {
    // In a real implementation, you would fetch the role from Firestore or user claims
    // For now, we'll infer it from the navigation state or localStorage
    return localStorage.getItem('userRole') as UserRole | null;
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