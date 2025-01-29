import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      const { id, title, imageUrl, screenName } = req.body;
      console.log(id, title, imageUrl, screenName)
      if (!id || !title || !imageUrl || !screenName) {
        return res.status(400).json({ error: "All fields are required" });
      }
      
      const graphicDoc = doc(db, "graphics", id);
      await updateDoc(graphicDoc, { title, imageUrl, screenName });
      res.status(200).json({ message: "Graphic updated successfully" });
    } catch (error) {
      console.error("Error updating graphic:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
