import React from "react";

export const metadata = {
  title: "User Helpdesk | Admin Panel Support",
  description: "The Bhaw Bhaw Admin Panel User Helpdesk provides tools to manage user inquiries and concerns. Handle issues such as account problems, payment disputes, or general feedback. Ensure a seamless user experience by addressing concerns promptly and efficiently.",
  keywords: "admin user helpdesk, user support, customer service, issue resolution"
};

const Layout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default Layout;
