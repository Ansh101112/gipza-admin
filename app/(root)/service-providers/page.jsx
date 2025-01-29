"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/users/uiTwo/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { FiChevronDown } from "react-icons/fi";
import { useEffect, useState, useMemo } from "react";
import { MdOutlineRemoveRedEye, MdRefresh } from "react-icons/md";
import Modal from "@/components/VendorModal";
import ServiceProviderDetails from "@/components/Vendor/ServiceProviderDetails";
import { ClipLoader } from "react-spinners";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

export default function ServiceProvidersPage() {
  const [selectedTab, setSelectedTab] = useState("Verified");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allProviders, setAllProviders] = useState([]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/vendor/getServiceProviders');
      const data = await response.json();
      setAllProviders(data || []);
    } catch (error) {
      console.error("Error fetching providers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const filteredProviders = useMemo(() => {
    let filtered = [...allProviders];

    // Filter by status
    filtered = filtered.filter(provider => {
      if (selectedTab === "Verified") {
        return provider.status === "verified";
      }
      if (selectedTab === "Unverified") {
        return provider.status === "unverified";
      }
      if (selectedTab === "Disabled") {
        return provider.status === "disabled";
      }
      return true;
    });

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(provider =>
        provider.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.personalDetails?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [allProviders, selectedTab, searchQuery]);

  const totalPages = Math.ceil(filteredProviders.length / 8); // Assuming 8 providers per page
  const getCurrentProviders = () => {
    const startIndex = (currentPage - 1) * 8;
    return filteredProviders.slice(startIndex, startIndex + 8);
  };

  const handleRefresh = () => {
    setSearchQuery("");
    setCurrentPage(1);
    fetchProviders();
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleViewDetails = (provider) => {
    setSelectedProvider(provider);
    setIsDetailsModalOpen(true);
  };

  const handleChangeStatus = async (providerId, newStatus) => {
    try {
      // Here you would typically make an API call to update the status
      console.log(`Changing status of ${providerId} to ${newStatus}`);
      const updatedProviders = allProviders.map(provider => {
        if (provider.id === providerId) {
          return { ...provider, status: newStatus };
        }
        return provider;
      });
      setAllProviders(updatedProviders);
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  return (
    <>
      <div className="lg:px-6 md:px-4 lg:py-6 py-2 px-0">
        <div className="flex flex-wrap justify-between mb-3">
          <h1 className="text-4xl font-bold sm:mb-6 mb-2 text-[#4D413E]">Service Providers</h1>

          <div className="flex sm:flex-nowrap flex-wrap sm:justify-between justify-start items-center mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="mr-4 sm:mt-0 mt-2 flex items-center">
                  Sort
                  <FiChevronDown className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem onSelect={() => setSortOption("Ascending")}>
                  Ascending
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSortOption("Descending")}>
                  Descending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-4">
              <Input
                placeholder="Search providers..."
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
          {["Verified", "Unverified", "Disabled"].map((tab) => (
            <Button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              variant="outline"
              size="sm"
              className={`text-5 px-3 border rounded-xl border-[#4D413E] ${
                selectedTab === tab
                  ? "bg-[#4D413E] text-white hover:bg-[#4D413E]"
                  : "bg-transparent text-[#6e554a] hover:bg-[#4D413E] hover:text-white"
              } transition-colors`}
            >
              {tab}
            </Button>
          ))}
        </div>

        <div className="bg-[#F3EAE7] rounded-lg shadow-md">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <ClipLoader size={40} color="#85716B" />
            </div>
          ) : getCurrentProviders().length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Image src="/dog.png" alt="No data" width={200} height={200} />
              <p className="text-xl text-gray-500 mt-4">{`No One is currently ${selectedTab}`}</p>
            </div>
          ) : (
            <Table className="border-none">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-10 rounded-s-lg"></TableHead>
                  <TableHead className="py-3 font-semibold">Provider ID</TableHead>
                  <TableHead className="py-3 font-semibold">Name</TableHead>
                  <TableHead className="py-3 font-semibold">Phone Number</TableHead>
                  <TableHead className="py-3 font-semibold">Email</TableHead>
                  <TableHead className="py-3 font-semibold rounded-e-lg">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getCurrentProviders().map((provider, index) => {
                  const bgColor = index % 2 === 0 ? "bg-white" : "bg-[#F3EAE7]";
                  return (
                    <TableRow key={provider.id} className="my-1 shadow-sm border-none overflow-hidden rounded-xl bg-transparent">
                      <TableCell className={`px-1 py-1.5 rounded-s-xl ${bgColor}`}>
                        <img 
                          src={provider?.documents?.photo} 
                          alt={`${provider?.personalDetails?.name || 'Provider'}'s profile`} 
                          className="min-w-8 w-8 h-8 rounded-full mr-2" 
                        />
                      </TableCell>
                      <TableCell className={`px-1 py-3 ${bgColor}`}>{provider?.id}</TableCell>
                      <TableCell className={`px-1 py-3 ${bgColor}`}>{provider?.personalDetails?.name}</TableCell>
                      <TableCell className={`px-1 py-3 ${bgColor}`}>{provider?.personalDetails?.phoneNumber}</TableCell>
                      <TableCell className={`px-1 py-3 ${bgColor}`}>{provider?.personalDetails?.email}</TableCell>
                      <TableCell className={`px-3 py-2.5 rounded-e-xl flex items-center gap-2 ${bgColor}`}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="text-5 px-3 border rounded-xl border-[#4D413E] bg-transparent text-[#6e554a]">
                              Change Status
                              <FiChevronDown className="ml-2" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-white">
                            <DropdownMenuItem onSelect={() => handleChangeStatus(provider.id, "verified")}>
                              Verify
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleChangeStatus(provider.id, "unverified")}>
                              Unverify
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleChangeStatus(provider.id, "disabled")}>
                              Disable
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <MdOutlineRemoveRedEye
                          className="text-xl cursor-pointer text-[#6e554a]"
                          onClick={() => handleViewDetails(provider)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <div className="text-sm font-medium text-[#4D413E]">
            Page {currentPage} of {totalPages}
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
              disabled={currentPage === totalPages}
              className="border-[#4D413E] text-[#4D413E] hover:bg-[#4D413E] hover:text-white transition-colors"
            >
              Next
            </Button>
          </div>
        </div>

        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="w-full bg-white p-4 md:p-6 rounded-lg mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg md:text-xl lg:text-2xl text-center font-bold text-gray-800">
                Service Provider Details
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-auto max-h-[70vh] p-2">
              <ServiceProviderDetails selectedProvider={selectedProvider} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}