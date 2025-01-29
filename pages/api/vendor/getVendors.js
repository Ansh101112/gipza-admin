// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { db } from '@/firebase';

// export default async function handler(req, res) {
//   const { isActive, isVerified } = req.query;

//   if (req.method !== 'GET') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     const vendorCollection = collection(db, 'vendors');
//     const vendorQuery = query(
//       vendorCollection,
//       where('isActive', '==', isActive === 'true'),
//       where('isVerified', '==', isVerified === 'true'),
//     );

//     const querySnapshot = await getDocs(vendorQuery);
//     const vendors = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//     res.status(200).json(vendors);
//   } catch (error) {
//     console.error('Error fetching vendors:', error);
//     res.status(500).json({ error: 'Failed to fetch vendors' });
//   }
// }




// api/vendor/getVendors.js
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
