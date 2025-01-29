'use client';

import React, { useState } from "react";
import { UsersTable } from "./(componentsTwo)/users-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { FiChevronDown } from "react-icons/fi";
import { MdRefresh } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Descending");
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeTab, setActiveTab] = useState("Active");

  const tabs = ["Active", "Inactive"];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const handleTotalUsersUpdate = (count) => {
    setTotalUsers(count);
  };

  const handleViewDetails = (user) => {
    router.push(`/users/users-details?id=${user.id}`);
  };

  return (
    <div className="lg:px-6 md:px-4 lg:py-6 py-2 px-0">
      <div className="flex flex-wrap justify-between mb-3">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold sm:mb-6 mb-2 text-[#4D413E]">Users</h1>
          <span className="text-lg font-medium text-[#85716B]">({totalUsers})</span>
        </div>

        <div className="flex sm:flex-nowrap flex-wrap sm:justify-between justify-start items-center mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="mr-4 sm:mt-0 mt-2 flex items-center">
                Sort: {sortOption}
                <FiChevronDown className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              <DropdownMenuItem onClick={() => setSortOption("Ascending")}>
                Ascending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("Descending")}>
                Descending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-4">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <button
              onClick={handleRefresh}
              className="border border-[#85716B] text-[#A1887F] px-2 py-2 text-xl rounded-xl flex items-center gap-2 ml-4"
            >
              {loading ? (
                <ClipLoader size={20} color="#85716B" loading={true} />
              ) : (
                <MdRefresh />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        {tabs.map((tab) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            variant={activeTab === tab ? "default" : "outline"}
            className={`${activeTab === tab
                ? "bg-[#695d56] text-white hover:bg-[#695d56]"
                : "text-[#695d56] hover:text-[#695d56]"
              } border-[#695d56]`}
          >
            {tab}
          </Button>
        ))}
      </div>

      <UsersTable
        searchQuery={searchQuery}
        sortOption={sortOption}
        onTotalUsersChange={handleTotalUsersUpdate}
        activeTab={activeTab.toLowerCase()}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}
