import { db, storage } from "@/firebase";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { listAll, ref } from "firebase/storage";

interface addTagToFireStoreProps {
  name: string;
  slug: string;
  description: string;
}
export async function addTagToFireStore({
  name,
  slug,
  description,
}: addTagToFireStoreProps) {
  try {
    const docRef = await addDoc(collection(db, "tags"), {
      name,
      slug,
      description,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });
    console.log("Tag written with ID: ", docRef.id);
  } catch (error) {
    console.log("Error in adding Tag", error);
    return false;
  }
}


export async function getAllTagsFromFireStore() {
  try {
    const tagsCollection = collection(db, "tags");
    const tagsQuery = query(tagsCollection);

    const querySnapshot = await getDocs(tagsQuery);

    const tags = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    tags.sort((a, b) => {
      //@ts-ignore
      return b.updatedAt - a.updatedAt;
    });
    return tags;
  } catch (error) {
    console.error("Error fetching all tags:", error);
    return [];
  }
}
