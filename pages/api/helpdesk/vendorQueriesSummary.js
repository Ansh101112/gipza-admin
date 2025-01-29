import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "@/firebase"; // Adjust this path based on your project structure

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET method is allowed" });
  }

  const { vendorId } = req.query;

  if (!vendorId) {
    return res.status(400).json({ message: "Missing vendorId in request" });
  }

  try {
    // Reference to the 'queries' collection
    const queriesCollection = collection(db, "vendorQueries");

    // Query to get total queries for the vendor
    const totalQueriesQuery = query(queriesCollection, where("vendorId", "==", vendorId));
    const totalQueriesSnapshot = await getCountFromServer(totalQueriesQuery);
    const totalQueriesCount = totalQueriesSnapshot.data().count;

    // Query to get unresolved queries for the vendor
    const unresolvedQueriesQuery = query(
      queriesCollection,
      where("vendorId", "==", vendorId),
      where("status", "!=", "closed")
    );
    const unresolvedQueriesSnapshot = await getCountFromServer(unresolvedQueriesQuery);
    const unresolvedQueriesCount = unresolvedQueriesSnapshot.data().count;

    // Return counts in response
    res.status(200).json({
      totalQueries: totalQueriesCount,
      unresolvedQueries: unresolvedQueriesCount,
    });
  } catch (error) {
    console.error("Error fetching vendor queries:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
