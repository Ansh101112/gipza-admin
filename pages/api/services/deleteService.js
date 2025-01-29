// pages/api/services/deleteService.js
import { db } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  const { serviceID } = req.query;

  if (req.method === 'DELETE') {
    try {
      // Delete service by ID
      const serviceRef = doc(db, 'services', serviceID);
      await deleteDoc(serviceRef);

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting service', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
