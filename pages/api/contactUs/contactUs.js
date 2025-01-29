
import { db } from '@/firebase'; 
import { doc, setDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { personalInfo, serviceInfo } = req.body;

    try {
      
      const uid = `CID${Date.now()}`;

      const combinedData = {
        ...personalInfo,
        ...serviceInfo,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await setDoc(doc(db, 'contacts', uid), combinedData);
      return res.status(200).json({
        message: 'Contact information stored successfully.',
        data: combinedData,
      });
    } catch (error) {
      console.error('Error storing contact information:', error);
      return res.status(500).json({
        message: 'Error storing contact information.',
        error: error.message,
      });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
