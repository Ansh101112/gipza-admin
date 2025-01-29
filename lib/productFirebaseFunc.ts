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
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { listAll, ref } from "firebase/storage";
import { getVendorFromIdFromFireStore } from "./vendorFirebaseFunc";

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

export async function getProductFromIdFromFireStore(id: string) {
  try {
    const queryCollection = doc(db, "products", id);
    const querySnapshot = await getDoc(queryCollection);
    if (!querySnapshot) {
      throw new Error("no product found");
    }
    console.log("Product fetched successfully");
    return querySnapshot.data();
  } catch (error) {
    console.error("Error updating product status:", error);
    return {};
  }
}

export async function getProductsFromFireStore(status: string) {
  try {
    const productCollection = collection(db, "products");
    const productQuery = query(
      productCollection,
      where("status", "==", status)
    );
    const querySnapshot = await getDocs(productQuery);
    if (querySnapshot.size === 0) {
      return [];
    }
    const productList: any[] = [];

    querySnapshot.forEach((doc) => {
      productList.push({ id: doc.id, ...doc.data() });
    });

    return productList;
  } catch (error) {
    console.log("Error getting product from status", error);
    return [];
  }
}

export async function getOrdersFromFireStore(status: string) {
  try {
    const productCollection = collection(db, "orders");
    const productQuery = query(
      productCollection,
      where("status", "==", status)
    );
    const querySnapshot = await getDocs(productQuery);
    if (querySnapshot.size === 0) {
      return [];
    }
    const productList: any[] = [];

    querySnapshot.forEach((doc) => {
      productList.push({ id: doc.id, ...doc.data() });
    });

    return productList;
  } catch (error) {
    console.log("Error getting product from status", error);
    return [];
  }
}

interface UpdateProps {
  queryObject: any;
  status: any;
}

export async function updateProductsFromFirestore({
  queryObject,
  status,
}: any) {
  try {
    for (const queryItem of queryObject) {
      console.log(queryItem);
      const query = await getProductFromIdFromFireStore(queryItem);

      await updateProductFromFirestore({ queryObject: query, status });
    }
    console.log("All products updated successfully");
    return queryObject;
  } catch (error) {
    console.error("Error updating products:", error);
    throw error;
  }
}
export async function updateProductFromFirestore({
  queryObject,
  status,
}: UpdateProps) {
  try {
    const vendor = await getVendorFromIdFromFireStore(queryObject.vendorId);
    const queryCollection = collection(db, "products");
    const queryQuery = query(
      queryCollection,
      where("productId", "==", queryObject.productId)
    );
    const querySnapshot = await getDocs(queryQuery);
    console.log(querySnapshot);
    if (querySnapshot.size === 0) {
      throw new Error("Product document not found");
    }
    const queryDoc = querySnapshot.docs[0];
    await setDoc(queryDoc.ref, { status: status }, { merge: true });
    const email = vendor?.primanyEmail;
    const name = vendor?.ownerName;
    const subject = "Change of status of Product";
    const message = `Your product ${queryObject.title} has been ${
      status === "approved"
        ? "Approved"
        : status === "disabled"
        ? "Disabled"
        : "Activated"
    }`;
    sendEmail({ email, name, message, subject });

    console.log("Product status updated successfully");
    return queryObject;
  } catch (error) {
    console.error("Error updating query status:", error);
    throw error;
  }
}
