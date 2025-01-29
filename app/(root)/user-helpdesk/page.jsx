"use client";

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { IoMdRefresh } from "react-icons/io";
import { FiX, FiChevronDown } from "react-icons/fi";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { ClipLoader } from "react-spinners";

export default function UserHelpdeskPage() {
  const [selectedTab, setSelectedTab] = useState("Opened");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");

  const ordersPerPage = 8;
  const tabs = ["Opened", "Resolved", "Re-opened", "Closed"];

  const orders = [
    {
      bookingId: "YGSBGFCNDB",
      username: "John Doe",
      email: "john@gmail.com",
      category: "Brand",
      status: "Opened",
    },
    // ... your existing orders data
  ];

  const paginatedData = useMemo(() => {
    let filtered = orders.filter(order => order.status === selectedTab);

    if (searchQuery.trim()) {
      filtered = filtered.filter(order =>
        order.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const calculatedTotalPages = Math.ceil(filtered.length / ordersPerPage) || 1;
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;

    return {
      orders: filtered.slice(startIndex, endIndex),
      totalPages: calculatedTotalPages
    };
  }, [orders, selectedTab, searchQuery, currentPage]);

  const handleNextPage = () => {
    if (currentPage < paginatedData.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="lg:px-6 md:px-4 lg:py-4 py-2 px-0">
      <div className="flex flex-wrap justify-between mb-3 ">
        <h1 className="text-4xl font-bold sm:mb-6 mb-2 text-[#4D413E] mt-2">User Helpdesk</h1>

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
              <IoMdRefresh />
            )}
          </Button>
        </div>
      </div>

      <div className="flex md:flex-wrap flex-nowrap sm:mb-6 mb-2 table-scrollbar overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab}
            onClick={() => {
              setSelectedTab(tab);
              setCurrentPage(1);
            }}
            className={cn(
              "px-4 mb-5 me-4 py-2",
              selectedTab === tab
                ? "bg-[#695d56] text-white hover:bg-[#695d56]"
                : "border border-[#695d56] text-[#695d56] bg-white hover:bg-[#695d56] hover:text-white"
            )}
          >
            {tab}
          </Button>
        ))}
      </div>

      <div className="bg-[#F3EAE7] rounded-lg min-h-[580px]">
        <Table className="border-none">
          <TableHeader className="min-w-10 rounded-tl-lg rounded-tr-lg">
            <TableRow>
              <TableHead className="h-12 px-3 bg-[#F3EAE7] text-[#9c786c] py-0 font-semibold text-nowrap rounded-tl-lg">
                User ID
              </TableHead>
              <TableHead className="h-12 px-3 bg-[#F3EAE7] text-[#9c786c] py-0 font-semibold text-nowrap">
                Name
              </TableHead>
              <TableHead className="h-12 px-3 bg-[#F3EAE7] text-[#9c786c] py-0 font-semibold text-nowrap">
                Email ID
              </TableHead>
              <TableHead className="h-12 px-3 bg-[#F3EAE7] text-[#9c786c] py-0 font-semibold text-nowrap">
                Category
              </TableHead>
              <TableHead className="h-12 px-4 bg-[#F3EAE7] text-[#9c786c] py-0 font-semibold text-nowrap rounded-tr-lg">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.orders.length ? (
              paginatedData.orders.map((order, index) => (
                <TableRow key={index}>
                  <TableCell className="align-center text-[#6e554a] text-sm font-medium h-1 px-3">
                    {order.bookingId}
                  </TableCell>
                  <TableCell className="align-center text-[#6e554a] text-sm font-medium h-1 px-3">
                    {order.username}
                  </TableCell>
                  <TableCell className="align-center text-[#6e554a] text-sm font-medium h-1 px-3">
                    {order.email}
                  </TableCell>
                  <TableCell className="align-center text-[#6e554a] text-sm font-medium p-0 h-0 px-3">
                    {order.category}
                  </TableCell>
                  <TableCell className="px-3 py-2">
                    <div className="flex gap-4 justify-left p-0 mt-0 mb-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-5 px-3 border rounded-xl border-[#4D413E] bg-transparent text-[#6e554a]"
                        onClick={() => setIsQueryModalOpen(true)}
                      >
                        Resolve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-5 px-1 border rounded-xl border-[#4D413E] bg-transparent text-[#6e554a]"
                        onClick={() => setIsQueryModalOpen(true)}
                      >
                        <MdOutlineRemoveRedEye className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="bg-[#F3EAE7]">
                <TableCell
                  colSpan={5}
                  className="h-24 text-center bg-[#F3EAE7]"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {paginatedData.orders.length > 0 && (
        <div className="flex justify-between mt-4">
          <div className="text-sm font-medium text-[#4D413E]">
            Page {currentPage} of {paginatedData.totalPages}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="border-[#4D413E] text-[#4D413E] hover:bg-[#4D413E] hover:text-white transition-colors"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === paginatedData.totalPages}
              className="border-[#4D413E] text-[#4D413E] hover:bg-[#4D413E] hover:text-white transition-colors"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {isQueryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
            <h2 className="text-2xl font-bold mb-4 text-[#85716B]">Query Details</h2>
            <button className="absolute top-4 right-4" onClick={() => setIsQueryModalOpen(false)}>
              <FiX className="text-xl" />
            </button>
            <label className="block mb-2 font-semibold text-lg text-[#4D413E]">Open Query</label>
            <Input
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
              className="mb-4 w-full h-20 bg-[#C4B0A9] p-2 rounded"
            />
            <div className="flex justify-end">
              <Button
                onClick={() => setIsQueryModalOpen(false)}
                className="bg-[#4D413E] text-white px-4 py-2"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}