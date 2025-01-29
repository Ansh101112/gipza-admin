import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { vendorId, updatedDetails } = req.body;
  console.log( vendorId, updatedDetails)

  if (!vendorId ) {
    return res.status(400).json({ message: "Invalid vendor ID" });
  }

  if (!updatedDetails || typeof updatedDetails !== "object") {
    return res.status(400).json({ message: "Invalid updated details" });
  }

  try {
    const vendorRef = doc(db, "vendors", vendorId);
    await setDoc(vendorRef, updatedDetails, { merge: true });
    
    res.status(200).json({ message: "Vendor updated successfully" });
  } catch (error) {
    console.error("Error updating vendor:", error);
    res.status(500).json({ message: "Failed to update vendor" });
  }
}
