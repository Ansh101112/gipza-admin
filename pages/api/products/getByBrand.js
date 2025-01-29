import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default async function getByBrand(req, res) {
  if (req.method === "GET") {
    const { brand } = req.query;
    if (!brand) return res.status(400).json({ success: false, message: "Brand Name is required" });
    try {
      const q = query(collection(db, "products"), where("brand", "==", brand));
      const snapshot = await getDocs(q);
      const products = snapshot.docs.map(doc => doc.data());
      return res.status(200).json({ success: true, products });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
