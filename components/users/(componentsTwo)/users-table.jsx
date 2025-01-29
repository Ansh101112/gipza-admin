'use client';

import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/users/uiTwo/table";
import { Button } from "@/components/users/uiTwo/button";
import { Badge } from "@/components/users/uiTwo/badge";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const formatDate = (dateValue) => {
  if (dateValue?.seconds && dateValue?.nanoseconds) {
    return new Date(
      dateValue.seconds * 1000 + dateValue.nanoseconds / 1000000
    ).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  }

  if (typeof dateValue === "string") {
    return new Date(dateValue).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  }

  return "Invalid Date";
};

export function UsersTable({ searchQuery, sortOption, onTotalUsersUpdate, activeTab, onViewDetails }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const usersPerPage = 10;
  const [selectedUserAddresses, setSelectedUserAddresses] = useState([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/user/getUsers');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      // console.log(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = [...users];

    if (searchQuery) {
      filtered = filtered.filter(user =>
        Object.values(user).some(value =>
          String(value || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    return filtered.sort((a, b) => {
      if (sortOption === "Ascending") {
        return (a.name || '').localeCompare(b.name || '');
      } else {
        return (b.name || '').localeCompare(a.name || '');
      }
    });
  }, [users, searchQuery, sortOption]);

  // Filter out users with N/A IDs
  const validUsers = useMemo(() => {
    return filteredAndSortedUsers.filter(user => user.userId && user.userId !== 'N/A');
  }, [filteredAndSortedUsers]);

  // Update total users count whenever validUsers changes
  useEffect(() => {
    onTotalUsersUpdate(validUsers.length);
  }, [validUsers, onTotalUsersUpdate]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOption]);

  // Update pagination with valid users
  const totalPages = Math.ceil(validUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = validUsers.slice(startIndex, startIndex + usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleViewAddresses = (addresses) => {
    setSelectedUserAddresses(addresses);
    setIsAddressModalOpen(true);
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={40} color="#85716B" />
        </div>
      ) : (
        <div className="relative">
          {/* Table wrapper with min-height */}
          <div className="rounded-md min-h-[580px] bg-[#F3EAE7] mt-12">
            <div className="bg-[#F3EAE7] rounded-lg ">
              <Table>
                <TableHeader className="min-w-10">
                  <TableRow>
                    <TableHead className="py-3 font-semibold rounded-tl-lg">User ID</TableHead>
                    <TableHead className="py-3 font-semibold">Username</TableHead>
                    <TableHead className="py-3 font-semibold">Email</TableHead>
                    <TableHead className="py-3 font-semibold">Created At</TableHead>
                    <TableHead className="py-3 font-semibold">Status</TableHead>
                    <TableHead className="py-3 font-semibold rounded-tr-lg">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user, index) => {
                    const bgColor = index % 2 === 0 ? "bg-white" : "bg-[#F3EAE7]";

                    return (
                      <TableRow key={user.id} className="border">
                        <TableCell className={`px-1 py-3 ${bgColor}`}>{user.userId}</TableCell>
                        <TableCell className={`px-1 py-3 ${bgColor}`}>{user.username || 'N/A'}</TableCell>
                        <TableCell className={`px-1 py-3 ${bgColor}`}>{user.email || 'N/A'}</TableCell>
                        <TableCell className={`px-1 py-3 ${bgColor}`}>
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell className={`px-1 py-3 ${bgColor}`}>
                          <Badge 
                            className={cn(
                              "px-2 py-1 text-xs font-medium rounded-full transition-none hover:bg-opacity-100",
                              user.status === "active"
                                ? "bg-green-100 text-green-700 border-green-700/50 hover:bg-green-100 hover:text-green-700"
                                : "bg-red-100 text-red-700 border-red-700/50 hover:bg-red-100 hover:text-red-700"
                            )}
                          >
                            {user.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className={`px-3 py-2.5 rounded-e-xl flex items-center gap-2 ${bgColor}`}>
                          <MdOutlineRemoveRedEye
                            className="text-xl cursor-pointer text-[#6e554a]"
                            onClick={() => handleViewAddresses(user.addresses || [])}
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                className="h-8 w-8 p-0 hover:bg-transparent"
                              >
                                <BsThreeDotsVertical className="h-4 w-4 text-[#6e554a]" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                              align="end"
                              className="bg-white border border-[#E8DCD8]"
                            >
                              <DropdownMenuItem
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                onClick={() => {
                                  // Delete logic will go here
                                  console.log('Delete clicked for user:', user.userId);
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-[#6e554a] hover:text-[#4D413E] hover:bg-[#F3EAE7] cursor-pointer"
                                onClick={() => {
                                  // Inactive logic will go here
                                  console.log('Inactive clicked for user:', user.userId);
                                }}
                              >
                                Make Inactive
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {paginatedUsers.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-96">
                        <h3 className="text-center py-5">No Data</h3>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination outside the wrapper */}
          {validUsers.length > 0 && (
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
          )}

          {/* Address Modal */}
          <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-[#4D413E] mb-4">
                  User Addresses
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {selectedUserAddresses.map((address, index) => (
                  <div 
                    key={address.id} 
                    className="p-4 rounded-lg border border-[#E8DCD8] bg-white"
                  >
                    <h3 className="font-medium text-[#4D413E] mb-2">
                      Address {index + 1}
                    </h3>
                    <div className="space-y-2 text-[#6e554a]">
                      <p><span className="font-medium">Name:</span> {address.firstName} {address.lastName}</p>
                      <p><span className="font-medium">Address:</span> {address.address}</p>
                      <p><span className="font-medium">Apartment:</span> {address.apartment}</p>
                      <p><span className="font-medium">City:</span> {address.city}</p>
                      <p><span className="font-medium">State:</span> {address.state}</p>
                      <p><span className="font-medium">Postal Code:</span> {address.postalCode}</p>
                    </div>
                  </div>
                ))}
                {selectedUserAddresses.length === 0 && (
                  <div className="col-span-2 text-center py-4 text-[#6e554a]">
                    No addresses found
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
}




