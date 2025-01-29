import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // Validate that ID is provided
  if (!id) {
    return res.status(400).json({ error: 'ID is missing' });
  }

  try {
    const vendorsCollection = collection(db, 'vendors');
    console.log(id, "getvendorByid")
    const vendorQuery = query(vendorsCollection, where('uid', '==', id));
    const querySnapshot = await getDocs(vendorQuery);

    if (querySnapshot.empty) {
      return res.status(404).json({ error: 'No vendor found with the specified UID' });
    }

    const vendor = querySnapshot.docs[0].data();

    return res.status(200).json({ vendor });
  } catch (error) {
    console.error('Error fetching vendor:', error);
    return res.status(500).json({ error: 'Failed to fetch vendor' });
  }
}
