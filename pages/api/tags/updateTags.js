import { db } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { id, name, description, slug } = req.body;

      if (!id || !name || !description || !slug) {
        return res.status(400).json({ error: 'Id, Name, Description, and Slug are required' });
      }

      const tagRef = doc(db, 'tags', id);
      const tagSnap = await getDoc(tagRef);

      if (!tagSnap.exists()) {
        return res.status(404).json({ error: 'Tag not found' });
      }

      const updatedTag = { name, description, slug, updatedAt: new Date() };
      await updateDoc(tagRef, updatedTag);

      return res.status(200).json({
        message: 'Tag updated successfully',
        data: { id, ...updatedTag },
      });
    } catch (error) {
      console.error('Error updating tag:', error);
      return res.status(500).json({ error: 'Error updating tag' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
