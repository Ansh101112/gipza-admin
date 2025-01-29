import { db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, description, slug } = req.body;
      
      if (!name || !description || !slug) {
        return res.status(400).json({ error: 'Name, Description, and Slug are required' });
      }

      const tagId = 'TID' + Math.floor(Date.now() / 1000);
      const newTag = {
        name,
        description,
        slug,
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'tags', tagId), newTag);

      return res.status(201).json({ message: 'Tag added successfully', data: { ...newTag, id: tagId } });
    } catch (error) {
      console.error('Error adding tag:', error);
      return res.status(500).json({ error: 'Error adding tag' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
