import { db } from '@/firebase';
import { collection, query, where, getDocs, setDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { productId, status } = req.body;

    try {
      const productCollection = collection(db, 'products');
      const productQuery = query(productCollection, where('productId', '==', productId));
      const querySnapshot = await getDocs(productQuery);

      if (querySnapshot.size === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const productDoc = querySnapshot.docs[0];
      await setDoc(productDoc.ref, { status }, { merge: true });

      res.status(200).json({ message: 'Product status updated successfully' });
    } catch (error) {
      console.error('Error updating product status:', error);
      res.status(500).json({ error: 'Failed to update product status' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
