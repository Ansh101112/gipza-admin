"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/users/uiTwo/table";
import { Button } from "@/components/users/uiTwo/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useAuth } from "@/hooks/auth-context";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { MdOutlineRemoveRedEye, MdRefresh } from "react-icons/md";
import Image from "next/image";
import { ClipLoader } from "react-spinners";

const OrdersPage = () => {
  const [selectedTab, setSelectedTab] = useState("Initiated");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Descending");
  const [filterOption, setFilterOption] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const { currentUser } = useAuth();
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isServiceProviderModalOpen, setServiceProviderModalOpen] = useState(false);
  const [isBookingDetailsModalOpen, setBookingDetailsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(false);

  const ordersPerPage = 10;

  useEffect(() => {
    if (currentUser) {
      fetchOrders(currentUser.id);
    }
  }, [currentUser])

  const tabs = [
    "Initiated",
    "Reassigned",
    "Assigned",
    "Accepted",
    "Pickup Raised",
    "Cancelled",
    "Completed by Customer",
    "Completed by Both",
    "Marked by Completed",
  ];

  const statusMapping = {
    "Initiated": "incoming",
    "Reassigned": "reassigned",
    "Assigned": "assigned",
    "Accepted": "accepted",
    "Pickup Raised": "pickupRaised",
    "Cancelled": "cancelled",
    "Completed by Customer": "completedByCustomer",
    "Completed by Both": "completedByBoth",
    "Marked by Completed": "markedByCompleted",
  };

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/bookings/getAllBookings`);
      const data = await response.json();
      console.log(data)
      setAllOrders(data || []);
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    let filtered = [...allOrders];

    const dbStatus = statusMapping[selectedTab];
    if (dbStatus && dbStatus !== "All") {
      filtered = filtered.filter((order) => order?.status === dbStatus);
    }

    if (filterOption !== "All") {
      filtered = filtered.filter((order) => order?.status === filterOption);
    }

    if (searchQuery) {
      filtered = filtered.filter((order) =>
        order?.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order?.id && order?.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order?.vendorName && order?.vendorName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }


    if (sortOption === "Ascending") {
      filtered = filtered.sort((a, b) =>
        a.createdAt && b.createdAt
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : 0
      );
    } else if (sortOption === "Descending") {
      filtered = filtered.sort((a, b) =>
        a.createdAt && b.createdAt
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : 0
      );
    }
    setOrders(filtered);
  }, [allOrders, filterOption, selectedTab, searchQuery, sortOption]);



  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const totalPages = Math.ceil((orders?.length || 0) / ordersPerPage);

  const currentOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    setLoading(true)
    setSearchQuery("");
    setCurrentPage(1);
    setSelectedTab("Initiated")
    setFilterOption("All")
    fetchOrders();
  };

  const openServiceProviderModal = () => setServiceProviderModalOpen(true);
  const closeServiceProviderModal = () => setServiceProviderModalOpen(false);
  const openBookingDetailsModal = (order) => {
    setSelectedOrder(order);
    setBookingDetailsModalOpen(true);
  };
  const closeBookingDetailsModal = () => setBookingDetailsModalOpen(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/vendor/getServiceProviders")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setServiceProviders(data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching service providers:", error);
        setLoading(false);
      });
  }, []);


  const handleAssignProvider = async (provider) => {
    try {
      setIsDialogOpen(false);
      const payload = {
        orderId: selectedOrder.id,
        updateData: {
          vendorId: provider.id,
          vendorName: provider.personalDetails.name,
          vendorEmail: provider.personalDetails.email,
          vendorPhoneNumber: provider.personalDetails.phoneNumber,
        },
      };
      const response = await fetch("/api/bookings/updateBooking", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to assign provider. Please try again.");
      }
      const result = await response.json();
      setIsDialogOpen(false);
      setSelectedOrder(null)
    } catch (error) {
      console.error("Error assigning provider:", error);
    }

  };

  return (
    <div className="sm:px-6 py-6 px-2">
      <div className="flex flex-wrap justify-between mb-3">
        <h1 className="text-4xl font-bold sm:mb-6 mb-2 text-[#4D413E]">Bookings</h1>

        {/* Top Controls: Sort, Filter, Search */}
        <div className="flex sm:flex-nowrap flex-wrap sm:justify-between justify-start items-center mb-4">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="mr-4 sm:mt-0 mt-2 flex items-center">
                Sort
                <FiChevronDown className="ml-2" /> {/* Arrow Icon */}
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

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="mr-4 sm:mt-0 mt-2 flex items-center">
                Filter
                <FiChevronDown className="ml-2" /> {/* Arrow Icon */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              <DropdownMenuItem onSelect={() => setFilterOption("All")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilterOption("Completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilterOption("Pending")}>
                Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Input */}
          <div className="flex items-center sm:mt-0 mt-2">
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mr-4 focus:outline-none rounded-lg bg-[#F3EAE7] text-[#85716B]"
            />
            <button
              onClick={handleRefresh}
              className="border border-[#85716B] text-[#A1887F] px-2 py-2 text-xl rounded-xl flex items-center gap-2"
            >
              {
                loading ? <ClipLoader size={20} color="#85716B" loading={loading} /> : <MdRefresh />
              }

            </button>
          </div>
        </div>
      </div>

      <div
        className="flex md:flex-wrap flex-nowrap sm:mb-6 mb-2 table-scrollbar overflow-x-auto"
      >
        {tabs.map((tab) => (
          <Button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 mb-5 me-4 py-2 ${selectedTab === tab ? "bg-[#695d56] text-white" : "text-[#695d56]"
              }`}
            variant={selectedTab === tab ? "solid" : "outline"}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-[#F3EAE7] rounded-lg shadow-md">
        <Table className="border-none">
          <TableHeader className="min-w-10">
            <TableRow>
              <TableHead className="py-3 font-semibold rounded-s-lg">Booking ID</TableHead>
              <TableHead className="py-3 font-semibold text-nowrap">Booking Date</TableHead>
              <TableHead className="py-3 font-semibold text-nowrap">Username</TableHead>
              <TableHead className="py-3 font-semibold text-nowrap">Phone Number</TableHead>
              <TableHead className="py-3 font-semibold text-nowrap">Email ID</TableHead>
              <TableHead className="py-3 font-semibold text-nowrap">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.map((order, index) => {
              const bgColor = index % 2 === 0 ? "bg-white" : "bg-[#F3EAE7]";
              return (
                <TableRow key={index} className="my-1 shadow-sm border-none overflow-hidden rounded-xl bg-transparent">
                  <TableCell className={`px-3 py-1 rounded-s-xl ${bgColor}`}>
                    {order?.id || "N/A"}
                  </TableCell>
                  <TableCell className={`px-1 py-1 ${bgColor}`}>
                    {order?.createdAt && order?.createdAt.seconds ? (
                      (() => {
                        const timestampSeconds = order?.createdAt.seconds;
                        const timestampNanoseconds = order?.createdAt.nanoseconds || 0;
                        const totalMilliseconds =
                          timestampSeconds * 1000 + timestampNanoseconds / 1000000;
                        const date = new Date(totalMilliseconds);
                        return new Intl.DateTimeFormat('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit'
                        }).format(date);
                      })()
                    ) : (
                      new Intl.DateTimeFormat('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit'
                      }).format(new Date(order?.createdAt)) || "N/A"
                    )}
                  </TableCell>
                  <TableCell className={`px-1 py-1 ${bgColor}`}>
                    {order?.contactInfo?.fullName || "N/A"}
                  </TableCell>
                  <TableCell className={`px-1 py-1 ${bgColor}`}>
                    {order?.contactInfo?.phoneNumber || "N/A"}
                  </TableCell>
                  <TableCell className={`px-1 py-1 ${bgColor}`}>
                    {order?.contactInfo?.email || "N/A"}
                  </TableCell>
                  <TableCell className={`px-3 py-2 items-center gap-2 ${bgColor}`}>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-5 px-3 border rounded-xl border-[#4D413E] bg-transparent"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Assign
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        className="bg-white sm:!px-6 !px-4 py-6 max-w-lg w-full max-h-[60vh] table-scrollbar overflow-y-auto"
                      >
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold mb-2 text-[#4D413E]">Assign Service Provider</DialogTitle>
                        </DialogHeader>
                        {loading ? (
                          <div className="flex justify-center items-center py-4">
                            <span className="text-gray-500">Loading...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col space-y-2">
                            {serviceProviders.length > 0 ? (
                              serviceProviders.map((provider, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center p-2 border rounded-md shadow-sm"
                                >
                                  <div className="flex justify-between items-center gap-10">
                                    <Image src={provider.documents.photo} height={300} width={300} className="w-16 h-16 rounded-full" />
                                    <div className="flex flex-col justify-start">
                                      <p className="text-md font-medium text-[#4D413E]">{provider.personalDetails?.name || "N/A"}</p>
                                      <p className="text-xs font-normal text-[#4D413E]">{provider.id}</p>
                                    </div>
                                  </div>
                                  <DialogClose asChild>
                                    <Button
                                      className="bg-yellow-400"
                                      onClick={() => handleAssignProvider(provider)}
                                    >
                                      Assign
                                    </Button>
                                  </DialogClose>
                                </div>
                              ))
                            ) : (
                              <div className="text-center text-gray-500">No service providers available</div>
                            )}
                          </div>
                        )}
                        {/* <div className="flex justify-end mt-4">
                      <DialogClose asChild>
                        <Button className="bg-gray-300">Close</Button>
                      </DialogClose>
                    </div> */}
                      </DialogContent>
                    </Dialog>


                  </TableCell>

                  <TableCell className={`px-3 py-2 rounded-e-xl items-center gap-2 ${bgColor}`}>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="p-0 py-0 bg-transparent border-none text-xl shadow-none"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <MdOutlineRemoveRedEye />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white sm:!px-6 !px-2 py-6">
                        <DialogHeader>
                          <DialogTitle className="text-2xl text-[#4D413E] mb-4">Item Details</DialogTitle>
                          <DialogDescription>
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[99]">
                              <div className="bg-white rounded-lg p-6 w-full shadow-lg max-w-[40rem]">
                                <h2 className="text-2xl font-bold mb-2 text-[#4D413E]">Details</h2>
                                <div className="grid grid-cols-2 gap-4">
                                  {/* User Details */}
                                  <div text-xs>
                                    <h3 className="font-medium mb-3 text-md text-[#4D413E]">User Details</h3>
                                    <label className="block text-xs font-medium mb-1">Address</label>
                                    <Input
                                      placeholder="Address"
                                      value={order.contactInfo.address || ""}
                                      readOnly
                                      className="mb-2 !py-0 !h-9 text-xs"
                                    />
                                    <label className="block text-xs font-medium mb-1">Email</label>
                                    <Input
                                      placeholder="Email"
                                      value={order.contactInfo.email || ""}
                                      readOnly
                                      className="mb-2 !py-0 !h-9 text-xs"
                                    />
                                    <label className="block text-xs font-medium mb-1">Phone Number</label>
                                    <Input
                                      placeholder="Phone Number"
                                      value={order.contactInfo.phoneNumber || ""}
                                      readOnly
                                      className="mb-2 !py-0 !h-9 text-xs"
                                    />
                                    <h3 className="font-medium mt-6 mb-4 text-md text-[#4D413E]">Service Provider Details</h3>
                                    <label className="block text-xs font-medium mb-1">Name</label>
                                    <Input
                                      placeholder="Name"
                                      value={order.vendorName || ""}
                                      readOnly
                                      className="mb-2 !py-0 !h-9 text-xs"
                                    />
                                    <label className="block text-xs font-medium mb-1">Email</label>
                                    <Input
                                      placeholder="Email"
                                      value={order.vendorEmail || ""}
                                      readOnly
                                      className="mb-2 !py-0 !h-9 text-xs"
                                    />
                                    <label className="block text-xs font-medium mb-1">Phone Number</label>
                                    <Input
                                      placeholder="Phone Number"
                                      value={order.vendorPhoneNumber || ""}
                                      readOnly
                                      className="mb-2 !py-0 !h-9 text-xs"
                                    />
                                  </div>
                                  {/* Booking Details */}
                                  <div text-xs>
                                    <h3 className="font-medium mb-3 text-md text-[#4D413E]">Booking Details</h3>
                                    <label className="block text-xs font-medium mb-1">Booking Id</label>
                                    <Input
                                      placeholder="Booking Id"
                                      value={order.bookingID || ""}
                                      readOnly
                                      className="mb-2 !py-0 !h-9 text-xs"
                                    />
                                    <label className="block text-xs font-medium mb-1">Booking Date</label>
                                    <Input
                                      placeholder="Booking Date"
                                      value={order.calendarAndSlot.date || ""}
                                      readOnly
                                      className="mb-2 !py-0 !h-9 text-xs"
                                    />
                                    <label className="block text-xs font-medium mb-1">Total Duration</label>
                                    <Input
                                      placeholder="Total Duration"
                                      value={order.calendarAndSlot.duration || ""}
                                      readOnly
                                      className="mb-2 !py-0 !h-9 text-xs"
                                    />
                                    <label className="block text-xs font-medium mb-1">Start Time</label>
                                    <Input
                                      placeholder="Start Time"
                                      value={order.calendarAndSlot.timeSlot?.split(" - ")[0] || ""}
                                      readOnly
                                      className="mb-2 !py-0 !h-9 text-xs"
                                    />
                                    <label className="block text-xs font-medium mb-1">End Time</label>
                                    <Input
                                      placeholder="End Time"
                                      value={order.calendarAndSlot.timeSlot?.split(" - ")[1] || ""}
                                      readOnly
                                      className="mb-2 !py-0 !h-9 text-xs"
                                    />
                                    <label className="block text-xs font-medium mb-1">Price per hour</label>
                                    <Input
                                      placeholder="Price Per Hour"
                                      value={order?.pricePerHour ?? "N/A"}
                                      readOnly
                                      className="mb-2 !py-0 !h-9 text-xs"
                                    />
                                  </div>
                                </div>

                                {/* Close Button */}
                                {/* <div className="flex justify-end mt-4">
                              <Button onClick={onClose} className="bg-yellow-400">Close</Button>
                            </div> */}
                              </div>
                            </div>

                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </TableCell>

                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* <ServiceProviderModal
        isOpen={isServiceProviderModalOpen}
        onClose={closeServiceProviderModal}
        onAssign={handleAssignProvider}
      /> */}

      <div className="flex justify-end mt-4">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
        <div className="flex justify-end mt-4">
          <PaginationPrevious onClick={(e) => { e.preventDefault(); handlePreviousPage(); }} />
          <PaginationLink onClick={(e) => { e.preventDefault(); handlePageClick(currentPage); }}>{currentPage}</PaginationLink>
          <PaginationNext onClick={(e) => { e.preventDefault(); handleNextPage(); }} />
        </div>
      </div>
    </div>
  );
}

export default OrdersPage

// function ServiceProviderModal({ isOpen, onClose, onAssign }) {
//   return (
//     isOpen && (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[99]">
//         <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
//           <h2 className="text-xl font-bold mb-4">Assign Service Provider</h2>
//           <div className="flex flex-col space-y-2">
//             {["ka Bhardwaj", "John Doe", "Jane Smith"].map((provider, index) => (
//               <div key={index} className="flex justify-between items-center p-2 border rounded-md shadow-sm">
//                 <span>{provider}</span>
//                 <Button
//                   className="bg-yellow-400"
//                   onClick={() => {
//                     onAssign(provider);
//                     onClose();
//                   }}
//                 >
//                   Assign
//                 </Button>
//               </div>
//             ))}
//           </div>
//           <div className="flex justify-end mt-4">
//             <Button onClick={onClose} className="bg-gray-300">Close</Button>
//           </div>
//         </div>
//       </div>
//     )
//   );
// }
