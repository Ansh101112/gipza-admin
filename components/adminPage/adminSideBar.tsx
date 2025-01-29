import { useAuth } from "@/hooks/auth-context";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { Separator } from "../ui/separator";
import {
  blogOptions,
  users,
  settingsOptions,
  documentationOptions,
  functions,
  courses,
} from "./types/types";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useState } from "react";

interface AdminSideBarProps {
  iconName: string;
  title: string;
}

export const AdminSideBar = ({
  adminSideBarOptions,
  active,
}: {
  adminSideBarOptions: AdminSideBarProps[];
  active: string;
}) => {
  const router = useRouter();
  const { logout } = useAuth();
  const [role, setRole] = useState<string>("admin");
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      setRole(currentUser.role);
      console.log(role);
    }
  }, [currentUser]);

  const handleClick = async (e: any) => {
    if (e != "logout") {
      console.log(e);
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
      console.log("Logging out");
      await logout();
      router.refresh();
    }
  };

  return (
    <div className="w-[22%] rounded-xl p-2 hidden md:block h-full bg-white">
      <div className="flex flex-col sticky top-0 h-full">
        <ScrollArea>
          <div className="w-full p-3">
            {role == "admin" && (
              <>
                <div className="w-full h-full flex  justify-center flex-col mt-2">
                  <div className="flex w-full h-full p-2 py-3 rounded-2xl bg-[#CADCB6]">
                    <div className="flex font-medium h-full text-black  text-lg w-full ">
                      <div className="flex w-full justify-center items-center h-full  ">
                        <h1 className="flex justify-center items-center font-semibold text-xl">
                          Users
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  {users.length > 0 &&
                    users.map((option, i) => (
                      <div
                        key={i}
                        id={option.title.split(" ").join("").toLowerCase()}
                        onClick={(e) => handleClick(e.target)}
                        className={cn(
                          "flex items-center gap-3 my-3 rounded-l-full rounded-lg transition duration-300 hover:scale-110 ease-in-out hover:shadow-2xl hover:shadow-slate-600 cursor-pointer",
                          option.title.split(" ").join("").toLowerCase() ==
                            active && "bg-[#d6e7c3] rounded-l-full"
                        )}
                      >
                        <div
                          id={option.title.split(" ").join("").toLowerCase()}
                          className="bg-slate-100 p-3 rounded-full w-11 h-11"
                        >
                          <Image
                            className="invert"
                            src={option.iconName}
                            id={option.title.split(" ").join("").toLowerCase()}
                            alt="option Images"
                            width={50}
                            height={50}
                          />
                        </div>

                        <p
                          id={option.title.split(" ").join("").toLowerCase()}
                          className=" font-semibold"
                        >
                          {option.title}
                        </p>
                      </div>
                    ))}
                </div>
              </>
            )}
            {role == "admin" && (
              <>
                <div className="w-full h-full flex  justify-center flex-col mt-2">
                  <div className="flex w-full h-full p-2 py-3 rounded-2xl bg-[#CADCB6]">
                    <div className="flex font-medium h-full text-black  text-lg w-full ">
                      <div className="flex w-full justify-center items-center h-full  ">
                        <h1 className="flex justify-center items-center font-semibold text-xl">
                          Functions
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  {functions.length > 0 &&
                    functions.map((option, i) => (
                      <div
                        key={i}
                        id={option.title.split(" ").join("").toLowerCase()}
                        onClick={(e) => handleClick(e.target)}
                        className={cn(
                          "flex items-center gap-3 my-3 rounded-l-full hover:scale-110 rounded-lg transition duration-300 ease-in-out hover:shadow-2xl hover:shadow-slate-600 cursor-pointer",
                          option.title.split(" ").join("").toLowerCase() ==
                            active && "bg-[#d6e7c3] rounded-l-full"
                        )}
                      >
                        <div
                          id={option.title.split(" ").join("").toLowerCase()}
                          className="bg-slate-100 p-3 rounded-full w-11 h-11"
                        >
                          <Image
                            className="invert"
                            src={option.iconName}
                            id={option.title.split(" ").join("").toLowerCase()}
                            alt="option Images"
                            width={50}
                            height={50}
                          />
                        </div>

                        <p
                          id={option.title.split(" ").join("").toLowerCase()}
                          className=" font-semibold "
                        >
                          {option.title}
                        </p>
                      </div>
                    ))}
                </div>
              </>
            )}
            {(role == "author" || role == "admin") && (
              <>
                {role == "admin" && (
                  <>
                    <Separator />
                    <div className="w-full h-full flex  justify-center flex-col mt-2">
                      <div className="flex w-full h-full p-2 py-3 rounded-2xl bg-[#CADCB6]">
                        <div className="flex font-medium h-full text-black  text-lg w-full ">
                          <div className="flex w-full justify-center items-center h-full  ">
                            <h1 className="flex justify-center items-center font-semibold text-xl">
                              Content
                            </h1>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div>
                  {blogOptions.length > 0 &&
                    blogOptions.map(
                      (option, i) =>
                        // Exclude the "Logout" option if the role is "admin" and the option title is "Logout"
                        !(role === "admin" && option.title === "Log out") && (
                          <div
                            key={i}
                            id={option.title.split(" ").join("").toLowerCase()}
                            onClick={(e) => handleClick(e.target)}
                            className={cn(
                              "flex items-center gap-3 my-3 rounded-l-full hover:scale-110 rounded-lg transition duration-300 ease-in-out hover:shadow-2xl hover:shadow-slate-600 cursor-pointer",
                              option.title.split(" ").join("").toLowerCase() ==
                                active && "bg-[#d6e7c3] rounded-l-full"
                            )}
                          >
                            <div
                              id={option.title
                                .split(" ")
                                .join("")
                                .toLowerCase()}
                              className="bg-slate-100 p-3 rounded-full w-11 h-11"
                            >
                              <Image
                                className="invert"
                                src={option.iconName}
                                id={option.title
                                  .split(" ")
                                  .join("")
                                  .toLowerCase()}
                                alt="option Images"
                                width={50}
                                height={50}
                              />
                            </div>

                            <p
                              id={option.title
                                .split(" ")
                                .join("")
                                .toLowerCase()}
                              className=" font-semibold"
                            >
                              {option.title}
                            </p>
                          </div>
                        )
                    )}
                </div>
              </>
            )}
            {(role == "admin" || role == "helpDesk") && (
              <>
                <Separator />
                <div className="w-full h-full flex justify-center flex-col mt-2">
                  <div className="flex w-full h-full p-2 py-3 rounded-2xl bg-[#CADCB6]">
                    <div className="flex font-medium h-full text-black  text-lg w-full ">
                      <div className="flex w-full justify-center items-center h-full  ">
                        <h1 className="flex justify-center items-center font-semibold text-xl">
                          Help Desk
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  {documentationOptions.length > 0 &&
                    documentationOptions.map((option: any, i: any) => (
                      <div
                        key={i}
                        id={option.title.split(" ").join("").toLowerCase()}
                        onClick={(e) => handleClick(e.target)}
                        className={cn(
                          "flex items-center gap-3 my-3 rounded-l-full hover:scale-110 rounded-lg transition duration-300 ease-in-out hover:shadow-2xl hover:shadow-slate-600 cursor-pointer",
                          option.title.split(" ").join("").toLowerCase() ==
                            active && "bg-[#d6e7c3] rounded-l-full"
                        )}
                      >
                        <div
                          id={option.title.split(" ").join("").toLowerCase()}
                          className="bg-slate-100 p-3 rounded-full w-11 h-11"
                        >
                          <Image
                            className="invert"
                            src={option.iconName}
                            id={option.title.split(" ").join("").toLowerCase()}
                            alt="option Images"
                            width={50}
                            height={50}
                          />
                        </div>

                        <p
                          id={option.title.split(" ").join("").toLowerCase()}
                          className=" font-semibold "
                        >
                          {option.title}
                        </p>
                      </div>
                    ))}
                </div>
              </>
            )}

            {role == "admin" && (
              <>
                <Separator />
                <div className="w-full h-full flex  justify-center flex-col mt-2">
                  <div className="flex w-full h-full p-2 py-3 rounded-2xl bg-[#CADCB6]">
                    <div className="flex font-medium h-full text-black  text-lg w-full ">
                      <div className="flex w-full justify-center items-center h-full  ">
                        <h1 className="flex justify-center items-center font-semibold text-xl">
                          Setting
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  {settingsOptions.length > 0 &&
                    settingsOptions.map((option: any, i: any) => (
                      <div
                        key={i}
                        id={option.title.split(" ").join("").toLowerCase()}
                        onClick={(e) => handleClick(e.target)}
                        className={cn(
                          "flex items-center gap-3 my-3 hover:scale-110 rounded-l-full rounded-lg transition duration-300 ease-in-out hover:shadow-2xl hover:shadow-slate-600 cursor-pointer",
                          option.title.split(" ").join("").toLowerCase() ==
                            active && "bg-[#d6e7c3] rounded-l-full"
                        )}
                      >
                        <div
                          id={option.title.split(" ").join("").toLowerCase()}
                          className="bg-slate-100 p-3 rounded-full w-11 h-11"
                        >
                          <Image
                            className="invert"
                            src={option.iconName}
                            id={option.title.split(" ").join("").toLowerCase()}
                            alt="option Images"
                            width={50}
                            height={50}
                          />
                        </div>

                        <p
                          id={option.title.split(" ").join("").toLowerCase()}
                          className=" font-semibold"
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
              className="flex items-center gap-6 my-3 hover:scale-110 rounded-l-full rounded-lg transition duration-300 ease-in-out hover:shadow-2xl cursor-pointer"
            >
              <Image
                src="/admin/adminImages/logout (1) main.png"
                alt="option Images"
                width={20}
                height={20}
                className="ml-3"
              />
              <p className="cursor-pointer font-semibold ">Log out</p>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
