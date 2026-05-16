import { db } from '../lib/firebase';
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, 
  addDoc, deleteDoc, query, orderBy 
} from 'firebase/firestore';

// ─── PROFILE / SINGLETON DOCUMENTS ──────────────────────────────
export const getProfileData = async () => {
  try {
    const docRef = doc(db, 'settings', 'profile');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return docSnap.data();
    return null;
  } catch (error) {
    console.error("Error fetching profile: ", error);
    throw error;
  }
};

export const updateProfileData = async (data) => {
  try {
    const docRef = doc(db, 'settings', 'profile');
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error("Error updating profile: ", error);
    throw error;
  }
};

// ─── GENERIC COLLECTIONS ─────────────────────────────────────────
export const getCollectionData = async (collectionName) => {
  try {
    const q = query(collection(db, collectionName));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error fetching ${collectionName}: `, error);
    throw error;
  }
};

export const addCollectionItem = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error adding to ${collectionName}: `, error);
    throw error;
  }
};

export const updateCollectionItem = async (collectionName, id, data) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error(`Error updating ${collectionName}: `, error);
    throw error;
  }
};

export const deleteCollectionItem = async (collectionName, id) => {
  try {
    console.log(`Attempting to delete from ${collectionName} with ID:`, id);
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    console.log(`Successfully deleted from ${collectionName} with ID:`, id);
  } catch (error) {
    console.error(`Error deleting from ${collectionName}: `, error);
    throw error;
  }
};


