import { UserRole } from './firebase/authService';

/**
 * Utility functions for authentication-related tasks
 */

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * Minimum 6 characters
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Gets the display name for a role
 */
export const getRoleDisplayName = (role: UserRole): string => {
  return role === 'farmer' ? 'Farmer' : 'Buyer';
};

/**
 * Gets the icon name for a role (can be used with lucide-react icons)
 */
export const getRoleIconName = (role: UserRole): string => {
  return role === 'farmer' ? 'Tractor' : 'Building2';
};

/**
 * Checks if user has a specific role
 */
export const hasRole = (userRole: UserRole | null, requiredRole: UserRole): boolean => {
  return userRole === requiredRole;
};

/**
 * Gets opposite role
 */
export const getOppositeRole = (role: UserRole): UserRole => {
  return role === 'farmer' ? 'buyer' : 'farmer';
};

/**
 * Validates required fields for sign up
 */
export const validateSignUpFields = (
  email: string, 
  password: string, 
  displayName: string,
  role: UserRole
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!displayName.trim()) {
    errors.push('Name is required');
  }

  if (!isValidEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!isValidPassword(password)) {
    errors.push('Password must be at least 6 characters');
  }

  if (!role) {
    errors.push('Role is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates required fields for sign in
 */
export const validateSignInFields = (
  email: string, 
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!isValidEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};