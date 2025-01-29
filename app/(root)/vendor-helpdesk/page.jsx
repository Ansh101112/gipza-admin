"use client"

import { useAuth } from "@/hooks/auth-context";
import { useEffect, useState } from "react";
import { DataTable } from "../../../components/adminPage/optionsPages/dataTableHelpDesk";
import { useModel } from "@/hooks/model-context";
import { getAllQueryFromFireStore } from "@/lib/firebaseFunc";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { FiChevronDown } from "react-icons/fi";
import { IoMdRefresh } from "react-icons/io";
import { ClipLoader } from "react-spinners";
import { MdRefresh } from "react-icons/md";

export default function SellerHelpdeskPage(){
  const [query, setQuery] = useState([]);
  const [section, setSection] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useAuth();
  const { isUpdated } = useModel();
  const [isChanged, setIsChanged] = useState(false);

  const onCLick = (e) => {
    if (section !== e.value && e.value === "active") {
      setSection("active");
    } else if (section !== e.value && e.value === "closed") {
      setSection("closed");
    } else if (section !== e.value && e.value === "resolved") {
      setSection("resolved");
    } else if (section !== e.value && e.value === "reopened") {
      setSection("reopened");
    }
  };

  const getQueries = async () => {
    try {
      setRefresh(true);
      const queries = await getAllQueryFromFireStore(section);
    
      const processedQueries = queries.map((query) => ({
        ...query,
        createdAt: query.createdAt
          ? new Date(query.createdAt.seconds * 1000 + query.createdAt.nanoseconds / 1e6)
          : null,
      }));
    
      setQuery(processedQueries);
    } catch (error) {
      console.error("Error fetching queries:", error);
    } finally {
      setTimeout(() => {
        setRefresh(false);
      }, 300);
    }
  };  

  useEffect(() => {
    getQueries();
    setIsChanged(false)
  }, [isUpdated, section, isChanged]);
  
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="lg:px-6 md:px-4 lg:py-4 py-2 px-0">
      <div className="flex flex-wrap justify-between mb-3 ">
        <h1 className="text-4xl font-bold sm:mb-6 mb-2 text-[#4D413E] mt-2">Vendor Helpdesk</h1>

        {/* Top Controls with consistent styling */}
        <div className="flex justify-between items-center mb-0 mt-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="mr-4 flex items-center">
                Sort By Date {sortOrder === "asc" ? "" : ""}
                <FiChevronDown className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                Ascending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                Descending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mr-4"
          />
          
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="border border-[#85716B] text-[#A1887F] px-2 py-2 text-xl rounded-xl flex items-center gap-2"
          >
            {loading ? (
              <ClipLoader size={20} color="#85716B" loading={loading} />
            ) : (
              <MdRefresh />
            )}
          </Button>
        </div>
      </div>

      {/* Updated tabs with consistent styling */}
      <div className="flex md:flex-wrap flex-nowrap sm:mb-6 mb-2 table-scrollbar overflow-x-auto">
        {["Active", "Resolved", "Reopened", "Closed"].map((tab) => (
          <Button
            key={tab}
            value={tab.toLowerCase()}
            onClick={(e) => onCLick(e.target)}
            className={cn(
              "px-4 mb-5 me-4 py-2",
              section === tab.toLowerCase()
                ? "bg-[#695d56] text-white hover:bg-[#695d56]"
                : "border border-[#695d56] text-[#695d56] bg-white hover:bg-[#695d56] hover:text-white"
            )}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* DataTable with consistent styling */}
      <div className="bg-[#F3EAE7] rounded-lg min-h-[580px]">
        <DataTable
          getQueries={getQueries}
          finalData={query}
          option={"query"}
          section={section}
          setSection={setSection}
          setIsChanged={setIsChanged}
          searchQuery={searchQuery}
          sortOrder={sortOrder}
        />
      </div>
    </div>
  );
};
