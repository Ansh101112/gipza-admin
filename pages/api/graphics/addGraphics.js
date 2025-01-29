import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { title, imageUrl, screenName } = req.body;
      console.log(title, imageUrl, screenName)
      const graphicsRef = collection(db, "graphics");
      const docRef = await addDoc(graphicsRef, { title, imageUrl, screenName });
      res.status(201).json({ id: docRef.id });
    } catch (error) {
      console.error("Error saving graphic:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
