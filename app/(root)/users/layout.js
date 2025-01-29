import React from "react";

export const metadata = {
  title: "Manage Users | Bhaw Bhaw Admin Panel",
  description: "Manage all users on the Bhaw Bhaw platform through the Admin Panel. Access user profiles, monitor activity, and ensure compliance with policies. Handle account escalations, respond to feedback, and foster a secure and welcoming environment for pet owners and service providers.",
  keywords: "admin users, user management, account monitoring, policy compliance"
};

const Layout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default Layout;
