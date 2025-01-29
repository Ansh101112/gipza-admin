import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getDocs, query, collection, where } from "firebase/firestore";
import { ClipLoader } from "react-spinners";
import { auth, db } from "@/firebase";

const Protected = (WrappedComponent) => {
  const ComponentWithProtection = (props) => {
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            setLoading(true);
            const userQuery = query(
              collection(db, "users"),
              where("uid", "==", user.uid)
            );
            const querySnapshot = await getDocs(userQuery);

            if (!querySnapshot.empty) {
              const userData = querySnapshot.docs[0].data();
              if (userData.role === "admin" && userData.status === "active") {
                setIsAuthorized(true);
              } else {
                console.error("Unauthorized access: User role or status invalid");
                await auth.signOut();
                router.push("/");
              }
            } else {
              console.error("User not found in Firestore");
              await auth.signOut();
              router.push("/");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            await auth.signOut();
            router.push("/");
          }
        } else {
          console.log("No user authenticated");
          await auth.signOut();
          router.push("/");
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return (
        <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
          <ClipLoader size={50} color="#000" loading={loading} />
        </div>
      );
    }

    if (!isAuthorized) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  ComponentWithProtection.displayName = `Protected(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return ComponentWithProtection;
};

export default Protected;
