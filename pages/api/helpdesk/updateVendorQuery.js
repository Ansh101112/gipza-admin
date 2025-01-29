import { collection, getDocs, query, where, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { queryId, status } = req.body;

  if (!queryId || !status) {
    return res.status(400).json({ error: 'Missing queryId or status in request body' });
  }

  try {
    const queryCollection = collection(db, 'vendorQueries');
    const queryQuery = query(queryCollection, where('queryId', '==', queryId));
    const querySnapshot = await getDocs(queryQuery);

    if (querySnapshot.empty) {
      return res.status(404).json({ error: 'Query document not found' });
    }

    const queryDoc = querySnapshot.docs[0];
    await setDoc(queryDoc.ref, { status }, { merge: true });

    res.status(200).json({ message: 'Query status updated successfully' });
  } catch (error) {
    console.error('Error updating query:', error);
    res.status(500).json({ error: 'Failed to update query' });
  }
}
