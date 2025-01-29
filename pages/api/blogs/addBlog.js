import { db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      category,
      title,
      description,
      editorDescription,
      image,
      isFeatured,
      seo = {}, 
      slug,
      summary,
      tags,
      createdAt,
    } = req.body;

    // Ensure required fields are present
    if (!title || !slug || !description) {
      return res.status(400).json({ error: 'Title, slug, and description are required' });
    }

    const timestamp = Date.now();
    const documentId = `BID${timestamp}`;

    const seoData = {
      description: seo.description || '',
      image: seo.image || null,
      keywords: seo.keywords || [],
      title: seo.title || '',
    };

    try {
      const blogRef = doc(db, 'blogs', documentId);
      await setDoc(blogRef, {
        category: category || null,
        title,
        description,
        editorDescription: editorDescription || null,
        image: image || null, // Handle undefined image
        isFeatured: isFeatured || false,
        seo: seoData,
        slug,
        summary: summary || '',
        tags: tags || [],
        createdAt: createdAt || new Date().toISOString(),
      });

      return res.status(201).json({ message: 'Blog created successfully', id: documentId });
    } catch (error) {
      console.error('Error adding blog:', error);
      return res.status(500).json({ error: 'Error adding blog' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
