"use client"; // Ensures this page is rendered only on the client

import Spinner from "@/components/Spinner";
import DashBoard from "../../../components/Dashboard/DashBoard";
import { useAuth } from "../../../hooks/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!loading && !currentUser) {
  //     router.replace('/');
  //   }
  // }, [currentUser, loading, router]);

  if (loading) {
    return <Spinner />;
  }

  if (!currentUser) {
    return <Spinner />;
  }

  return <DashBoard />;
};

export default Page;
