import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const tagsRef = collection(db, 'tags');
      const querySnapshot = await getDocs(tagsRef);
      const tags = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      return res.status(200).json({ message: 'Tags fetched successfully', data: tags });
    } catch (error) {
      console.error('Error fetching tags:', error);
      return res.status(500).json({ error: 'Error fetching tags' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
