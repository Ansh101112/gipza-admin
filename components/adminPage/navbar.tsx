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
import { useState } from "react";
import Image from "next/image";
import logo from '../../public/public/gjlogo1.png'

export const Navbar = ({ user, active }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleItemClick = () => {
    setIsOpen(false);
  };
  
  return (
    <div className="w-full h-auto">
      <nav className=" h-20 flex justify-between items-center">
        <div className="flex gap-3 justify-center items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger>
              {" "}
              <AlignJustify className="cursor-pointer block md:hidden" />
            </SheetTrigger>
            <SheetContent
              // onClick={close}
              side={"left"}
              className="w-56 sm:w-72 "
              style={{backgroundColor : "#a7c585"}}
            >
              <AdminSideBarMobile
                adminSideBarOptions={adminOptions}
                active={active}
                onItemClick={handleItemClick}
              />
            </SheetContent>
          </Sheet>
          <h1 className="text-xl  sm:text-3xl font-medium uppercase flex justify-center items-center gap-3">
            <Image height={60} src={logo} alt="logo" /> <span>GetJewels</span>
          </h1>
        </div>
        <p className="text-sm sm::text-lg md:text-2xl">
          {user && user.email}
        </p>
      </nav>
    </div>
  );
};
