import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default async function getVendorProducts(req, res) {
  if (req.method === "POST") {
    const { vendorId } = req.body;

    if (!vendorId) {
      return res.status(400).json({ success: false, message: "Vendor ID is required" });
    }

    try {
      const productsRef = collection(db, "products");
      const q = query(productsRef, where("vendorId", "==", vendorId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return res.status(404).json({ success: false, message: "No products found for this vendor" });
      }

      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json({ success: true, products });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
