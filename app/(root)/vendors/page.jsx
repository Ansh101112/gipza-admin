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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { FiChevronDown } from "react-icons/fi";
import { useEffect, useState, useMemo, useCallback } from "react";
import { MdOutlineRemoveRedEye, MdRefresh } from "react-icons/md";
import Modal from "@/components/VendorModal";
import VendorDetails from "@/components/Vendor/VendorDetails";
import { ClipLoader } from "react-spinners";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/auth-context";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Label } from "@/components/ui/label";
import VendorProductsTable from "@/components/Vendor/VendorProductsTable";

export default function VendorsPage() {
  const [selectedTab, setSelectedTab] = useState("Verified");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorStatus, setVendorStatus] = useState("Verified");
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("Descending");
  const [allVendors, setAllVendors] = useState([]);
  const { currentUser } = useAuth();
  const [filterOption, setFilterOption] = useState("All");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const tabs = ["Verified", "Unverified", "Disabled", "Initiated"];
  const vendorsPerPage = 10;

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/vendor/getVendors');
      const data = await response.json();
      setAllVendors(data || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Update the filteredVendors useMemo
  const filteredVendors = useMemo(() => {
    let filtered = [...allVendors];

    // Filter by status - match exactly with database values
    filtered = filtered.filter(vendor => {
      if (selectedTab === "Verified") {
        return vendor.status === "verified";
      }
      if (selectedTab === "Unverified") {
        return vendor.status === "unverified";
      }
      if (selectedTab === "Disabled") {
        return vendor.status === "disabled";
      }
      if (selectedTab === "Initiated") {
        return vendor.status === "initiated";
      }
      return true;
    });

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(vendor =>
        vendor.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.personalDetails?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by name
    filtered.sort((a, b) => {
      const nameA = a.personalDetails?.name?.toLowerCase() || '';
      const nameB = b.personalDetails?.name?.toLowerCase() || '';
      return sortOption === "Ascending"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    return filtered;
  }, [allVendors, selectedTab, searchQuery, sortOption]);


  const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);
  const getCurrentVendors = () => {
    const startIndex = (currentPage - 1) * vendorsPerPage;
    const endIndex = startIndex + vendorsPerPage;
    return filteredVendors.slice(startIndex, endIndex);
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

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const openModal = (vendor) => {
    setSelectedVendor(vendor);
    setVendorStatus(selectedTab);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVendor(null);
  };

  // Update the handleStatusChange function
  const handleStatusChange = async (newStatus) => {
    if (!selectedVendor) return;

    try {
      const response = await fetch("/api/vendor/updateVendor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vendorId: selectedVendor.id,
          updatedDetails: {
            status: newStatus.toLowerCase() // Ensure status is lowercase
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update vendor status");
      }

      await response.json();
      toast.success(`Vendor status updated to ${newStatus}`);
      fetchVendors();
      closeModal();
    } catch (error) {
      console.error("Error updating vendor status:", error);
      toast.error("Failed to update vendor status");
    }
  };



  const handleRefresh = () => {
    setSearchQuery("");
    setCurrentPage(1);
    setLoading(true);
    fetchVendors();
  };

  // Modified reset function with safe cleanup
  const resetAllStates = useCallback(() => {
    setIsModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsEditModalOpen(false);
    setIsDropdownOpen(false);
    setSelectedVendor(null);
    setEditingVendor(null);

    // Safely remove overlays
    try {
      const overlays = document.querySelectorAll('[role="dialog"], [role="presentation"]');
      overlays.forEach(overlay => {
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      });
    } catch (error) {
      // Silently handle removal errors
    }

    // Reset body scroll
    document.body.style.overflow = 'auto';
  }, []); // Empty dependency array since we're only using setState functions

  // Use useEffect to clean up on component unmount
  useEffect(() => {
    return () => {
      resetAllStates();
    };
  }, [resetAllStates]);

  // Simplified modal close handlers
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVendor(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedVendor(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingVendor(null);
  };

  // Simplified handlers
  const handleViewVendorDetails = (vendor) => {
    resetAllStates();
    setSelectedVendor(vendor);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (vendor) => {
    resetAllStates();
    setEditingVendor(vendor);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (vendorId) => {
    resetAllStates();
    try {
      const response = await fetch("/api/vendor/deleteVendor", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId }),
      });

      if (response.ok) {
        toast.success("Vendor deleted successfully");
        fetchVendors();
      } else {
        throw new Error("Failed to delete vendor");
      }
    } catch (error) {
      toast.error("Failed to delete vendor");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/vendor/updateVendor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vendorId: editingVendor.id,
          updatedDetails: editingVendor,
        }),
      });

      if (!response.ok) throw new Error("Failed to update vendor");

      toast.success("Vendor updated successfully");
      setIsEditModalOpen(false);
      fetchVendors();
    } catch (error) {
      console.error("Error updating vendor:", error);
      toast.error("Failed to update vendor");
    }
  };

  return (
    <>
      <div className="lg:px-6 md:px-4 lg:py-6 py-2 px-0">
        <div className="flex flex-wrap justify-between mb-3">
          <h1 className="text-4xl font-bold sm:mb-6 mb-2 text-[#4D413E]">Vendors</h1>

          <div className="flex justify-between items-center mb-0 mt-5">
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

            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="mr-4 sm:mt-0 mt-2 flex items-center">
                  Filter by Status
                  <FiChevronDown className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem onSelect={() => setFilterOption("All")}>
                  All
                </DropdownMenuItem>
                {tabs.map((tab) => (
                  <DropdownMenuItem key={tab} onSelect={() => setFilterOption(tab)}>
                    {tab}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu> */}

            <div className="flex items-center sm:mt-0 mt-2">
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mr-4"
              />
              <button
                onClick={handleRefresh}
                className="border border-[#85716B] text-[#A1887F] px-2 py-2 text-xl rounded-xl flex items-center gap-2"
              >
                {loading ? (
                  <ClipLoader size={20} color="#85716B" loading={loading} />
                ) : (
                  <MdRefresh />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap mb-6 sidebar-scrollbar overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab}
              onClick={() => {
                setSelectedTab(tab);
                setCurrentPage(1);
              }}
              className={`px-4 me-4 mb-2 py-2 ${selectedTab === tab ? "bg-[#695d56] text-white" : "text-[#695d56]"}`}
              variant={selectedTab === tab ? "solid" : "outline"}
            >
              {tab}
            </Button>
          ))}
        </div>

        <div className="bg-[#F3EAE7] rounded-lg shadow-md">
          {loading ? (
            <div className="flex flex-col items-center justify-center bg-[#F3EAE7] h-60">
              <ClipLoader size={30} color="#85716B" loading={loading} />
            </div>
          ) : getCurrentVendors().length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Image src="/dog.png" alt="No data" width={200} height={200} />
              <p className="text-xl text-gray-500 mt-4">{`No One is currently ${selectedTab}`}</p>
            </div>
          ) : (
            <div className="bg-[#F3EAE7] rounded-lg min-h-[580px]">
            <Table className="border-none">
              <TableHeader className="min-w-10">
                <TableRow>
                  {selectedTab === "Initiated" ? (
                    // Simplified header for Initiated tab
                    <>
                      <TableHead className="py-3 font-semibold rounded-tl-lg">Vendor ID</TableHead>
                      <TableHead className="py-3 font-semibold text-nowrap">Vendor Name</TableHead>
                      <TableHead className="py-3 font-semibold text-nowrap">Phone Number</TableHead>
                      <TableHead className="py-3 font-semibold text-nowrap">Email ID</TableHead>
                      <TableHead className="py-3 font-semibold rounded-tr-lg">Created At</TableHead>
                    </>
                  ) : (
                    // Full header for other tabs
                    <>
                      <TableHead className="min-w-10 rounded-s-lg"></TableHead>
                      <TableHead className="py-3 font-semibold rounded-s-lg">Vendor ID</TableHead>
                      <TableHead className="py-3 font-semibold text-nowrap">Vendor Name</TableHead>
                      <TableHead className="py-3 font-semibold text-nowrap">Business Name</TableHead>
                      <TableHead className="py-3 font-semibold text-nowrap">Phone Number</TableHead>
                      <TableHead className="py-3 font-semibold text-nowrap">Email ID</TableHead>
                      <TableHead className="py-3 font-semibold rounded-e-lg">Status</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {getCurrentVendors().map((vendor, index) => {
                  const bgColor = index % 2 === 0 ? "bg-white" : "bg-[#F3EAE7]";
                  return (
                    <TableRow key={vendor.id || index}
                      className="my-1 shadow-sm border-none overflow-hidden bg-transparent"
                      onClick={(e) => e.stopPropagation()}>
                      {selectedTab === "Initiated" ? (
                        // Simplified row for Initiated tab
                        <>
                          <TableCell className={`px-1 py-4 ${bgColor}`}>{vendor?.id}</TableCell>
                          <TableCell className={`px-1 py-4 ${bgColor}`}>{vendor?.personalDetails?.name}</TableCell>
                          <TableCell className={`px-1 py-4 ${bgColor}`}>{vendor?.personalDetails?.phoneNumber}</TableCell>
                          <TableCell className={`px-1 py-4 ${bgColor}`}>{vendor?.personalDetails?.email}</TableCell>
                          <TableCell className={`px-1 py-4 ${bgColor}`}>
                            {new Date(vendor?.createdAt?.seconds * 1000).toLocaleDateString()}
                          </TableCell>
                        </>
                      ) : (
                        // Full row for other tabs
                        <>
                          <TableCell className={`px-1 py-1.5  ${bgColor}`}>
                            <img src={vendor?.documents?.photo} alt={`${vendor?.personalDetails?.name || 'Vendor'}'s profile`} className="min-w-8 w-8 h-8 rounded-full mr-2" />
                          </TableCell>
                          <TableCell className={`px-1 py-3 ${bgColor}`}>{vendor?.id}</TableCell>
                          <TableCell className={`px-1 py-3 ${bgColor}`}>{vendor?.personalDetails?.name}</TableCell>
                          <TableCell className={`px-1 py-3 ${bgColor}`}>{vendor?.businessDetails?.businessName}</TableCell>
                          <TableCell className={`px-1 py-3 ${bgColor}`}>{vendor?.personalDetails?.phoneNumber}</TableCell>
                          <TableCell className={`px-1 py-3 ${bgColor}`}>{vendor?.personalDetails?.email}</TableCell>
                          <TableCell 
                            className={`px-3 py-2.5 relative ${bgColor}`}
                          >
                            <div className="flex items-center gap-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-5 px-3 border rounded-xl border-[#4D413E] bg-transparent"
                                onClick={() => openModal(vendor)}
                              >
                                Change Status
                              </Button>
                              <div className="flex items-center gap-4">
                                <button
                                  type="button"
                                  onClick={() => handleViewVendorDetails(vendor)}
                                  className="p-2 hover:bg-[#F3EAE7] rounded-full transition-colors"
                                >
                                  <MdOutlineRemoveRedEye 
                                    className="text-xl text-[#6e554a] hover:text-[#4D413E]"
                                  />
                                </button>
                                {selectedTab === "Unverified" && (
                                  <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        className="h-8 w-8 p-0 hover:bg-[#F3EAE7] rounded-full"
                                      >
                                        <BsThreeDotsVertical className="h-4 w-4 text-[#6e554a]" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent 
                                      align="end"
                                      className="bg-white border border-[#E8DCD8]"
                                    >
                                      <DropdownMenuItem
                                        onClick={() => handleEdit(vendor)}
                                        className="cursor-pointer text-[#6e554a] hover:text-[#4D413E] hover:bg-[#F3EAE7]"
                                      >
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleDelete(vendor.id)}
                                        className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-4">
          {/* Page count on left */}
          <div className="text-sm font-medium text-[#4D413E]">
            Page {currentPage} of {totalPages}
          </div>

          {/* Navigation buttons on right */}
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

        {isModalOpen && selectedVendor && (
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            className="relative z-50"
            onConfirm={() => handleStatusChange(vendorStatus)}
            statusOptions={["Select Status", "Verified", "Unverified", "Disabled"]}
            selectedTab={vendorStatus}
            setSelectedTab={setVendorStatus}
          >
            <div className="mt-4 flex justify-end">
              <Button onClick={() => handleStatusChange("Verified")}>
                Verify
              </Button>
              <Button onClick={() => handleStatusChange("Unverified")}>
                Unverify
              </Button>
              <Button onClick={() => handleStatusChange("Disabled")}>
                Disable
              </Button>
            </div>
          </Modal>
        )}

        <Dialog 
          open={isDetailsModalOpen} 
          onOpenChange={handleCloseDetailsModal}
        >
          <DialogContent className="max-w-[95%] md:max-w-4xl max-h-[85vh] overflow-y-auto p-4 md:p-6 lg:p-8">
            <DialogHeader>
              <DialogTitle className="text-xl md:text-2xl font-semibold text-[#4D413E] mb-4">
                Vendor Details
              </DialogTitle>
            </DialogHeader>
            
            {selectedVendor && (
              <div className="space-y-4 md:space-y-6">
                <VendorDetails 
                  vendor={selectedVendor} 
                  onClose={handleCloseDetailsModal}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog 
          open={isEditModalOpen} 
          onOpenChange={handleCloseEditModal}
          className="relative z-50"
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-[#4D413E] mb-6 border-b pb-4">
                Edit Vendor Details
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-8">
              {/* Personal Details Section */}
              <div className="bg-[#F3EAE7] p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-lg text-[#4D413E] border-b border-[#E8DCD8] pb-2">
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-[#4D413E]">Full Name</div>
                    <Input
                      value={editingVendor?.personalDetails?.name || ''}
                      onChange={(e) => setEditingVendor(prev => ({
                        ...prev,
                        personalDetails: {
                          ...prev.personalDetails,
                          name: e.target.value
                        }
                      }))}
                      className="border-[#E8DCD8] bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-[#4D413E]">Email</div>
                    <Input
                      value={editingVendor?.personalDetails?.email || ''}
                      onChange={(e) => setEditingVendor(prev => ({
                        ...prev,
                        personalDetails: {
                          ...prev.personalDetails,
                          email: e.target.value
                        }
                      }))}
                      className="border-[#E8DCD8] bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-[#4D413E]">Phone Number</div>
                    <Input
                      value={editingVendor?.personalDetails?.phoneNumber || ''}
                      onChange={(e) => setEditingVendor(prev => ({
                        ...prev,
                        personalDetails: {
                          ...prev.personalDetails,
                          phoneNumber: e.target.value
                        }
                      }))}
                      className="border-[#E8DCD8] bg-white"
                    />
                  </div>
                  <div className="flex gap-8 items-center">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-[#4D413E]">Is Ecommerce</div>
                      <input
                        type="checkbox"
                        checked={editingVendor?.personalDetails?.isEcommerce || false}
                        onChange={(e) => setEditingVendor(prev => ({
                          ...prev,
                          personalDetails: {
                            ...prev.personalDetails,
                            isEcommerce: e.target.checked
                          }
                        }))}
                        className="h-5 w-5 border-[#E8DCD8] rounded text-[#4D413E]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-[#4D413E]">Is Service</div>
                      <input
                        type="checkbox"
                        checked={editingVendor?.personalDetails?.isService || false}
                        onChange={(e) => setEditingVendor(prev => ({
                          ...prev,
                          personalDetails: {
                            ...prev.personalDetails,
                            isService: e.target.checked
                          }
                        }))}
                        className="h-5 w-5 border-[#E8DCD8] rounded text-[#4D413E]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Details Section */}
              <div className="bg-[#F3EAE7] p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-lg text-[#4D413E] border-b border-[#E8DCD8] pb-2">
                  Business Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-[#4D413E]">Business Name</div>
                    <Input
                      value={editingVendor?.businessDetails?.businessName || ''}
                      onChange={(e) => setEditingVendor(prev => ({
                        ...prev,
                        businessDetails: {
                          ...prev.businessDetails,
                          businessName: e.target.value
                        }
                      }))}
                      className="border-[#E8DCD8] bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-[#4D413E]">Brand Name</div>
                    <Input
                      value={editingVendor?.businessDetails?.brandName || ''}
                      onChange={(e) => setEditingVendor(prev => ({
                        ...prev,
                        businessDetails: {
                          ...prev.businessDetails,
                          brandName: e.target.value
                        }
                      }))}
                      className="border-[#E8DCD8] bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-[#4D413E]">PAN Number</div>
                    <Input
                      value={editingVendor?.businessDetails?.panNumber || ''}
                      onChange={(e) => setEditingVendor(prev => ({
                        ...prev,
                        businessDetails: {
                          ...prev.businessDetails,
                          panNumber: e.target.value
                        }
                      }))}
                      className="border-[#E8DCD8] bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-[#4D413E]">Establishment Year</div>
                    <Input
                      value={editingVendor?.businessDetails?.establishmentYear || ''}
                      onChange={(e) => setEditingVendor(prev => ({
                        ...prev,
                        businessDetails: {
                          ...prev.businessDetails,
                          establishmentYear: e.target.value
                        }
                      }))}
                      className="border-[#E8DCD8] bg-white"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <div className="text-sm font-medium text-[#4D413E]">Pickup Address</div>
                    <Input
                      value={editingVendor?.businessDetails?.pickupAddress || ''}
                      onChange={(e) => setEditingVendor(prev => ({
                        ...prev,
                        businessDetails: {
                          ...prev.businessDetails,
                          pickupAddress: e.target.value
                        }
                      }))}
                      className="border-[#E8DCD8] bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-[#4D413E]">Pin Code</div>
                    <Input
                      value={editingVendor?.businessDetails?.pinCode || ''}
                      onChange={(e) => setEditingVendor(prev => ({
                        ...prev,
                        businessDetails: {
                          ...prev.businessDetails,
                          pinCode: e.target.value
                        }
                      }))}
                      className="border-[#E8DCD8] bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Details Section */}
              <div className="bg-[#F3EAE7] p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-lg text-[#4D413E] border-b border-[#E8DCD8] pb-2">
                  Bank Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-[#4D413E]">Account Holder Name</div>
                    <Input
                      value={editingVendor?.bankDetails?.holderName || ''}
                      onChange={(e) => setEditingVendor(prev => ({
                        ...prev,
                        bankDetails: {
                          ...prev.bankDetails,
                          holderName: e.target.value
                        }
                      }))}
                      className="border-[#E8DCD8] bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-[#4D413E]">Account Number</div>
                    <Input
                      value={editingVendor?.bankDetails?.accountNumber || ''}
                      onChange={(e) => setEditingVendor(prev => ({
                        ...prev,
                        bankDetails: {
                          ...prev.bankDetails,
                          accountNumber: e.target.value
                        }
                      }))}
                      className="border-[#E8DCD8] bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-[#4D413E]">IFSC Code</div>
                    <Input
                      value={editingVendor?.bankDetails?.ifsc || ''}
                      onChange={(e) => setEditingVendor(prev => ({
                        ...prev,
                        bankDetails: {
                          ...prev.bankDetails,
                          ifsc: e.target.value
                        }
                      }))}
                      className="border-[#E8DCD8] bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="bg-[#F3EAE7] p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-lg text-[#4D413E] border-b border-[#E8DCD8] pb-2">
                  Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {editingVendor?.documents && Object.entries(editingVendor.documents).map(([key, url]) => (
                    <div key={key} className="p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-sm font-medium text-[#4D413E] capitalize mb-2">{key}</div>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Document
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter className="mt-8 pt-4 border-t border-[#E8DCD8]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="border-[#4D413E] text-[#4D413E]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#4D413E] text-white hover:bg-[#362f2d]"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}