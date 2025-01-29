import { AlignJustify } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AdminSideBarMobile } from "./adminSideBarMobile";
import { adminOptions } from "./types/types";
import { Button } from "../ui/button";
import Image from "next/image";
import { FaCirclePlus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { getUsernameFromEmail } from "@/lib/firebaseFunc";

export const Navbar_test = ({ user, active }: any) => {
  const [userName, setName] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const handleItemClick = () => {
    setIsOpen(false);
  };
  const [id, setId] = useState("");
  useEffect(() => {
    const getName = async () => {
      const userCurrent = await getUsernameFromEmail(user.email);
      setId(userCurrent[0].id);
      setName(userCurrent[0].name);
    };
    getName();
  });
  return (
    <div className="w-full h-full flex flex-row gap-2">
      <div className=" p-4 h-auto flex justify-between items-center w-1/5">
        <div className="flex gap-3 justify-center items-center h-full">
          <Sheet>
            <SheetTrigger>
              {" "}
              <AlignJustify className="cursor-pointer block md:hidden" />
            </SheetTrigger>
            <SheetContent
              onClick={close}
              side={"left"}
              className="w-56 sm:w-72 bg-gradient-to-bl from-gray-300 via-gray-600 to-yellow-200 shadow-lg"
            >
              <AdminSideBarMobile
                adminSideBarOptions={adminOptions}
                active={active}
                onItemClick={handleItemClick}
              />
            </SheetContent>
          </Sheet>
          <div className="flex flex-col h-full text-white text-xl  sm:text-3xl  font-medium items-center justify-center">
            <div>GETJEWELS</div>
            <div>ADMIN</div>
          </div>
        </div>
      </div>
      <div className="w-4/5 h-[175px] py-4 mt-4 flex justify-end">
        <div className=" w-full h-full flex justify-around bg-white rounded-2xl">
          <div className="flex flex-col  justify-center md:items-start items-center pl-10 md:w-5/12 w-full">
            <div className="text-3xl w-full font-semibold">
              Hii {userName} !...
            </div>
            <div className="text-2xl w-full font-light">{id}</div>
          </div>
          <div className="relative -top-28 md:block hidden z-10 bg-transparent">
            <Image
              src="/displayProfile.png"
              alt="profile"
              width={344}
              height={344}
              className="bg-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
