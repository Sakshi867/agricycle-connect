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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';

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

  // Upload user profile photo
  async uploadUserPhoto(userId: string, file: File): Promise<string> {
    try {
      const fileRef = ref(storage, `user-photos/${userId}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading user photo:', error);
      throw error;
    }
  }
}

export const messagingService = new MessagingService();