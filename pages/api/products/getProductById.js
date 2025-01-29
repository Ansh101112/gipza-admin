import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export default async function getProductById(req, res) {
  if (req.method === "GET") {
    const { productId } = req.query;
    if (!productId) return res.status(400).json({ success: false, message: "productId is required" });
    try {
      const productRef = doc(db, "products", productId);
      const docSnap = await getDoc(productRef);
      if (docSnap.exists()) {
        return res.status(200).json({ success: true, product: docSnap.data() });
      } else {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}