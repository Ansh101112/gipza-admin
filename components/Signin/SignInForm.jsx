"use client";
import React, { useEffect, useState } from "react";
import logo from "../../public/bhawbhaw.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/auth-context";
import Link from "next/link";
import ClipLoader from "react-spinners/ClipLoader";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { auth } from "../../firebase";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(5, { message: "Password is too short; it should be at least 5 characters" }),
});

const SignInForm = () => {
  const router = useRouter();
  const { currentUser, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      router.replace("/dashboard");
    }
  }, [currentUser, router]);


  async function onSubmit(values) {
    if (!values?.email || !values?.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const result = await login(values.email, values.password);

      if (result.status) {
        toast.success(result.message);
        // Store admin data in context/state if needed
        router.push("/dashboard");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred. Please try again");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="max-h-screen bg-white p-8 rounded-3xl shadow-lg w-3/4 mx-auto max-lg:w-full lg:pt-10 lg:px-20 lg:pb-16">
      <div className="flex justify-start mb-7">
        <Image
          src={logo}
          alt="Logo"
          width={200}
          height={80}
          className="h-20 w-auto"
        />
      </div>
      <h2 className="text-left text-lg text-baw-light-gray mb-5">
        Welcome back !!!
      </h2>
      <h1 className="text-left text-4xl font-bold mb-6">Admin Login</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative mt-10 mb-10">
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
            placeholder="bhawbhaw@gmail.com"
            autoComplete="email"
            {...form.register("email")}
            className="w-full p-3 bg-baw-input rounded-sm text-gray-900 focus:outline-none focus:border-red-400"
            required
          />
        </div>
        <div className="mb-6 font-poppins mt-10">
          <label
            className="text-black text-sm mb-2 font-poppins flex justify-between"
            htmlFor="password"
          >
            Password
            <Link href="/forget-password" className="text-sm text-gray-500 ml-4">
              Forgot Password?
            </Link>
          </label>
          {/* <input
            type="password"
            id="password"
            placeholder="********"
            {...form.register("password")}
            className="w-full p-3 bg-baw-input rounded-sm text-gray-900 focus:outline-none focus:border-red-400"
            required
          /> */}
        </div>

        <div className="relative mt-4">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="********"
            autoComplete="current-password"
            {...form.register("password")}
            className="w-full p-3 bg-baw-input rounded-sm text-gray-900 focus:outline-none focus:border-red-400"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>

        <div className="w-full flex justify-center lg:mt-10">
          <button
            type="submit"
            className="w-full lg:w-fit lg:rounded-full bg-baw-red text-white font-bold py-3 px-7 rounded-md flex justify-center items-center hover:bg-baw-yellow"
          >
            {loading ? <ClipLoader size={17} color={"#fff"} loading={loading} className="mx-8 my-1" /> : (
              <>
                <span>SIGN IN</span>
                <span className="ml-2">➔</span>
              </>
            )}
          </button>
        </div>
        {/* <label
          className="absolute text-nowrap -bottom-10 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm mb-2 font-poppins flex justify-center"
          htmlFor="password"
        >
          Don&apos;t have an account?
          <Link href="/signup" className="text-sm text-red-500 ml-2">
            Signup
          </Link>
        </label> */}
      </form>
    </div>
  );
};

export default SignInForm;
