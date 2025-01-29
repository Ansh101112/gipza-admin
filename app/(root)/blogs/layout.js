import React from "react";

export const metadata = {
    title: "Bhaw Bhaw | Blogs",
    description: "Manage blog content on the Bhaw Bhaw platform. Create, edit, or remove blogs to keep users informed and engaged. Ensure content aligns with the platform’s mission of promoting pet care awareness.",
    keywords: "admin blogs, content management, pet care awareness, blog publishing"
  };
        
  const Layout = ({ children }) => {
    return (
      <div>
        {children}
      </div>
    );
  };
  
  export default Layout;
    