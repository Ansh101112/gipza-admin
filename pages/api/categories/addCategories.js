import { db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, description, slug } = req.body;
      
      if (!name || !description || !slug) {
        return res.status(400).json({ error: 'Required fields are missing' });
      }

      const categoryId = 'CID' + Math.floor(Date.now() / 1000);

      const newCategory = {
        name,
        description,
        slug,
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'categories', categoryId), newCategory);

      return res.status(201).json({
        message: 'Category added successfully',
        data: { ...newCategory, id: categoryId },
      });
    } catch (error) {
      console.error('Error adding category:', error);
      return res.status(500).json({ error: 'Error adding category' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
