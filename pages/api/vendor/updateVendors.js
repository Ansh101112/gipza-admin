import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default async function handler(req, res) {
  const { queryObject, vendorIds } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!queryObject || typeof queryObject !== 'object' || vendorIds.length === 0) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  try {
    const updateResults = await Promise.all(
      vendorIds.map(async (vendorId) => {
        const vendorRef = doc(db, 'vendors', vendorId);
        const vendorSnapshot = await getDoc(vendorRef);

        if (vendorSnapshot.exists()) {
          await updateDoc(vendorRef, queryObject);
          return { id: vendorId, status: 'updated' };
        }
        return { id: vendorId, status: 'not found' };
      })
    );

    res.status(200).json(updateResults);
  } catch (error) {
    console.error('Error updating vendors:', error);
    res.status(500).json({ error: 'Failed to update vendors' });
  }
}
