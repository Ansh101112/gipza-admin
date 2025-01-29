import { db } from "@/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      const archiveDoc = doc(db, "archive", id);
      await deleteDoc(archiveDoc);
      res.status(200).json({ message: "Archive deleted successfully" });
    } catch (error) {
      console.error("Error deleting archive:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
