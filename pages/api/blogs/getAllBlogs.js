import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    // Reference the 'blogs' collection
    const blogsRef = collection(db, 'blogs');
    const blogsSnap = await getDocs(blogsRef);

    if (blogsSnap.empty) {
      return res.status(404).json({ error: 'No blogs found' });
    }

    // Map over the query snapshot and return the data
    const blogs = blogsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({ data: blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return res.status(500).json({ error: 'Error fetching blogs' });
  }
}
