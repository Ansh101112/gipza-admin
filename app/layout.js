import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
// import { AuthProvider } from "@/hooks/auth-context";
import { AuthProvider } from "../hooks/auth-context";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Bhaw Bhaw Admin Panel | Manage Pet Services & Products",
  description: "Welcome to the Bhaw Bhaw Admin Panel, the central hub for managing the platform. Oversee users, sellers, orders, bookings, and more. Monitor platform performance and ensure smooth operations with real-time analytics . Maintain service quality, and facilitate seamless user experiences on Bhaw Bhaw.",
  keywords: "admin panel, Bhaw Bhaw dashboard, platform management, admin tools"
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </AuthProvider>
      </body>
    </html>
  );
}
