import React from "react";

export const metadata = {
    title: "Manage Products | Bhaw Bhaw Admin Panel",
    description: "Manage all product listings on the Bhaw Bhaw platform. Ensure compliance with guidelines, monitor product performance, and address issues flagged by users or vendors. Maintain a high-quality product catalog to meet the diverse needs of pet owners.",
    keywords: "admin products, product management, catalog monitoring, platform standards"
  };

const Layout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default Layout;
