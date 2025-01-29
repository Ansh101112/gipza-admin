"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/auth-context";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .min(1, { message: "Email is required." }),
  password: z
    .string()
    .min(5, {
      message:
        "Password is too short. It should be at least 5 characters long.",
    }),
});

const LoginPage = () => {
  const router = useRouter();

  const { currentUser, login } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      router.push("/admin");
    }
  }, [currentUser]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await login(values.email, values.password);

      if (result.status) {
        toast.success("Login successful!");
        router.push("/admin");
      } else {
        toast.error("Login failed: " + result.message);
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("An error occurred. Please try again.");
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Link href="/forget" className="text-sm cursor-pointer">
            Forget Password?
          </Link>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
