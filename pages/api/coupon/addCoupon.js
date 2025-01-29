import { db } from '@/firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { 
        couponTitle, 
        discount, 
        minPrice, 
        userID,
        role,
        status,
        timesUsed
      } = req.body;
      
      if (!couponTitle || !discount || !minPrice || !userID || !role) {
        return res.status(400).json({ error: 'Required fields are missing' });
      }

      const couponId = 'CID' + Math.floor(Date.now() / 1000);
      
      // Create current timestamp
      const now = new Date();
      const timestamp = Timestamp.fromDate(now);

      const newCoupon = {
        couponTitle,
        discount: Number(discount),
        minPrice: Number(minPrice),
        userID,
        role,
        status,
        timesUsed: Number(timesUsed),
        createdAt: timestamp,
        updatedAt: timestamp
      };

      await setDoc(doc(db, 'coupons', couponId), newCoupon);
      
      return res.status(201).json({ 
        message: 'Coupon added successfully', 
        data: { 
          ...newCoupon,
          id: couponId,
          createdAt: timestamp.toDate(),
          updatedAt: timestamp.toDate()
        }
      });
    } catch (error) {
      console.error('Error details:', error);
      return res.status(500).json({ 
        error: 'Error adding coupon',
        details: error.message 
      });
    }
  }
  
  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}