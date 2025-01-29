// pages/api/services/addService.js
import { db } from '@/firebase';  // Assuming firebaseConfig is set up correctly
import { doc, setDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { vendorId, serviceData } = req.body;

    try {
      // Generate custom serviceID: SID{timestamp}
      const serviceID = `SID${Date.now()}`;

      // Reference to the 'services' collection with the custom serviceID as the document ID
      const serviceRef = doc(db, 'services', serviceID);

      // Set the document with custom ID
      await setDoc(serviceRef, {
        ...serviceData,
        vendorId,
        serviceID,  // Add the custom serviceID field
        createdAt: new Date().toISOString(),
      });

      // Return success response with the custom serviceID
      res.status(201).json({ success: true, serviceID });
    } catch (error) {
      res.status(500).json({ message: 'Error adding service', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
