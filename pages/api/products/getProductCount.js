import { db } from "@/firebase";
import { collection, query, where, getCountFromServer } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { vendorId } = req.body;

    if (!vendorId) {
      return res.status(400).json({ error: "Vendor ID is required" });
    }

    try {
      const productQuery = query(
        collection(db, "products"),
        where("vendorId", "==", vendorId)
      );
      const snapshot = await getCountFromServer(productQuery);
      const productCount = snapshot.data().count;

      res.status(200).json({ productCount });
    } catch (error) {
      console.error("Error fetching product count:", error);
      res.status(500).json({ error: "Failed to fetch product count" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
