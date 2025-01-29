import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { queryId, action, message } = req.body;

  if (!queryId || !action || !message) {
    return res.status(400).json({ error: 'Missing required fields (queryId, action, message)' });
  }

  try {
    const queryRef = doc(db, 'vendorQueries', queryId);
    const updateData = {
      status: action === 'resolve' ? 'resolved' : 'closed',
      updatedAt: serverTimestamp(),
    };

    if (action === 'resolve') {
      updateData['resolveMsg'] = message;
    } else if (action === 'close') {
      updateData['closeMsg'] = message;
    } else {
      return res.status(400).json({ error: 'Invalid action type' });
    }

    await updateDoc(queryRef, updateData);

    res.status(200).json({ message: `${action === 'resolve' ? 'Resolve' : 'Close'} message sent successfully` });
  } catch (error) {
    console.error('Error updating query:', error);
    res.status(500).json({ error: 'Failed to update query' });
  }
}
