import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { couponID } = req.query;

    if (!couponID) {
      return res.status(400).json({ error: 'couponID is required' });
    }

    try {
      const couponRef = doc(db, 'coupons', couponID);
      const couponSnap = await getDoc(couponRef);

      if (!couponSnap.exists()) {
        return res.status(404).json({ error: 'Coupon not found' });
      }

      return res.status(200).json({ data: { id: couponSnap.id, ...couponSnap.data() } });
    } catch (error) {
      console.error('Error fetching coupon by ID:', error);
      return res.status(500).json({ error: 'Error fetching coupon by ID' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
