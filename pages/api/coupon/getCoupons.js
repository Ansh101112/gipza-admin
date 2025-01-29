
import { db } from "@/firebase"; 
import { collection, getDocs, query, orderBy } from "firebase/firestore"; 

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // console.log("Fetching coupons..."); // Debug log

    const couponsRef = collection(db, "coupons"); 
    const q = query(couponsRef, orderBy("createdAt", "desc"));
    const couponsSnapshot = await getDocs(q); 
    
    const coupons = couponsSnapshot.docs.map(doc => {
      const data = doc.data();
      // console.log("Document data:", data); // Debug log
      
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null
      };
    });

    // console.log("Processed coupons:", coupons); // Debug log
    return res.status(200).json({ coupons, status: 200 });

  } catch (error) {
    console.error("Detailed error:", error); // More detailed error logging
    return res.status(500).json({ 
      error: 'Error fetching coupons',
      details: error.message 
    });
  }
}
