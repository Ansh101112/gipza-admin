"use client";

import Image from "next/image";
import * as LucidIcons from "lucide-react";
import { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/auth-context";
import qs from "query-string";
import axios from "axios";
import { useEffect, useState } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface SellerSideBarProps {
  iconName: string;
  title: string;
}
export const SellerSideBar = ({
  sellerSideBarOptions,
  active,
}: {
  sellerSideBarOptions: SellerSideBarProps[];
  active: string;
}) => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleClick = async (e: any) => {
    if (e.id != "logout") {
      try {
        const url = qs.stringifyUrl({
          url: "/seller",
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
    <>
      <aside className="w-1/6 h-[77vh]  p-4 rounded-lg bg-[#fffefe] shadow-2xl shadow-white">
        <ScrollArea>
          <div className=" ">
            {sellerSideBarOptions.length > 0 &&
              sellerSideBarOptions.map((option, i) => (
                <div
                  key={i}
                  id={option.title.split(" ").join("").toLowerCase()}
                  onClick={(e) => handleClick(e.target)}
                  className={cn(
                    "flex items-center gap-3 my-3 rounded-l-full  rounded-lg transition duration-300 ease-in-out hover:shadow-md hover:shadow-gray-300 cursor-pointer",
                    option.title.split(" ").join("").toLowerCase() == active &&
                      "bg-[#d6e7c3] rounded-l-full"
                  )}
                >
                  <div
                    id={option.title.split(" ").join("").toLowerCase()}
                    className="bg-slate-100 p-3 rounded-full w-11 h-11"
                  >
                    <Image
                      src={option.iconName}
                      alt="option Images"
                      width={50}
                      height={50}
                    />
                  </div>

                  <p
                    id={option.title.split(" ").join("").toLowerCase()}
                    className="text-black font-semibold text-lg"
                  >
                    {option.title}
                  </p>
                </div>
                
              ))}
          </div>
        </ScrollArea>
      </aside>
    </>
  );
};
