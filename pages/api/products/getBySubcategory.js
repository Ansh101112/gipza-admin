import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default async function getBySubcategory(req, res) {
  if (req.method === "GET") {
    const { subCategory } = req.query;
    if (!subCategory) return res.status(400).json({ success: false, message: "Subcategory is required" });
    try {
      const snapshot = await getDocs(query(collection(db, "products"), where("subCategory", "==", subCategory)));
      const products = snapshot.docs.map(doc => doc.data());
      return res.status(200).json({ success: true, products });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}