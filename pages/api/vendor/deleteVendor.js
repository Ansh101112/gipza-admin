import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { vendorId } = req.body;
    await deleteDoc(doc(db, "vendors", vendorId));
    res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    res.status(500).json({ error: "Failed to delete vendor" });
  }
}
