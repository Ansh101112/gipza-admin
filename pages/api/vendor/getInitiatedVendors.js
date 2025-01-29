// import { collection, getDocs, query, where } from "firebase/firestore";
// import { db } from "@/firebase";

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   try {
//     const vendorsRef = collection(db, "vendors");

//     // Query for vendors where isEcommerce is true
//     const ecommerceQuery = query(
//       vendorsRef,
//       where("personalDetails.isEcommerce", "==", true)
//     );

//     // Query for vendors where isService is true
//     const serviceQuery = query(
//       vendorsRef,
//       where("personalDetails.isService", "==", true)
//     );

//     // Execute both queries
//     const [ecommerceSnapshot, serviceSnapshot] = await Promise.all([
//       getDocs(ecommerceQuery),
//       getDocs(serviceQuery)
//     ]);

//     // Combine results and remove duplicates
//     const ecommerceVendors = [
//       ...ecommerceSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })),
//       ...serviceSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }))
//     ];

//     // Remove duplicates based on the document ID
//     const uniqueVendors = Array.from(new Set(ecommerceVendors.map(v => v.id)))
//       .map(id => ecommerceVendors.find(v => v.id === id));

//     res.status(200).json(uniqueVendors);
//   } catch (error) {
//     console.error("Error fetching ecommerce vendors:", error);
//     res.status(500).json({ error: "Failed to fetch ecommerce vendors" });
//   }
// }




import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const vendorsRef = collection(db, "vendors");
    const snapshot = await getDocs(vendorsRef);
    const vendors = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      vendors.push({
        id: doc.id,
        ...data
      });
    });

    res.status(200).json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
}