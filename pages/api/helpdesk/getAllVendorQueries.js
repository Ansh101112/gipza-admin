import { db } from '@/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: "Missing 'status' parameter." });
      }

      const queriesCollection = collection(db, 'vendorQueries');
      const queriesQuery = query(queriesCollection, where('status', '==', status));
      const querySnapshot = await getDocs(queriesQuery);

      const queries = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      queries.sort((a, b) => {
        const dateA = a.updatedAt?.toMillis() || 0;
        const dateB = b.updatedAt?.toMillis() || 0;
        return dateB - dateA;
      });

      return res.status(200).json({ queries });
    } catch (error) {
      console.error('Error fetching vendor queries:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
}
