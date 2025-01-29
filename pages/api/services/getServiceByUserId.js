// pages/api/services/getServiceByUserId.js
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
      const bookingsRef = collection(db, 'bookings');
      const querySnapshot = await getDocs(bookingsRef);
      
      const userBookings = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === userId) {
          userBookings.push({ id: doc.id, ...data });
        }
      });

      res.status(200).json(userBookings);
    } catch (error) {
      console.error('Error fetching bookings for user:', error);
      res.status(500).json({ error: 'Unable to fetch bookings. Please try again later.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
