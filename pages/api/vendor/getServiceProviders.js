import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const vendorsRef = collection(db, 'vendors');
    const serviceQuery = query(
      vendorsRef,
      where('personalDetails.isService', '==', true)
    );
    const querySnapshot = await getDocs(serviceQuery);

    const serviceProviders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(serviceProviders);
  } catch (error) {
    console.error('Error fetching service providers:', error);
    res.status(500).json({ error: 'Failed to fetch service providers' });
  }
}
