"use client";
import React, { useContext } from "react";
import {
  FaHome,
  FaUsers,
  FaShoppingCart,
  FaTicketAlt,
  FaQuestionCircle,
  FaFileAlt,
  FaTags,
  FaCog,
  FaSignOutAlt,
  FaRegHandPointRight,
} from "react-icons/fa";
import { MyContext } from "@/context/MyContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth-context";

const Sidebar = () => {
  const { isOpen, setIsOpen } = useContext(MyContext);
  const { logout } = useAuth();
  const router = useRouter();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="relative mt-16 sm:mb-0 sm:mt-10">
      {/* Sidebar */}
      <div
        className={`w-64 shadow-lg z-50 bg-white fixed left-0 transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:relative lg:block`}
        style={{ height: "calc(100vh - 45px)" }}
      >
        <div className="px-4 py-8 sidebar-scrollbar max-h-full overflow-y-auto flex flex-col">
          {/* Main Links */}
          <div className="mb-0">
            <SidebarSection
              links={[
                { icon: FaHome, label: "Dashboard", href: "/dashboard" },
                { icon: FaUsers, label: "Vendors", href: "/vendors" },
                { icon: FaUsers, label: "Service Providers", href: "/service-providers" },
                { icon: FaUsers, label: "Users", href: "/users" },
                { icon: FaShoppingCart, label: "Orders", href: "/orders" },
                { icon: FaTicketAlt, label: "Bookings", href: "/bookings" },
                { icon: FaTicketAlt, label: "Products", href: "/products" },
              ]}
            />
          </div>

          {/* Help Desk */}
          <SidebarCategory title="Help Desk">
            <SidebarLink Icon={FaQuestionCircle} label="User Helpdesk" href="/user-helpdesk" />
            <SidebarLink Icon={FaQuestionCircle} label="Vendor Helpdesk" href="/vendor-helpdesk" />
            <SidebarLink Icon={FaFileAlt} label="Contact" href="/contact" />
          </SidebarCategory>

          {/* Admin Section */}
          <SidebarCategory title="Admin">
            <SidebarLink Icon={FaTags} label="Coupons" href="/coupons" />
            <SidebarLink Icon={FaUsers} label="Team" href="/team" />
          </SidebarCategory>

          {/* Content Section */}
          <SidebarCategory title="Content">
            <SidebarLink Icon={FaFileAlt} label="Blogs" href="/blogs" />
            <SidebarLink Icon={FaFileAlt} label="Graphics" href="/graphics" />
            <SidebarLink Icon={FaFileAlt} label="Categories" href="/categories" />
            <SidebarLink Icon={FaTags} label="Tags" href="/tags" />
            <SidebarLink Icon={FaFileAlt} label="Media" href="/media" />
          </SidebarCategory>

          {/* Bottom Actions */}

          <div className="p-4 mt-0 pt-0">
            <SidebarLink Icon={FaRegHandPointRight} label="Reports" href="/reports" />
            <SidebarLink Icon={FaCog} label="Settings" href="/settings" />
            <div
              onClick={handleLogout}
              className="flex items-center space-x-2 baw-text hover:bg-baw-baw-g6 px-2 py-2 rounded-md cursor-pointer"
            >
              <FaSignOutAlt className="h-5 w-5 text-baw-text" />
              <span className="text-baw-text">Logout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for Mobile */}
      
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 sm:z-30 lg:hidden "
          onClick={toggleSidebar}
        />
      )}

    </div>

  );
};

// Sidebar Category Component
const SidebarCategory = ({ title, children }) => (
  <div className="mb-6">
    <div className="bg-baw-baw-g4 text-white px-3 py-2 rounded-md font-semibold baw-text">{title}</div>
    <div className="space-y-2 mt-4">{children}</div>
  </div>
);

// Sidebar Section Component
const SidebarSection = ({ links }) => (
  <div className="space-y-1 mb-12">
    {links.map(({ icon: Icon, label, href }, index) => (
      <SidebarLink key={index} Icon={Icon} label={label} href={href} />
    ))}
  </div>
);

// Sidebar Link Component
const SidebarLink = ({ Icon, label, href }) => {
  const router = useRouter();

  const handleClick = () => router.push(href);

  return (
    <div
      onClick={handleClick}
      className="flex items-center space-x-2 baw-text hover:bg-baw-baw-g6 px-2 py-2 rounded-md cursor-pointer"
    >
      <Icon className="h-5 w-5 text-baw-text" />
      <span className="text-baw-text">{label}</span>
    </div>
  );
};

export default Sidebar;
