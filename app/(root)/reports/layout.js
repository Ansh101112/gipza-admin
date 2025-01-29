import React from "react";

export const metadata = {
    title: "Reports | Bhaw Bhaw Admin Panel",
    description: "Access comprehensive reports on platform performance, user activity, and vendor metrics through the Bhaw Bhaw Admin Panel. Analyze data to identify trends, track growth, and improve operations. Leverage actionable insights to make informed decisions and enhance the platform’s efficiency.",
    keywords: "admin reports, analytics, data insights, performance tracking"
  };  

const Layout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default Layout;
