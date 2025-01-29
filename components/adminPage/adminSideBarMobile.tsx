"use client";

import { useAuth } from "@/hooks/auth-context";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import {
  blogOptions,
  adminOptions,
  settingsOptions,
  documentationOptions,
} from "./types/types";

interface AdminSideBarProps {
  iconName: string;
  title: string;
}

interface AdminSideBarMobileProps {
  adminSideBarOptions: AdminSideBarProps[];
  active: string;
  onItemClick: () => void;
}

export const AdminSideBarMobile = ({
  adminSideBarOptions,
  active,
  onItemClick,
}: AdminSideBarMobileProps) => {
  const router = useRouter();
  const { logout } = useAuth();
  const [role, setRole] = useState<string>("admin");
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      setRole(currentUser.role);
    }
  }, [currentUser]);

  const handleClick = async (e: any) => {
    onItemClick()
    if (e != "logout") {
      try {
        const url = qs.stringifyUrl({
          url: "/admin",
          query: { option: e.id },
        });
        router.push(url);
        router.refresh();
      } catch (error) {
        console.log(error);
      }
    } else {
      await logout();
      router.refresh();
    }
  };

  return (
    <aside className="p-4 md:hidden h-full">
      <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
        <div>
          {role === "admin" && (
            <>
              <h1 className="flex justify-center items-center text-white font-semibold text-xl mt-2 pb-2">
                Admin Layout
              </h1>
              <Separator />
              <div>
                {adminOptions.length > 0 &&
                  adminOptions.map((option, i) => (
                    <div
                      key={i}
                      id={option.title.split(" ").join("").toLowerCase()}
                      onClick={(e) => handleClick(e.target)}
                      className={cn(
                        "flex items-center gap-3 my-3 rounded-l-full rounded-lg transition duration-300 ease-in-out hover:shadow-2xl hover:shadow-slate-600 cursor-pointer",
                        option.title.split(" ").join("").toLowerCase() ===
                          active && "bg-slate-500 rounded-l-full"
                      )}
                    >
                      <p
                        id={option.title.split(" ").join("").toLowerCase()}
                        className="text-white font-semibold text-lg"
                      >
                        {option.title}
                      </p>
                    </div>
                  ))}
              </div>
            </>
          )}
          {(role === "admin" || role === "helpDesk") && (
            <>
              <Separator />
              <h1 className="flex justify-center items-center text-white font-semibold text-xl mt-2">
                Helpdesk
              </h1>
              <div>
                {documentationOptions.length > 0 &&
                  documentationOptions.map((option, i) => (
                    <div
                      key={i}
                      id={option.title.split(" ").join("").toLowerCase()}
                      onClick={(e) => handleClick(e.target)}
                      className={cn(
                        "flex items-center gap-3 my-3 rounded-l-full rounded-lg transition duration-300 ease-in-out hover:shadow-2xl hover:shadow-slate-600 cursor-pointer",
                        option.title.split(" ").join("").toLowerCase() ===
                          active && "bg-slate-500 rounded-l-full"
                      )}
                    >
                      <p
                        id={option.title.split(" ").join("").toLowerCase()}
                        className="text-white font-semibold text-lg"
                      >
                        {option.title}
                      </p>
                    </div>
                  ))}
              </div>
            </>
          )}
          {(role === "contentWriter" || role === "admin") && (
            <>
              {role === "admin" && (
                <>
                  <Separator />
                  <h1 className="flex justify-center items-center text-white font-semibold text-xl mt-2">
                    Blogs
                  </h1>
                </>
              )}
              <div>
                {blogOptions.length > 0 &&
                  blogOptions.map(
                    (option, i) =>
                      !(role === "admin" && option.title === "Log out") && (
                        <div
                          key={i}
                          id={option.title.split(" ").join("").toLowerCase()}
                          onClick={(e) => handleClick(e.target)}
                          className={cn(
                            "flex items-center gap-3 my-3 rounded-l-full rounded-lg transition duration-300 ease-in-out hover:shadow-2xl hover:shadow-slate-600 cursor-pointer",
                            option.title.split(" ").join("").toLowerCase() ===
                              active && "bg-slate-500 rounded-l-full"
                          )}
                        >
                          <p
                            id={option.title.split(" ").join("").toLowerCase()}
                            className="text-white font-semibold text-lg"
                          >
                            {option.title}
                          </p>
                        </div>
                      )
                  )}
              </div>
            </>
          )}
          {role === "admin" && (
            <>
              <Separator />
              <h1 className="flex justify-center items-center text-white font-semibold text-xl mt-2">
                Settings
              </h1>
              <div>
                {settingsOptions.length > 0 &&
                  settingsOptions.map((option, i) => (
                    <div
                      key={i}
                      id={option.title.split(" ").join("").toLowerCase()}
                      onClick={(e) => handleClick(e.target)}
                      className={cn(
                        "flex items-center gap-3 my-3 rounded-l-full rounded-lg transition duration-300 ease-in-out hover:shadow-2xl hover:shadow-slate-600 cursor-pointer",
                        option.title.split(" ").join("").toLowerCase() ===
                          active && "bg-slate-500 rounded-l-full"
                      )}
                    >
                      <p
                        id={option.title.split(" ").join("").toLowerCase()}
                        className="text-white font-semibold text-lg"
                      >
                        {option.title}
                      </p>
                    </div>
                  ))}
              </div>
            </>
          )}
          <Separator />
          <div
            id="logout"
            onClick={() => handleClick("logout")}
            className="flex items-center gap-6 my-3 rounded-l-full rounded-lg transition duration-300 ease-in-out hover:shadow-2xl cursor-pointer"
          >
            <p className="cursor-pointer font-semibold text-white">Log out</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
