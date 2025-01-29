import { db } from '@/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, formData } = req.body;

    if (!userId || !formData) {
      return res.status(400).json({ error: 'User ID and form data are required.' });
    }

    try {
      const bookingID = `BID${Date.now()}`;
      const bookingsRef = collection(db, 'bookings');

      await setDoc(doc(bookingsRef, bookingID), {
        ...formData,
        bookingID,
        userId,
        status:'incoming',
        createdAt: new Date().toISOString(),
      });

      res.status(200).json({ success: true, bookingID });
    } catch (error) {
      console.error('Error booking service:', error);
      res.status(500).json({ error: 'An error occurred while booking the service.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
