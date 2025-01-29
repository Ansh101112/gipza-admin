import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const vendorsRef = collection(db, "vendors");
    const ecommerceQuery = query(
      vendorsRef,
      where("personalDetails.isEcommerce", "==", true),
      where("personalDetails.isService", "==", true)
    );
    const querySnapshot = await getDocs(ecommerceQuery);

    const ecommerceVendors = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(ecommerceVendors);
  } catch (error) {
    console.error("Error fetching ecommerce vendors:", error);
    res.status(500).json({ error: "Failed to fetch ecommerce vendors" });
  }
}
