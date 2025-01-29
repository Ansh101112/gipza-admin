// File: /pages/api/vendorBookings.js
import { collection, query, where, getDocs, getCountFromServer } from "firebase/firestore";
import { db } from "@/firebase"; // Adjust based on your project structure

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET method is allowed" });
  }

  const { vendorId } = req.query;

  if (!vendorId) {
    return res.status(400).json({ message: "Missing vendorId in request" });
  }

  try {
    const bookingsCollection = collection(db, "bookings");

    const vendorBookingsQuery = query(
      bookingsCollection,
      where("selectedService.vendorId", "==", vendorId)
    );

    const countSnapshot = await getCountFromServer(vendorBookingsQuery);
    const totalBookingsCount = countSnapshot.data().count;

    const bookingsSnapshot = await getDocs(vendorBookingsQuery);
    const bookings = bookingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  

    res.status(200).json({
      totalBookings: totalBookingsCount,
      bookings,
      success: true
    });
  } catch (error) {
    console.error("Error fetching vendor bookings:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
