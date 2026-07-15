import { db } from "@/firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

const bikesCollection = collection(db, "bikes");

export async function addBike(data: any) {
  await addDoc(bikesCollection, data);
}

export async function getBikes() {
  const q = query(bikesCollection, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}