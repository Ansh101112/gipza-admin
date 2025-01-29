import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default async function getByCategory(req, res) {
  if (req.method === "GET") {
    const { category } = req.query;
    if (!category) return res.status(400).json({ success: false, message: "Category is required" });
    try {
      const snapshot = await getDocs(query(collection(db, "products"), where("category", "==", category)));
      const products = snapshot.docs.map(doc => doc.data());
      return res.status(200).json({ success: true, products });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}