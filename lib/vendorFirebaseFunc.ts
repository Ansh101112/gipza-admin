import { db, storage } from "@/firebase";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  snapshotEqual,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { listAll, ref } from "firebase/storage";

interface sendMail {
  email: string;
  name: string;
  message: string;
  subject: string;
}
const sendEmail = async ({ email, name, subject, message }: sendMail) => {
  try {
    const response = await fetch("/api/zeptomail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name, subject, message }),
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export async function getVendorFromIdFromFireStore(id: string) {
  try {
    const queryCollection = doc(db, "vendors", id);
    const querySnapshot = await getDoc(queryCollection);
    if (!querySnapshot) {
      throw new Error("no vendor found");
    }
    console.log("Vendor fetched successfully");
    return querySnapshot.data();
  } catch (error) {
    console.error("Error updating vendor status:", error);
    return {};
  }
}

export async function getVendorsFromFireStore(
  isActive: boolean,
  isVerified: boolean
) {
  try {
    const vendorCollection = collection(db, "vendors");
    const vendorQuery = query(
      vendorCollection,
      where("isActive", "==", isActive),
      where("isVerified", "==", isVerified)
    );
    const querySnapshot = await getDocs(vendorQuery);
    if (querySnapshot.size === 0) {
      return [];
    }
    const vendorList: any[] = [];

    querySnapshot.forEach((doc) => {
      vendorList.push({ id: doc.id, ...doc.data() });
    });

    return vendorList;
  } catch (error) {
    console.log("Error getting seller from id", error);
    return [];
  }
}

interface UpdateProps {
  queryObject: any;
  active: boolean;
  verify: boolean;
}

export async function updateVendorsFromFirestore({
  queryObject,
  verify,
  active,
}: any) {
  try {
    for (const queryItem of queryObject) {
      console.log(queryItem);
      const query = await getVendorFromIdFromFireStore(queryItem);

      await updateVendorFromFirestore({ queryObject: query, active, verify });
    }
    console.log("All vendors updated successfully");
    return queryObject;
  } catch (error) {
    console.error("Error updating vendors:", error);
    throw error;
  }
}

export async function updateVendorFromFirestore({
  queryObject,
  active,
  verify,
}: UpdateProps) {
  try {
    const queryCollection = collection(db, "vendors");
    const queryQuery = query(
      queryCollection,
      where("vendorId", "==", queryObject.vendorId)
    );
    const querySnapshot = await getDocs(queryQuery);
    console.log(querySnapshot);
    if (querySnapshot.size === 0) {
      throw new Error("Vendor document not found");
    }

    const queryDoc = querySnapshot.docs[0];
    await setDoc(
      queryDoc.ref,
      { isActive: active, isVerified: verify },
      { merge: true }
    );
    const email = queryObject.primanyEmail;
    const name = queryObject.ownerName;
    const subject = "Change of status";
    const message = `Your account has been ${
      active ? (verify ? "Verified" : "Unverified") : "Disabled"
    }`;
    sendEmail({ email, name, message, subject });
    console.log("Vendor status updated successfully");
    return queryObject;
  } catch (error) {
    console.error("Error updating query status:", error);
    throw error;
  }
}

export const getEachVendorDetail = async () => {
  try {
    const vendorsRef = collection(db, "vendors");
    const snapshot = await getDocs(vendorsRef);
    const getEachVendorDetail: Array<any> = [];
    const userID = snapshot.docs.map((doc) => doc.id);


    snapshot.forEach((doc) => {
      const vendorData = doc.data();

      getEachVendorDetail.push({
        uid: doc.id,
        ...vendorData,
      });
    });
    console.log(getEachVendorDetail);
    //passing the uid to vendorDetails page    
    return userID;
  } catch (error) {
    console.log("Error getting vendor details", error);
    throw error;
  }
};
