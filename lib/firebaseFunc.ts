import { db, storage } from "@/firebase";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
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
import { getDownloadURL, listAll, ref } from "firebase/storage";

interface addBlogToFireStoreProps {
  title: string;
  description: string;
  summary: string;
  category: string;
  featured: boolean;
  seoTitle: string;
  seoAuthor: string;
  seoDescription: string;
  seoImage: string;
  userId: string;
  editorData: string;
  tags: [];
  seoKeywords: [];
  slug: string;
  featuredImage: string;
  altText: string;
  imageTitle: string;
}

export async function addBlogToFireStore({
  title,
  description,
  summary,
  category,
  featured,
  seoTitle,
  seoAuthor,
  seoDescription,
  seoImage,
  userId,
  altText,
  imageTitle,
  editorData,
  tags,
  seoKeywords,
  slug,
  featuredImage,
}: addBlogToFireStoreProps) {
  try {
    const docRef = await addDoc(collection(db, "blogs"), {
      title,
      description,
      summary,
      category,
      featured,
      seoTitle,
      seoAuthor,
      seoDescription,
      seoImage,
      userId,
      editorData,
      altText,
      imageTitle,
      tags,
      seoKeywords,
      slug,
      featuredImage,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });
    console.log("Product written with ID: ", docRef.id);
  } catch (error) {
    console.log("Error in adding Product", error);
    return false;
  }
}

interface getBlogFromFireStoreProps {
  name: string;
  option: "category" | "tag" | "author";
}

export async function getBlogFromFireStore({
  name,
  option,
}: getBlogFromFireStoreProps) {
  try {
    let queryRef;
    const blogsCollection = collection(db, "blogs");
    console.log(name);
    console.log(option);
    if (option === "category") {
      queryRef = query(blogsCollection, where("category", "==", name));
    } else if (option === "tag") {
      queryRef = query(blogsCollection, where("tags", "array-contains", name));
    } else if (option === "author") {
      queryRef = query(blogsCollection, where("seoAuthor", "==", name));
    }

    if (queryRef) {
      const querySnapshot = await getDocs(queryRef);
      const blogs = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...(typeof data === 'object' && data !== null ? data : {}),
        };
      });
      return blogs;
    } else {
      console.log("No matching documents found");
      return [];
    }
  } catch (error) {
    console.error("Error getting blogs:", error);
    return [];
  }
}

interface Blog {
  id: string;
  title: string;
  description: string;
  summary: string;
  category: string;
  featured: boolean;
  seoTitle: string;
  seoAuthor: string;
  seoDescription: string;
  seoImage: string;
  userId: string;
  editorData: string;
  tags: [];
  seoKeywords: [];
  slug: string;
  featuredImage: string;
}

interface DeleteBLogFromFireStore {
  blogs: Blog[];
}
export async function deleteBLogFromFireStore({
  blogs,
}: DeleteBLogFromFireStore) {
  try {
    const batch = writeBatch(db);

    blogs.forEach((blog) => {
      const blogRef = doc(db, "blogs", blog.id);
      batch.delete(blogRef);
    });

    await batch.commit();

    console.log("Blogs deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting blogs:", error);
    return false;
  }
}
interface UpdateBlogFromFirestoreProps {
  blogs: Blog[];
  name: string;
  originalName: string;
  option: "category" | "tags" | "author";
}

export async function updateBlogFromFirestore({
  blogs,
  name,
  originalName,
  option,
}: UpdateBlogFromFirestoreProps): Promise<boolean> {
  try {
    const batch = writeBatch(db);

    blogs.forEach((blog) => {
      const blogRef = doc(db, "blogs", blog.id);
      if (option == "category") {
        batch.update(blogRef, {
          ...blog,
          category: name,
        });
      }
      if (option == "author") {
        batch.update(blogRef, {
          ...blog,
          seoAuthor: name,
        });
      }
      if (option == "tags") {
        const tagIndex = blog.tags.findIndex(
          (tag: string) => tag === originalName
        );
        if (tagIndex !== -1) {
          const updatedTags = [...(blog.tags as string[])];
          updatedTags[tagIndex] = name;
          batch.update(blogRef, {
            ...blog,
            tags: updatedTags,
          });
        }
      }
    });

    await batch.commit();

    console.log("Blogs updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating blogs:", error);
    return false;
  }
}

