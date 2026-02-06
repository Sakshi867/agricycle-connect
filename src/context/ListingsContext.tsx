import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { collection, addDoc, updateDoc, doc, getDocs, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
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
  const { currentUser } = useAuth();
  const [farmerListings, setFarmerListings] = useState<Listing[]>([]);
  const [buyerListings, setBuyerListings] = useState<Listing[]>([]);

  // Load listings based on user role with proper error handling
  useEffect(() => {
    if (!currentUser || !currentUser.role) return;

    let unsubscribe: (() => void) | null = null;

    try {
      if (currentUser.role === 'farmer') {
        // Subscribe to farmer's own listings
        const q = query(
          collection(db, 'listings'),
          where('farmerId', '==', currentUser.uid),
          orderBy('date', 'desc')
        );

        unsubscribe = onSnapshot(q, 
          (snapshot) => {
            const listings = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Listing[];
            console.log('Farmer listings updated:', listings.length);
            setFarmerListings(listings);
          },
          (error) => {
            console.error('Error fetching farmer listings:', error);
          }
        );
      } else if (currentUser.role === 'buyer') {
        // Buyers see all active listings
        const q = query(
          collection(db, 'listings'),
          where('status', '==', 'active'),
          orderBy('date', 'desc')
        );

        unsubscribe = onSnapshot(q, 
          (snapshot) => {
            const listings = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Listing[];
            console.log('Buyer listings updated:', listings.length);
            setBuyerListings(listings);
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
  }, [currentUser]);

  const addListing = async (listing: Omit<Listing, "id" | "date" | "status" | "inquiries" | "farmerId" | "farmerName">) => {
    if (!currentUser) {
      throw new Error('User must be logged in to add a listing');
    }

    const newListing = {
      ...listing,
      farmerId: currentUser.uid,
      farmerName: currentUser.displayName || currentUser.email || 'Anonymous Farmer',
      date: new Date().toISOString().split('T')[0],
      status: "active" as const,
      inquiries: 0,
    };

    try {
      console.log('Adding new listing:', newListing);
      const docRef = await addDoc(collection(db, 'listings'), newListing);
      console.log('Listing added with ID:', docRef.id);
      
      // Give Firestore time to sync before returning
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding listing:', error);
      throw error;
    }
  };

  const updateListing = async (id: string, updates: Partial<Listing>) => {
    try {
      const listingRef = doc(db, 'listings', id);
      await updateDoc(listingRef, updates);
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