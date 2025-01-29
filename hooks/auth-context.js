"use client";

const safeStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== "undefined") {
        return sessionStorage.getItem(key);
      }
      return null;
    } catch (e) {
      console.error("Error accessing sessionStorage:", e);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(key, value);
      }
    } catch (e) {
      console.error("Error setting sessionStorage:", e);
    }
  },
  removeItem: (key) => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(key);
      }
    } catch (e) {
      console.error("Error removing from sessionStorage:", e);
    }
  },
};

import React, { useContext, useEffect, useState, useRef } from "react";
import { auth, db } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import toast from "react-hot-toast";
import { set } from "react-hook-form";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/wrong-password":
      return "Incorrect password!";
    case "auth/user-not-found":
      return "No user found with this email.";
    case "auth/invalid-email":
      return "Invalid email format.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    default:
      return "An unexpected error occurred.";
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userInfo = useRef();

  useEffect(() => {
    const storedUser = safeStorage.getItem("adminUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  async function signup(email, password, role, name) {
    try {
      const currentTime = new Date(Date.now());
      const userId = `UI${Date.now()}`;

      // Store current admin's info
      const adminUser = auth.currentUser;
      const adminEmail = adminUser.email;
      const adminPassword = prompt(
        "Please enter your password for security reasons:"
      );

      // Store current admin's data from sessionStorage
      const currentAdminData = sessionStorage.getItem("adminUser");

      // Create new user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid } = userCredential.user;

      // Set up new user document
      await setDoc(doc(db, "users", userId), {
        userID: userId,
        uid: uid,
        name: name,
        email: email,
        password: password,
        role: role,
        createdAt: currentTime,
        updatedAt: currentTime,
      });

      // Reauthenticate admin
      const credential = EmailAuthProvider.credential(
        adminEmail,
        adminPassword
      );
      await reauthenticateWithCredential(adminUser, credential);

      // Sign out new user
      await signOut(auth);

      // Sign back in as admin
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);

      // Restore admin's data in sessionStorage
      if (currentAdminData) {
        safeStorage.setItem("adminUser", currentAdminData);
        setCurrentUser(JSON.parse(currentAdminData));
      }
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  }

  async function login(email, password) {
    if (!email?.trim() || !password?.trim()) {
      return {
        status: false,
        message: "Email and password are required",
      };
    }

    try {
      // Normalize email to lowercase to ensure consistent matching
      const normalizedEmail = email.toLowerCase().trim();

      // First verify if the email exists in admin collection before attempting Firebase auth
      const adminDoc = await getDocs(
        query(collection(db, "admins"), where("email", "==", normalizedEmail))
      );

      if (adminDoc.empty) {
        return {
          status: false,
          message: "No admin account found with this email",
        };
      }

      const adminData = adminDoc.docs[0].data();
      if (adminData.status !== "active") {
        return {
          status: false,
          message: "This admin account is not active",
        };
      }

      // Proceed with Firebase authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        normalizedEmail,
        password
      ).catch((error) => {
        switch (error.code) {
          case "auth/wrong-password":
          case "auth/invalid-credential":
            throw new Error("Invalid Password");
          case "auth/user-not-found":
            throw new Error("No user found with this email");
          case "auth/invalid-email":
            throw new Error("Invalid email format");
          case "auth/too-many-requests":
            throw new Error("Too many failed attempts. Please try again later");
          case "auth/user-disabled":
            throw new Error("This account has been disabled");
          default:
            console.error("Firebase auth error:", error);
            throw new Error("Authentication failed. Please try again");
        }
      });

      if (!userCredential?.user) {
        throw new Error("Authentication failed");
      }

      if (adminData) {
        const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: adminData.name,
          role: adminData.role
        };

        safeStorage.setItem("adminUser", JSON.stringify(userData));
        setCurrentUser(userData);
        
        window.dispatchEvent(new Event('storage'));
      }

      return {
        status: true,
        user: userCredential.user,
        adminData: adminData,
        message: "Logged in successfully!",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        status: false,
        message: error.message || "An unexpected error occurred",
      };
    }
  }

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     try {
  //       if (user) {
  //         const adminDoc = await getDocs(
  //           query(collection(db, "admins"), where("email", "==", user.email))
  //         );

  //         if (!adminDoc.empty) {
  //           const adminData = adminDoc.docs[0].data();
  //           setCurrentUser({
  //             userID: user.uid,
  //             email: user.email,
  //             role: adminData.role,
  //             name: adminData.name,
  //           });
  //         } else {
  //           setCurrentUser(null);
  //         }
  //       } else {
  //         setCurrentUser(null);
  //       }
  //     } catch (error) {
  //       console.error("Error in auth state change:", error);
  //       setCurrentUser(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Query admins collection using uid
          const adminQuery = query(
            collection(db, "admins"),
            where("uid", "==", user.uid)
          );
          const querySnapshot = await getDocs(adminQuery);

          if (!querySnapshot.empty) {
            const adminData = querySnapshot.docs[0].data();
            setCurrentUser({
              userID: adminData.adminID,
              email: user.email,
              role: adminData.role,
              name: adminData.name,
            });
          } else {
            // If no matching admin document found, don't update currentUser
            console.log("No matching admin document found");
          }
        } catch (error) {
          console.error("Error fetching admin data:", error);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  function logout() {
    safeStorage.removeItem("adminUser");
    setCurrentUser(null);
    return signOut(auth);
  }

  // Update sessionStorage when currentUser changes
  // Update sessionStorage when currentUser changes
  useEffect(() => {
    if (currentUser) {
      safeStorage.setItem("adminUser", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  function hasRole(role) {
    return currentUser && currentUser.role === role;
  }

  const value = {
    currentUser,
    login,
    logout,
    signup,
    userInfo,
    hasRole,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