interface addCategoryToFireStoreProps {
  name: string;
  slug: string;
  description: string;
}
export async function addCategoryToFireStore({
  name,
  slug,
  description,
}: addCategoryToFireStoreProps) {
  try {
    const docRef = await addDoc(collection(db, "categories"), {
      name,
      slug,
      description,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });
    console.log("Category written with ID: ", docRef.id);
  } catch (error) {
    console.log("Error in adding Category", error);
    return false;
  }
}
interface addAuthorToFireStoreProps {
  name: string;
  slug: string;
  description: string;
}
export async function addAuthorToFireStore({
  name,
  slug,
  description,
}: addAuthorToFireStoreProps) {
  try {
    const docRef = await addDoc(collection(db, "authors"), {
      name,
      slug,
      description,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });
    console.log("Author written with ID: ", docRef.id);
  } catch (error) {
    console.log("Error in adding Author", error);
    return false;
  }
}

interface AddCategoryProps {
  name: string;
  slug: string;
  description: string;
  option: string;
}

export async function addToFirestore({
  name,
  slug,
  description,
  option,
}: AddCategoryProps) {
  try {
    let collectionRef;
    if (option === "category") {
      collectionRef = "categories";
    } else if (option === "tags") {
      collectionRef = "tags";
    } else if (option === "author") {
      collectionRef = "authors";
    } else {
      console.log("Invalid option");
      return null;
    }

    const collectionDB = collection(db, collectionRef);
    const docRef = await addDoc(collectionDB, {
      name,
      slug,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("Document added successfully");
    return docRef;
  } catch (error) {
    console.error("Error adding document:", error);
    return null;
  }
}

interface updateCategoryProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  option: string;
}
export async function updateFromFireStore({
  id,
  name,
  slug,
  description,
  option,
}: updateCategoryProps) {
  try {
    let docRef;
    if (option === "category") {
      docRef = doc(db, "categories", id);
    } else if (option === "tags") {
      docRef = doc(db, "tags", id);
    } else if (option === "author") {
      docRef = doc(db, "authors", id);
    }
    if (docRef) {
      const updatedDoc = await updateDoc(docRef, {
        name,
        slug,
        description,
        updatedAt: new Date(Date.now()),
      });
    } else {
      console.log("doc not found");
    }
    console.log("updated successfully");
    return docRef;
  } catch (error) {
    console.error("Error updating tag:", error);
  }
}

interface UpdateProps {
  queryObject: any;
  status: any;
}

interface deleteProps {
  id: string;
  option: string;
}
export async function deleteFromFireStore({ id, option }: deleteProps) {
  let docRef;
  if (option === "category") {
    docRef = doc(db, "categories", id);
  } else if (option === "tags") {
    docRef = doc(db, "tags", id);
  } else if (option === "author") {
    docRef = doc(db, "authors", id);
  }
  if (docRef) {
    deleteDoc(docRef)
      .then(() => {
        console.log("Entire Document has been deleted successfully.");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return docRef;
}

export async function updateQueriesFromFirestore({
  queryObject,
  status,
}: any): Promise<void> {
  try {
    for (const queryItem of queryObject) {
      const query = await getQueryFromIdFromFireStore(queryItem);
      console.log(query);
      await updateQueryFromFirestore(query, status);
    }
    console.log("All queries updated successfully");
  } catch (error) {
    console.error("Error updating queries:", error);
    throw error;
  }
}
export async function updateQueryFromFirestore(queryId: string, status: string): Promise<void> {
  try {
    const response = await fetch('/api/helpdesk/updateVendorQuery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ queryId, status }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update query: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data.message); // Log success message
  } catch (error) {
    console.error('Error updating query:', error);
    throw error;
  }
}

export async function getQueryFromSectionFromFireStore(section: string) {
  try {
    const queryCollection = collection(db, "vendorQueries");
    const queryQuery = query(queryCollection, where("section", "==", section));
    const querySnapshot = await getDocs(queryQuery);
    console.log(querySnapshot);
    if (querySnapshot.size === 0) {
      throw new Error("Query document not found");
    }

    console.log("Query fetched successfully");
  } catch (error) {
    console.error("Error updating query status:", error);
    return [];
  }
}
export async function getQueryFromIdFromFireStore(id: string) {
  try {
    const response = await fetch(`/api/helpdesk/getVendorQueryFromId?id=${id}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch query: ${response.statusText}`);
    }
    const data = await response.json();
    return data.query;
  } catch (error) {
    console.error("Error fetching Query:", error);
    return {};
  }
}

export async function getAllQueries(vendorId: string) {
  try {
    const queriesCollection = collection(db, "vendorQueries");
    const queriesQuery = query(
      queriesCollection,
      where("vendorId", "==", vendorId)
    );
    const querySnapshot = await getDocs(queriesQuery);

    const queries = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort the array based on the specified field
    queries.sort((a, b) => {
      //@ts-ignore
      return b.createdAt - a.createdAt;
    });

    return queries;
  } catch (error) {
    console.error("Error fetching queries by sellerId:", error);
    return [];
  }
}

export const resolveQuery = async (queryId: string, resolveMsg: string) => {
  try {
    const requestBody = {
      queryId: queryId,
      message: resolveMsg,
      action: "resolve"
    };
    
    // console.log('Request body:', requestBody);
    
    const response = await fetch("/api/helpdesk/updateQueryStatus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`Failed to resolve query: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in resolveQuery:", error);
    throw error;
  }
};

export async function closeQuery(queryId: string, closeMsg: string): Promise<void> {
  try {
    const response = await fetch('/api/helpdesk/updateQueryStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ queryId, action: 'close', message: closeMsg }),
    });

    if (!response.ok) {
      throw new Error(`Failed to close query: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error('Error closing query:', error);
    throw error;
  }
}

export async function getCoupons() {
  try {
    const queriesCollection = collection(db, "coupons");
    const querySnapshot = await getDocs(queriesCollection);

    const queries = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort the array based on the specified field
    queries.sort((a, b) => {
      //@ts-ignore
      return b.createdAt - a.createdAt;
    });

    return queries;
  } catch (error) {
    console.error("Error fetching queries by sellerId:", error);
    return [];
  }
}


export async function getVendorFromVendorUIdFromFireStore(id: string) {
  try {
    const response = await fetch(`/api/vendor/getVendorById?id=${id}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch vendor: ${response.statusText}`);
    }
    const data = await response.json();
    return data.vendor;
  } catch (error) {
    console.error("Error fetching Query:", error);
    return {};
  }
}

export async function getAllArchivedImages() {
  listAll(ref(storage, "images")).then((imgs) => {
    imgs.items.forEach((val) => {
      console.log(val.fullPath);
    });
  });
}

export async function getAllCategoriesFromFireStore() {
  try {
    const categoryCollection = collection(db, "categories");
    const categoryQuery = query(categoryCollection);

    const querySnapshot = await getDocs(categoryQuery);

    const categories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort the array based on the specified field
    categories.sort((a, b) => {
      //@ts-ignore
      return b.updatedAt - a.updatedAt;
    });
    console.log(categories);
    return categories;
  } catch (error) {
    console.error("Error fetching all categories:", error);
    return [];
  }
}
export async function getAllAuthorsFromFireStore() {
  try {
    const authorsCollection = collection(db, "authors");
    const authorQuery = query(authorsCollection);

    const querySnapshot = await getDocs(authorQuery);

    const authors = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort the array based on the specified field
    authors.sort((a, b) => {
      //@ts-ignore
      return b.updatedAt - a.updatedAt;
    });

    return authors;
  } catch (error) {
    console.error("Error fetching all authors:", error);
    return [];
  }
}

export async function getAllQueryFromFireStore(section: string) {
  try {
    const response = await fetch('/api/helpdesk/getAllVendorQueries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: section }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch vendor queries: ${response.statusText}`);
    }

    const data = await response.json();
    return data.queries;
  } catch (error) {
    console.error('Error fetching all Queries:', error);
    return [];
  }
}


export async function getAllImagesPaths() {
  return new Promise(async (resolve, reject) => {
    try {
      let images = await getAllImages();
      let ImageLinks: { title: string; url: string }[] = [];
      await Promise.all(
        images.map(async (imagePath: string, i: number) => {
          const storageRef = ref(storage, imagePath); // Use imagePath here
          const downloadUrl = await getDownloadURL(storageRef);
          ImageLinks.push({ title: imagePath, url: downloadUrl });
        })
      );
      console.log(ImageLinks);
      resolve(ImageLinks);
    } catch (error) {
      reject(error);
    }
  });
}

export async function getAllImages() {
  try {
    const imgs = await listAll(ref(storage, "images"));
    const imagePaths = imgs.items.map((item) => item.fullPath);
    return imagePaths;
  } catch (error) {
    console.error("Error fetching image paths:", error);
    return [];
  }
}

export async function getAllBlogsFromFireStore() {
  try {
    const blogsCollection = collection(db, "blogs");
    const blogsQuery = query(blogsCollection);

    const querySnapshot = await getDocs(blogsQuery);

    const blogs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    blogs.sort((a, b) => {
      //@ts-ignore
      return b.updatedAt - a.updatedAt;
    });
    return blogs;
  } catch (error) {
    console.error("Error fetching all blogs:", error);
    return [];
  }
}

export async function getUsernameFromEmail(email : string) {
  try {
    const usersCollection = collection(db, "users");
    const userQuery = query(usersCollection,where("email","==",email));

    const querySnapshot = await getDocs(userQuery);

    const user = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name : doc.data.name,
      ...doc.data(),
    }));

    return user;
  } catch (error) {
    console.error("Error fetching all blogs:", error);
    return [];
  }
}
