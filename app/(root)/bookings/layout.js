import React from "react";

export const metadata = {
    title: "Manage Bookings | Bhaw Bhaw Admin Panel",
    description: "Oversee all bookings on the Bhaw Bhaw platform, ensuring smooth scheduling and service delivery. Manage statuses, address escalations, and monitor booking trends. Ensure a seamless experience for both users and service providers.",
    keywords: "admin bookings, service management, appointment tracking, booking platform"
  };
      
  const Layout = ({ children }) => {
    return (
      <div>
        {children}
      </div>
    );
  };
  
  export default Layout;
    