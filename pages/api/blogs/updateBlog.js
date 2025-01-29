import { db } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    // Destructure blog data from the body (including id)
    const { id, title, description, summary, image, tags, seo, category, isFeatured, editorDescription } = req.body;

    // Check if required fields are present in the body
    if (!id || !title || !description || !summary || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      // Reference the blog document by ID (coming from the body)
      const blogDocRef = doc(db, "blogs", id);
      const blogDoc = await getDoc(blogDocRef);  // Fetch the document

      // Check if the blog document exists
      if (!blogDoc.exists()) {
        return res.status(404).json({ error: "Blog not found" });
      }

      // Update the blog document with new data
      await updateDoc(blogDocRef, {
        title,
        description,
        summary,
        image,
        tags,
        seo,
        category,
        isFeatured,
        editorDescription,
        updatedAt: new Date(),
      });

      res.status(200).json({ message: "Blog updated successfully" });
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).json({ message: "Error updating the blog" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
