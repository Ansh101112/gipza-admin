import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Category id is required' });
      }

      const categoryRef = doc(db, 'categories', id);
      const categorySnap = await getDoc(categoryRef);

      if (!categorySnap.exists()) {
        return res.status(404).json({ error: 'Category not found' });
      }

      return res.status(200).json({
        message: 'Category fetched successfully',
        data: { id: categorySnap.id, ...categorySnap.data() },
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      return res.status(500).json({ error: 'Error fetching category' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
