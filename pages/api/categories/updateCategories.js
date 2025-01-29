import { db } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const { id, name, description, slug } = req.body;

      if (!id || !name || !description || !slug) {
        return res.status(400).json({ error: 'Required fields are missing' });
      }

      const categoryRef = doc(db, 'categories', id);

      await updateDoc(categoryRef, {
        name,
        description,
        slug,
        updatedAt: new Date(),
      });

      return res.status(200).json({
        message: 'Category updated successfully',
        data: { id, name, description, slug, updatedAt: new Date() },
      });
    } catch (error) {
      console.error('Error updating category:', error);
      return res.status(500).json({ error: 'Error updating category' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
