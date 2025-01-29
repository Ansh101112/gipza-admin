"use client";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebase"; // Import firestore
import { query, where, getDocs, collection } from "firebase/firestore"; // For querying users and admins collection
import Image from "next/image";
import { FaBars, FaTimes } from "react-icons/fa"; // Import menu bar icon
import { MyContext } from "../../context/MyContext";
import { useContext } from "react";
import { useAuth } from "@/hooks/auth-context";

import logo from "../../public/bhawbhaw.png";
import Noti from "../../public/Notification.png";
import profile from "../../public/profile.png";
import darrow from "../../public/darrow.png";

const Header = () => {
  const [userName, setUserName] = useState("Guest");
  const { isOpen, setIsOpen } = useContext(MyContext);
  const { currentUser } = useAuth();
  const [adminName, setAdminName] = useState("Guest");

  // Only run once on mount to get the stored admin name
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initial load from session storage
      const storedUser = sessionStorage.getItem('adminUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setAdminName(userData.name || "Guest");
      }

      // Subscribe to storage events to handle updates
      const handleStorageChange = () => {
        const updatedUser = sessionStorage.getItem('adminUser');
        if (updatedUser) {
          const userData = JSON.parse(updatedUser);
          setAdminName(userData.name || "Guest");
        } else {
          setAdminName("Guest");
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  // Remove the useEffect that watches currentUser changes
  // This prevents the name from updating when currentUser changes

  // useEffect(() => {
  //   // Access sessionStorage after component mounts
  //   const storedName = window.sessionStorage.getItem("adminName");
  //   if (storedName) {
  //     setAdminName(storedName);
  //   }
  // }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // const adminName = sessionStorage.getItem("adminName") || "Guest";
  // const adminName = currentUser?.name || "Guest";



  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b-2 border-gray-300 z-50" style={{ height: "65px" }}>
      <div className="w-full flex justify-between items-center px-4 py-2 lg:px-8">
        {/* Left side with Logo and Menu */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden bg-gray-700 p-2 rounded-full text-white focus:outline-none"
            onClick={toggleSidebar}
          >
            {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </button>
          <Image src={logo} height={70} width={70} alt="Logo" />
        </div>

        {/* Right side with Profile and Notifications */}
        <div className="flex items-center gap-4">
          <Image src={Noti} width={20} height={20} alt="Notification" />
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-sm hidden lg:block">{adminName}</h1>
            <Image src={profile} height={40} width={30} alt="Profile" className="h-8 w-8 rounded-full" />
            <Image
              src={darrow}
              height={20}
              width={20}
              className="cursor-pointer hidden lg:block"
              alt="Dropdown Arrow"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
