
import { db } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: 'Blog slug is required' });
  }

  try {
    const blogRef = doc(db, 'blogs', slug);
    await deleteDoc(blogRef);

    return res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return res.status(500).json({ error: 'Error deleting blog' });
  }
}
