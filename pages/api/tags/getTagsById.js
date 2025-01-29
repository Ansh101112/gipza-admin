import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Tag id is required' });
      }

      const tagRef = doc(db, 'tags', id);
      const tagSnap = await getDoc(tagRef);

      if (!tagSnap.exists()) {
        return res.status(404).json({ error: 'Tag not found' });
      }

      return res.status(200).json({
        message: 'Tag fetched successfully',
        data: { id: tagSnap.id, ...tagSnap.data() },
      });
    } catch (error) {
      console.error('Error fetching tag:', error);
      return res.status(500).json({ error: 'Error fetching tag' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
