import { db } from "@/firebase/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

const bikesCollection = collection(db, "bikes");

// Add Bike
export async function addBike(data: any) {
  return await addDoc(bikesCollection, {
    ...data,
    createdAt: serverTimestamp(),
  });
}

// Get All Bikes
export async function getBikes() {
  const q = query(bikesCollection, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

// Get Bike By Slug
export async function getBikeBySlug(slug: string) {
  const q = query(
    bikesCollection,
    where("slug", "==", slug)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  };
}

// Get Bike By ID
export async function getBike(id: string) {
  const ref = doc(db, "bikes", id);

  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

// Update Bike
export async function updateBike(id: string, data: any) {
  const ref = doc(db, "bikes", id);

  return await updateDoc(ref, data);
}

// Delete Bike
export async function deleteBike(id: string) {
  const ref = doc(db, "bikes", id);

  return await deleteDoc(ref);
}