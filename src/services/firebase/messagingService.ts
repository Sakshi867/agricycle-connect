import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  updateDoc,
  doc,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from './config';

export interface Message {
  id?: string;
  senderId: string;
  receiverId: string;
  senderRole: 'farmer' | 'buyer';
  receiverRole: 'farmer' | 'buyer';
  message: string;
  timestamp: Timestamp;
  read: boolean;
}

export interface Conversation {
  id?: string;
  participants: string[];
  participantNames: string[];
  participantRoles: ('farmer' | 'buyer')[];
  lastMessage: string;
  lastMessageTime: Timestamp;
  unreadCount: number;
  status: 'pending' | 'accepted';
  // UI display properties
  name?: string;
  avatar?: string;
  time?: string;
  businessType?: string;
  crop?: string;
  location?: string;
  unread?: number;
}

class MessagingService {
  // Send a message and update conversation
  async sendMessage(
    senderId: string,
    receiverId: string,
    senderRole: 'farmer' | 'buyer',
    receiverRole: 'farmer' | 'buyer',
    message: string
  ): Promise<void> {
    try {
      // Create a conversation ID from the two user IDs sorted alphabetically
      const conversationId = [senderId, receiverId].sort().join('_');

      // Add the message to the messages collection
      await addDoc(collection(db, 'messages'), {
        conversationId,
        senderId,
        receiverId,
        senderRole,
        receiverRole,
        message,
        timestamp: serverTimestamp(),
        read: false
      });

      // Update or create the conversation document
      const conversationRef = doc(db, 'conversations', conversationId);
      const conversationSnap = await getDoc(conversationRef);

      if (conversationSnap.exists()) {
        // Update existing conversation
        await updateDoc(conversationRef, {
          lastMessage: message,
          lastMessageTime: serverTimestamp(),
          [`unreadCount_${receiverId}`]: increment(1), // Increment unread count for receiver
        });
      } else {
        // Create new conversation
        await setDoc(conversationRef, {
          participants: [senderId, receiverId],
          participantNames: ['', ''], // Will be populated by the app when loading
          participantRoles: [senderRole, receiverRole],
          lastMessage: message,
          lastMessageTime: serverTimestamp(),
          status: 'pending', // New conversations start as pending requests
          [`unreadCount_${senderId}`]: 0,
          [`unreadCount_${receiverId}`]: 1, // Receiver starts with 1 unread
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Get conversations for a user
  getConversationsForUser(userId: string) {
    // Query for all conversations where the user is a participant
    return query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      orderBy('lastMessageTime', 'desc')
    );
  }

  // Get messages for a specific conversation
  getMessagesForConversation(conversationId: string) {
    // Get messages for the conversation
    return query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );
  }

  // Mark messages in a conversation as read
  async markConversationAsRead(userId: string, conversationId: string): Promise<void> {
    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      // Reset unread count for this user in this conversation
      await updateDoc(conversationRef, {
        [`unreadCount_${userId}`]: 0
      });
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      throw error;
    }
  }

  // Accept a connection request
  async acceptRequest(conversationId: string): Promise<void> {
    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        status: 'accepted',
        lastMessageTime: serverTimestamp() // Refresh time for sorting
      });
    } catch (error) {
      console.error('Error accepting request:', error);
      throw error;
    }
  }

  // Update user profile in Firestore
  async updateUserProfile(userId: string, profileData: any): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Get user profile from Firestore with offline support
  async getUserProfile(userId: string): Promise<any> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() };
      }
      return null;
    } catch (error: any) {
      // Handle offline scenario gracefully
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        console.warn('Offline mode: Using cached/default profile data');
        // Return null to indicate offline state - let UI handle fallback
        return null;
      }
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Upload user profile photo (Now using Firestore base64 to stay on free tier)
  async uploadUserPhoto(userId: string, base64Image: string): Promise<string> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        photoURL: base64Image,
        updatedAt: serverTimestamp()
      });
      return base64Image;
    } catch (error) {
      console.error('Error updating user photo in Firestore:', error);
      throw error;
    }
  }
}

export const messagingService = new MessagingService();