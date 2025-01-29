// pages/api/services/getServiceByVendorId.js
import { db } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  const { vendorId } = req.query;

  if (req.method === 'GET') {
    try {
      // Get services by vendor ID
      const servicesRef = collection(db, 'services');
      const q = query(servicesRef, where('vendorId', '==', vendorId));
      const querySnapshot = await getDocs(q);

      const services = [];
      querySnapshot.forEach((doc) => {
        services.push({ id: doc.id, ...doc.data() });
      });

      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching services', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
