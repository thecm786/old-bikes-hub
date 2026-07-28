import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/firebase";

export async function uploadImage(file: File) {
  if (!file) {
    throw new Error("No file selected");
  }

  const fileName = `${Date.now()}-${file.name}`;

  const storageRef = ref(
    storage,
    `bikes/${fileName}`
  );

  await uploadBytes(storageRef, file);

  const imageUrl = await getDownloadURL(storageRef);

  return imageUrl;
}