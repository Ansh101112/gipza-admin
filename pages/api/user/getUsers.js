import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/firebase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const usersCollection = collection(db, 'users');
    const usersQuery = query(usersCollection);
    const querySnapshot = await getDocs(usersQuery);

    const users = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        username: data.username,
        email: data.email,
        createdAt: data.createdAt,
        addresses: data.addresses || [],
        uid: data.uid,
        status: data.status || 'active'
      };
    });

    users.sort((a, b) => {
      if (b.createdAt?.seconds && a.createdAt?.seconds) {
        return b.createdAt.seconds - a.createdAt.seconds;
      }
      return 0;
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}
