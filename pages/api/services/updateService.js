import { db } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  const { serviceID } = req.query;  // Get serviceID from query parameters

  if (req.method === 'PUT') {
    try {
      // Check if body data is provided
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'No data provided to update' });
      }

      // Update service document by ID
      const serviceRef = doc(db, 'services', serviceID);

      // Update the document in Firestore
      await updateDoc(serviceRef, req.body);

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Error updating service', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
