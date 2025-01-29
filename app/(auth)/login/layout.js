import React from "react";

export const metadata = {
    title: "Admin Login | Bhaw Bhaw",
    description: "Log in to the Bhaw Bhaw Admin Panel to manage platform operations effectively. Access tools for overseeing bookings, users, vendors, and financial transactions. Ensure seamless functionality and exceptional service delivery.",
    keywords: "admin login, Bhaw Bhaw admin access, platform management"
    };

const Layout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default Layout;
