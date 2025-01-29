"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dog from "../../../public/dog.png";
import shape from "../../../public/Shape.png";
import ClipLoader from "react-spinners/ClipLoader";
import toast from "react-hot-toast";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "@/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";
import logo from "../../../public/bhawbhaw.png";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        toast.error("Please enter a valid email.");
        return;
      }

      const adminsRef = collection(db, "admins");
      const adminsQuery = query(adminsRef, where("email", "==", email));
      const adminsSnapshot = await getDocs(adminsQuery);

      const usersRef = collection(db, "users");
      const usersQuery = query(usersRef, where("email", "==", email));
      const usersSnapshot = await getDocs(usersQuery);

      if (adminsSnapshot.empty && usersSnapshot.empty) {
        toast.error("Invalid Admin ID");
        return;
      }

      await sendPasswordResetEmail(auth, email);
      toast.success("Check your email for further instructions.");
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-screen bg-white p-8 rounded-3xl shadow-lg w-3/4 mx-auto max-lg:w-full lg:pt-10 lg:px-20 lg:pb-16">
      <div className="flex justify-start mb-7">
        <Image src={logo} height={100} width={100} alt="Logo" className="sm:w-24 w-20"/>
      </div>
      <h2 className="text-left text-lg text-gray-500 mb-5">Reset Your Password</h2>
      <h1 className="text-left text-4xl font-bold mb-6">Forgot Password</h1>
      <form onSubmit={handlePasswordReset} className="relative mt-10 mb-10">
        <div className="mb-4">
          <label
            className="block text-black text-sm mb-2 font-poppins"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="w-full p-3 bg-gray-100 rounded-sm text-gray-900 focus:outline-none focus:border-red-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="w-full flex justify-center lg:mt-10">
          <button
            type="submit"
            className="w-full lg:w-fit lg:rounded-full bg-red-500 text-white font-bold py-3 px-7 rounded-md flex justify-center items-center hover:bg-yellow-500"
            disabled={loading}
          >
            {loading ? (
              <ClipLoader size={17} color={"#fff"} loading={loading} className="mx-8 my-1" />
            ) : (
              <>
                <span>RESET PASSWORD</span>
                <span className="ml-2">➔</span>
              </>
            )}
          </button>
        </div>
        <p className="text-center mt-6 text-gray-500 text-sm font-poppins">
          Remembered your password?{" "}
          <Link href="/" className="text-red-500 font-medium">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

const ForgotPassword = () => {
  return (
    <div className="flex h-screen max-lg:flex-col">
      <div className="basis-1/2 flex-1 bg-yellow-400 relative flex flex-col items-center h-full">
        <div className="relative flex flex-col">
          <Image
            src={shape}
            alt="Decorative Shape"
            width={420}
            height={420}
            className="object-cover md:min-w-[25rem] w-[15rem] rounded-3xl md:h-[28rem] h-[18rem] bg-slate-400"
          />
          <Image
            src={dog}
            alt="Dog Image"
            width={400}
            height={200}
            className="object-contain md:w-80 w-40 absolute md:left-10 left-1/2 md:-bottom-[10.4rem] -bottom-[5.2rem]"
          />
        </div>
      </div>
      <div className="md:basis-1/2 flex-1 flex justify-center items-center h-full max-lg:w-full">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPassword;