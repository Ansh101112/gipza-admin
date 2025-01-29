import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase';

export default async function handler(req, res) {
  const { vendorId } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!vendorId) {
    return res.status(400).json({ error: 'vendorId is required' });
  }

  try {
    const ordersCollection = collection(db, 'bookings');
    const ordersQuery = query(ordersCollection, where('selectedService.vendorId', '==', vendorId));
    const querySnapshot = await getDocs(ordersQuery);

    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders by vendorId:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}
