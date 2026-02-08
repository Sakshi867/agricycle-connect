import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { collection, addDoc, updateDoc, doc, getDocs, query, where, orderBy, onSnapshot, serverTimestamp, Timestamp, limit, setDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/services/firebase/config';
import { useAuth } from '@/context/AuthContext';

interface Listing {
  id: string; // Changed from number to string for Firebase compatibility
  title: string;
  quantity: string;
  unit: string;
  price: string;
  description: string;
  availability: string;
  quality: string;
  confidence?: number;
  location: string;
  farmerName: string;
  farmerId: string; // Added farmer ID for proper ownership
  date: string;
  status: "active" | "sold" | "draft";
  image?: string;
  createdAt?: any; // Firestore Timestamp
  isBookmarked?: boolean;
  inquiries?: number;
}

interface ListingsContextType {
  farmerListings: Listing[];
  buyerListings: Listing[];
  addListing: (listing: Omit<Listing, "id" | "date" | "status" | "inquiries" | "farmerId" | "farmerName">) => Promise<string>;
  updateListing: (id: string, updates: Partial<Listing>) => Promise<void>;
  toggleBookmark: (id: string) => void;
  getListingsByFarmer: (farmerId: string) => Listing[];
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export const ListingsProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser, role } = useAuth();
  const [farmerListings, setFarmerListings] = useState<Listing[]>([]);
  const [buyerListings, setBuyerListings] = useState<Listing[]>([]);

  // Load listings based on user role with proper error handling
  useEffect(() => {
    if (!currentUser || !role) return;

    let unsubscribe: (() => void) | null = null;

    try {
      if (role === 'farmer') {
        // Subscribe to farmer's own listings
        const q = query(
          collection(db, 'listings'),
          where('farmerId', '==', currentUser.uid),
          orderBy('createdAt', 'desc'),
          limit(50)
        );

        unsubscribe = onSnapshot(q, { includeMetadataChanges: true },
          (snapshot) => {
            const listings = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Listing[];

            // Client-side sort: new to old
            const sortedListings = [...listings].sort((a, b) => {
              // For pending writes, serverTimestamp() is null locally.
              // We use a fallback (current time) to ensure they stay at the top.
              const timeA = a.createdAt?.seconds || (Date.now() / 1000);
              const timeB = b.createdAt?.seconds || (Date.now() / 1000);
              return timeB - timeA;
            });

            console.log('Farmer listings updated:', sortedListings.length, snapshot.metadata.hasPendingWrites ? '(pending)' : '(synced)');
            setFarmerListings(sortedListings);
          },
          (error) => {
            console.error('Error fetching farmer listings:', error);
          }
        );
      } else if (role === 'buyer') {
        // Buyers see all active listings
        const q = query(
          collection(db, 'listings'),
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc'),
          limit(50)
        );

        unsubscribe = onSnapshot(q, { includeMetadataChanges: true },
          (snapshot) => {
            const listings = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Listing[];

            // Client-side sort: new to old
            const sortedListings = [...listings].sort((a, b) => {
              const timeA = a.createdAt?.seconds || (Date.now() / 1000);
              const timeB = b.createdAt?.seconds || (Date.now() / 1000);
              return timeB - timeA;
            });

            console.log('Buyer listings updated:', sortedListings.length, snapshot.metadata.hasPendingWrites ? '(pending)' : '(synced)');
            setBuyerListings(sortedListings);
          },
          (error) => {
            console.error('Error fetching buyer listings:', error);
          }
        );
      }
    } catch (error) {
      console.error('Error setting up listings subscription:', error);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    };
  }, [currentUser, role]);

  const addListing = async (listing: Omit<Listing, "id" | "date" | "status" | "inquiries" | "farmerId" | "farmerName">) => {
    if (!currentUser) {
      throw new Error('User must be logged in to add a listing');
    }

    // 1. Generate a new document reference to get the ID beforehand
    const docRef = doc(collection(db, 'listings'));
    const id = docRef.id;

    const newListing: Listing = {
      ...listing,
      id,
      farmerId: currentUser.uid,
      farmerName: currentUser.displayName || currentUser.email || 'Anonymous Farmer',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date(), // For optimistic UI
      status: "active" as const,
      inquiries: 0,
    };

    // Optimistic Update
    setFarmerListings(prev => [newListing, ...prev]);
    setBuyerListings(prev => [newListing, ...prev]);

    try {
      console.log('Adding new listing to Firestore:', newListing);
      let finalImageUrl = newListing.image;

      // 1. If image is base64, upload to Firebase Storage
      if (newListing.image && newListing.image.startsWith('data:image')) {
        console.log('Uploading image to Firebase Storage...');
        const storageRef = ref(storage, `listings/${currentUser.uid}/${Date.now()}_listing.jpg`);
        const uploadResult = await uploadString(storageRef, newListing.image, 'data_url');
        finalImageUrl = await getDownloadURL(uploadResult.ref);
        console.log('Image uploaded successfully:', finalImageUrl);
      }

      const { id: _, ...listingData } = newListing;

      // Sanitization: Remove any undefined values that Firestore would reject
      const sanitizedData = Object.fromEntries(
        Object.entries(listingData).filter(([_, v]) => v !== undefined)
      );

      // Use serverTimestamp for Firestore and the storage URL for the image
      await setDoc(docRef, {
        ...sanitizedData,
        image: finalImageUrl,
        createdAt: serverTimestamp()
      });
      console.log('Successfully wrote to Firestore with ID:', id);

      // Return immediately, the onSnapshot will handle replacing the temp data
      return id;
    } catch (error) {
      // Rollback on error
      setFarmerListings(prev => prev.filter(l => l.id !== id));
      setBuyerListings(prev => prev.filter(l => l.id !== id));
      console.error('Error adding listing:', error);
      throw error;
    }
  };

  const updateListing = async (id: string, updates: Partial<Listing>) => {
    try {
      let finalUpdates = { ...updates };

      // If updating image and it's base64, upload to Storage
      if (updates.image && updates.image.startsWith('data:image')) {
        console.log('Uploading updated image to Firebase Storage...');
        const storageRef = ref(storage, `listings/${currentUser?.uid || 'anonymous'}/${Date.now()}_update.jpg`);
        const uploadResult = await uploadString(storageRef, updates.image, 'data_url');
        const downloadUrl = await getDownloadURL(uploadResult.ref);
        finalUpdates.image = downloadUrl;
      }

      const listingRef = doc(db, 'listings', id);
      await updateDoc(listingRef, finalUpdates);
      // The onSnapshot will automatically update the state
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  };

  const toggleBookmark = (id: string) => {
    // For now, just update local state
    // In a full implementation, this would update Firestore
    setBuyerListings(prev =>
      prev.map(listing =>
        listing.id === id
          ? { ...listing, isBookmarked: !listing.isBookmarked }
          : listing
      )
    );
  };

  const getListingsByFarmer = (farmerId: string) => {
    return farmerListings.filter(listing => listing.farmerId === farmerId);
  };

  return (
    <ListingsContext.Provider
      value={{
        farmerListings,
        buyerListings,
        addListing,
        updateListing,
        toggleBookmark,
        getListingsByFarmer,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
};

export const useListings = () => {
  const context = useContext(ListingsContext);
  if (context === undefined) {
    throw new Error("useListings must be used within a ListingsProvider");
  }
  return context;
};