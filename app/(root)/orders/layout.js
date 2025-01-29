import React from "react";

export const metadata = {
    title: "Manage Orders | Bhaw Bhaw Admin Panel",
    description: "Monitor and manage all product orders placed through the Bhaw Bhaw platform. Ensure timely processing, handle disputes, and track order trends. Maintain high satisfaction rates by overseeing the end-to-end order management process.",
    keywords: "admin orders, order management, platform sales, dispute resolution"
  };  

const Layout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default Layout;
