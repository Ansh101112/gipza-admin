import { db } from "@/firebase";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const blogDoc = await db.collection("blogs").doc(id).get();
      if (!blogDoc.exists) {
        return res.status(404).json({ error: "Blog not found" });
      }
      res.status(200).json(blogDoc.data());
    } catch (error) {
      console.error("Error fetching blog:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
