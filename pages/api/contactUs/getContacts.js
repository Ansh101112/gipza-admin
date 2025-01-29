import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const contactsCollection = collection(db, 'contacts');
      
      const contactsSnapshot = await getDocs(contactsCollection);
      
      const contacts = contactsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json({ data: contacts });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return res.status(500).json({ message: 'Failed to retrieve contacts', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
