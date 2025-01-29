import { db } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { status } = req.query;

    try {
      const productCollection = collection(db, 'products');
      const productQuery = query(productCollection, where('status', '==', status));
      const querySnapshot = await getDocs(productQuery);

      const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
