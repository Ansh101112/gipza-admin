import { db } from '@/firebase';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    try {
      const { couponID, updatedFields } = req.body;
      
      if (!couponID || !updatedFields) {
        return res.status(400).json({ error: 'couponID and updatedFields are required' });
      }

      const couponRef = doc(db, 'coupons', couponID);
      
      // Convert the date to Firestore Timestamp while preserving IST
      const updatedData = {
        ...updatedFields,
        updatedAt: Timestamp.fromDate(new Date(updatedFields.updatedAt))
      };

      await updateDoc(couponRef, updatedData);

      return res.status(200).json({ 
        message: 'Coupon updated successfully',
        updatedAt: updatedData.updatedAt.toDate()
      });
    } catch (error) {
      console.error('Error updating coupon:', error);
      return res.status(500).json({ error: 'Error updating coupon' });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
