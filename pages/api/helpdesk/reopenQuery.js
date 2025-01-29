import { db } from '@/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'PUT') {
    const { id, reopenMsg } = req.body;

    try {
      const queryRef = doc(db, 'vendorQueries', id);
      await updateDoc(queryRef, {
        status: 'reopened',
        reopenMsg,
        updatedAt: serverTimestamp(),
      });
      return res.status(200).json({ message: 'Query status updated to reopened' });
    } catch (error) {
      return res.status(500).json({ error: 'Error updating query status', details: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
