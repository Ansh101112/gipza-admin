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
  const [loading, setLoading] = useState(false);
  const ordersPerPage = 10;

  useEffect(()=>{
    if(currentUser){
      fetchOrders(currentUser.id);
    }
  },[currentUser])

  const tabs = [
    "Initiated",
    "Captured",
    "Manifested",
    "Ready for Pickup",
    "Pickup Raised",
    "Cancelled",
    "In Transit",
    "Out for Delivery",
    "Delivered",
    "Returned",
    "Rejected",
  ];

  const statusMapping = {
    "Initiated": "initiated",
    "Captured": "captured",
    "Manifested": "manifested",
    "Ready for Pickup": "readyForPickup",
    "Pickup Raised": "pickupRaised",
    "Cancelled": "cancelled",
    "In Transit": "inTransit",
    "Out for Delivery": "outForDelivery",
    "Delivered": "delivered",
    "Returned": "returned",
    "Rejected": "rejected",
  };

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/getAllOrders`);
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
        order?.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order?.orderId && order?.orderId.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (order?.shippingDetails && order?.shippingDetails?.address?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    
    if (sortOption === "Ascending") {
      filtered = filtered.sort((a, b) =>
        a.createdAt && b.createdAt
          ? new Date(a.createdAt.seconds * 1000).toISOString().localeCompare(
              new Date(b.createdAt.seconds * 1000).toISOString()
            )
          : 0
      );
    } else if (sortOption === "Descending") {
      filtered = filtered.sort((a, b) =>
        b.createdAt && a.createdAt
          ? new Date(b.createdAt.seconds * 1000).toISOString().localeCompare(
              new Date(a.createdAt.seconds * 1000).toISOString()
            )
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

  const handleChangeStatus = async (newStatus) => {
    if (!selectedOrder) return;
    try {
      const response = await fetch("/api/orders/updateOrder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: selectedOrder.orderId, updateData: { status: newStatus } }),
      });
      if (response.ok) {
        setAllOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === selectedOrder.orderId ? { ...order, status: newStatus } : order
          )
        );
        setModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleConfirmStatusChange = () => {
    handleChangeStatus(selectedStatus);
    setModalOpen(false);
  };

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
    setSearchQuery("");
    setCurrentPage(1);
    setSelectedTab("Initiated")
    setFilterOption("All")
    fetchOrders();
  };

  return (
    <div className="sm:px-6 py-6 px-2">
      <div className="flex flex-wrap justify-between mb-3">
        <h1 className="text-4xl font-bold sm:mb-6 mb-2 text-[#4D413E]">Orders</h1>

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

      {/* Status Tabs */}
      <div
        className="flex md:flex-wrap flex-nowrap sm:mb-6 mb-2 table-scrollbar overflow-x-auto"
        // style={{ maxWidth: "calc(100vw - 20rem)" }}
      >
        {tabs.map((tab) => (
          <Button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 mb-5 me-4 py-2 ${
              selectedTab === tab ? "bg-[#695d56] text-white" : "text-[#695d56]"
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
            <TableHead className="py-3 font-semibold rounded-s-lg">Product Title</TableHead>
            <TableHead className="py-3 font-semibold text-nowrap">Category</TableHead>
            <TableHead className="py-3 font-semibold text-nowrap">Quantity</TableHead>
            <TableHead className="py-3 font-semibold text-nowrap">Selling Price</TableHead>
            <TableHead className="py-3 font-semibold text-nowrap">Status</TableHead>
            <TableHead className="py-3 font-semibold text-nowrap">Total Amount</TableHead>
            <TableHead className="py-3 font-semibold text-nowrap">Order Date</TableHead>
            <TableHead className="py-3 font-semibold rounded-e-lg">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentOrders.map((order, index) => {
            const bgColor = index % 2 === 0 ? "bg-white" : "bg-[#F3EAE7]";
            return (
            <TableRow key={index} className="my-1 shadow-sm border-none overflow-hidden rounded-xl bg-transparent">
              <TableCell className={`px-3 py-1 rounded-s-xl ${bgColor}`}>
                {order?.items[0]?.title || "N/A"}
              </TableCell>
              <TableCell className={`px-1 py-1 ${bgColor}`}>
                {order?.items[0]?.category || "N/A"}
              </TableCell>
              <TableCell className={`px-1 py-1 ${bgColor}`}>
                {order?.items[0]?.quantity || "N/A"}
              </TableCell>
              <TableCell className={`px-1 py-1 ${bgColor}`}>
                {order?.items[0]?.sellingPrice || "N/A"}
              </TableCell>
              <TableCell className={`px-1 py-1 ${bgColor}`}>
                {order?.status || "N/A"}
              </TableCell>
              <TableCell className={`px-1 py-1 ${bgColor}`}>
                {order?.totalAmount || "N/A"}
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
              {/* <TableCell className={`px-1 py-1 ${bgColor}`}>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedOrder(order);
                      setModalOpen(true);
                    }}
                  >
                    Change Status
                  </Button>
              </TableCell> */}
              <TableCell className={`px-3 py-2 rounded-e-xl items-center gap-2 ${bgColor}`}>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedOrder(order)}
                      className="p-0 py-0 bg-transparent border-none text-xl shadow-none"
                    >
                      <MdOutlineRemoveRedEye />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white sm:!px-6 !px-2 py-6">
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-[#4D413E] mb-4">Item Details</DialogTitle>
                      <DialogDescription>
                        <table className="w-full shadow-md rounded-xl ">
                          <thead>
                            <tr className="bg-white">
                              <th className="sm:px-4 px-1 py-2 font-medium text-[#4D413E]">Image</th>
                              <th className="sm:px-4 px-1 py-2 font-medium text-[#4D413E]">Price</th>
                              <th className="sm:px-4 px-1 py-2 font-medium text-[#4D413E]">Title</th>
                              <th className="sm:px-4 px-1 py-2 font-medium text-[#4D413E]">Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrder?.items.map((item, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="sm:px-4 px-1 py-2">
                                  <img
                                    src={item?.images[0]}
                                    alt={item?.title}
                                    className="w-16 h-16 object-cover"
                                  />
                                </td>
                                <td className="sm:px-4 px-1 py-2">Rs. {item?.sellingPrice || "N/A"}</td>
                                <td className="sm:px-4 px-1 py-2">{item?.title || "N/A"}</td>
                                <td className="sm:px-4 px-1 py-2">{item?.quantity || "N/A"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </TableCell>

            </TableRow>
            )})}
        </TableBody>
      </Table>
      </div>

      {/* Pagination */}
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

      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Change Order Status</DialogTitle>
            <DialogDescription>
              Select a new status for order #{selectedOrder?.orderId}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <select
              className="border border-gray-300 rounded px-4 py-2 w-full"
              onChange={(e) => setSelectedStatus(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Select status
              </option>
              {Object.keys(statusMapping).map((status) => (
                <option key={status} value={statusMapping[status]}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmStatusChange}
              disabled={!selectedStatus}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
}

export default OrdersPage