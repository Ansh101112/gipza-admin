import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function getProducts(req, res) {
  if (req.method === "GET") {
    try {
      const snapshot = await getDocs(collection(db, "products"));
      const products = snapshot.docs.map(doc => doc.data());
      return res.status(200).json({ success: true, products });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}