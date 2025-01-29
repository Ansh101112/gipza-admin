import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { imageUrl } = req.body;
      const archiveRef = collection(db, "archive");
      const docRef = await addDoc(archiveRef, { imageUrl });
      res.status(201).json({ id: docRef.id });
    } catch (error) {
      console.error("Error saving archive:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
