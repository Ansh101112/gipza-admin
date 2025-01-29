import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Query ID is required' });
    }

    try {
      const queryDoc = doc(db, 'vendorQueries', id);
      const querySnapshot = await getDoc(queryDoc);

      if (querySnapshot.exists()) {
        return res.status(200).json({ query: querySnapshot.data() });
      } else {
        return res.status(404).json({ error: 'Query not found' });
      }
    } catch (error) {
      console.error('Error fetching query by ID:', error);
      return res.status(500).json({ error: 'Error fetching query' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
