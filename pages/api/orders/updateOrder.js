import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderId, updateData } = req.body;

  if (!orderId || !updateData || typeof updateData !== 'object') {
    return res.status(400).json({ error: 'Invalid request payload' });
  }

  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      ...updateData,
      updatedAt: new Date(),
    });

    res.status(200).json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
}
