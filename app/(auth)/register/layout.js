import React from "react";

export const metadata = {
    title: "Admin Registration | Bhaw Bhaw",
    description: "Register as an admin to access and manage the Bhaw Bhaw platform. Create an account to oversee users, vendors, products, services, and more. Join the team dedicated to delivering exceptional pet care experiences.",
    keywords: "admin register, admin sign up, platform management"
      };

const Layout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default Layout;
