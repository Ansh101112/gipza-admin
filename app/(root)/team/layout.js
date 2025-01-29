import React from "react";

export const metadata = {
    title: "Team Management | Bhaw Bhaw Admin Panel",
    description: "Manage your admin team with ease through the Bhaw Bhaw Admin Panel. Assign roles, monitor activity, and ensure team members have the necessary permissions to manage platform operations. Maintain efficient workflows and clear accountability among team members.",
    keywords: "admin team, team management, role assignment, platform administration"
  };

const Layout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default Layout;
