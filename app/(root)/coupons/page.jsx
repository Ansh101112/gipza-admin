"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/users/uiTwo/table";
import { Pagination, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { FiChevronDown } from "react-icons/fi";
import { useAuth } from "@/hooks/auth-context";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { IoMdRefresh } from "react-icons/io";
import dynamic from "next/dynamic";
import { serverTimestamp } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { MdRefresh } from "react-icons/md";

const CouponsPage = () => {

  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialogue, setOpenDialogue] = useState(false);
  const [couponTitle, setCouponTitle] = useState("");
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [discount, setDiscount] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const [sortOrder, setSortOrder] = useState("desc");

  const tabs = ["Active", "Inactive"];
  const couponsPerPage = 10;

  const getDateInMillis = (dateValue) => {
    if (dateValue?.seconds && dateValue?.nanoseconds) {
      return dateValue.seconds * 1000 + dateValue.nanoseconds / 1000000;
    }
    if (typeof dateValue === "string") {
      return new Date(dateValue).getTime();
    }
    return 0;
  };

  const paginatedData = useMemo(() => {
    let filtered = coupons.filter(coupon =>
      coupon.status === activeTab.toLowerCase()
    );

    if (searchQuery.trim()) {
      filtered = filtered.filter(coupon =>
        coupon.couponTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const dateA = getDateInMillis(a.createdAt);
      const dateB = getDateInMillis(b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    const calculatedTotalPages = Math.ceil(filtered.length / couponsPerPage) || 1;
    const startIndex = (currentPage - 1) * couponsPerPage;
    const endIndex = startIndex + couponsPerPage;

    return {
      coupons: filtered.slice(startIndex, endIndex),
      totalPages: calculatedTotalPages
    };
  }, [coupons, activeTab, searchQuery, currentPage, sortOrder]);

  useEffect(() => {
    setFilteredCoupons(paginatedData.coupons);
  }, [paginatedData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, sortOrder]);

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

  const fetchCoupons = async () => {
    if (!currentUser?.userID) return;

    try {
      setRefresh(true);

      const response = await fetch('/api/coupon/getCoupons');
      const result = await response.json();

      if (response.ok) {
        setCoupons(result.coupons);
        setFilteredCoupons(result.coupons.filter(coupon =>
          coupon.status === activeTab.toLowerCase()
        ));
      } else {
        console.error("Error response:", result.error);
        toast.error(result.error || "Failed to fetch coupons");
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error("Failed to fetch coupons");
    } finally {
      setRefresh(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [currentUser]);

  // useEffect(() => {
  //   setFilteredCoupons(coupons.filter(coupon => coupon.status === activeTab));
  // }, [activeTab, coupons]);

  const handleToggleDisable = async (couponID, status) => {
    try {
      setLoading(true);

      // Create IST timestamp for update
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000; // UTC+5:30 in milliseconds
      const istTime = new Date(now.getTime() + istOffset);

      const response = await fetch('/api/coupon/updateCoupon', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponID,
          updatedFields: {
            status: status === "active" ? "inactive" : "active",
            updatedAt: istTime
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCoupons(prevCoupons =>
          prevCoupons.map(coupon =>
            coupon.id === couponID
              ? {
                ...coupon,
                status: status === "active" ? "inactive" : "active",
                updatedAt: istTime
              }
              : coupon
          )
        );

        setFilteredCoupons(prevFiltered =>
          prevFiltered.map(coupon =>
            coupon.id === couponID
              ? {
                ...coupon,
                status: status === "active" ? "inactive" : "active",
                updatedAt: istTime
              }
              : coupon
          )
        );

        toast.success('Coupon status updated');
      } else {
        console.error(data.error);
        toast.error('Failed to update coupon status');
      }
    } catch (error) {
      console.error('Failed to update coupon:', error);
      toast.error('Failed to update coupon status');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = async () => {
    if (!currentUser?.userID) {
      // console.log("Current User:", currentUser);
      toast.error("User not authenticated");
      return;
    }

    if (!couponTitle || !discount || !minPrice) {
      toast.error("All fields are required");
      return;
    }

    if (!/^[a-zA-Z]{4}\d{2}$/.test(couponTitle)) {
      setError("Coupon name must have 4 letters and 2 digits.");
      return;
    }

    if (isNaN(discount) || isNaN(minPrice)) {
      toast.error("Discount and Minimum Price must be numbers");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Create current timestamp for IST (UTC+5:30)
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000; // UTC+5:30 in milliseconds
      const istTime = new Date(now.getTime() + istOffset);

      const newCoupon = {
        couponTitle: couponTitle.toUpperCase(),
        discount: Number(discount),
        minPrice: Number(minPrice),
        userID: currentUser.userID,
        role: currentUser.role,
        status: "active",
        timesUsed: 0,
        createdAt: istTime,
        updatedAt: istTime
      };

      const response = await fetch('/api/coupon/addCoupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoupon),
      });

      const data = await response.json();

      if (response.ok) {
        const newCouponWithId = {
          ...newCoupon,
          id: data.data.id,
        };

        setCoupons((prevCoupons) => [newCouponWithId, ...prevCoupons]);
        setFilteredCoupons((prevFiltered) => [newCouponWithId, ...prevFiltered]);

        setCouponTitle("");
        setDiscount("");
        setMinPrice("");
        toast.success("Coupon added successfully!")
        setOpenDialogue(false);
      } else {
        toast.error(data.error || "Failed to add coupon");
      }
    } catch (error) {
      console.error("Error adding coupon:", error);
      toast.error("Error adding coupon: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // For displaying dates in the table
  const formatDate = (date) => {
    if (!date) return "Invalid Date";

    try {
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
      const year = d.getFullYear();

      return `${day}/${month}/${year}`;
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Add error boundary for the table
  const renderTable = () => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="rounded-tl-lg">Coupon ID</TableHead>
            <TableHead>Coupon Name</TableHead>
            <TableHead>Percentage Discount</TableHead>
            <TableHead>Min. Price</TableHead>
            <TableHead>Times Used</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="rounded-tr-lg">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCoupons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4 bg-[#F3EAE7]">
                No coupons found
              </TableCell>
            </TableRow>
          ) : (
            filteredCoupons.map((coupon, index) => {
              const bgColor = index % 2 === 0 ? "bg-white" : "bg-[#F3EAE7]";
              return (
                <TableRow key={index} className="border">

                  <TableCell className="h-2 p-2">{coupon.id}</TableCell>
                  <TableCell className="h-2 p-2">{coupon.couponTitle}</TableCell>
                  <TableCell className="h-2 pl-10 ">{coupon.discount}</TableCell>
                  <TableCell className="h-2 p-2">{coupon.minPrice}</TableCell>
                  <TableCell className="h-2 pl-6 ">{coupon.timesUsed}</TableCell>
                  <TableCell className="h-2 p-2">
                    {formatDate(coupon.createdAt)}
                  </TableCell>
                  <TableCell className="h-2 p-2">
                    {formatDate(coupon.updatedAt)}
                  </TableCell>

                  <TableCell className="p-2">
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleDisable(coupon.id, coupon.status)}
                        className="text-5 px-3 border rounded-xl border-[#4D413E] bg-transparent"
                      >
                        {coupon.status === "active" ? "Disable" : "Active"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    );
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="lg:px-6 md:px-4 lg:py-4 py-2 px-0">
      <div className="flex flex-wrap justify-between mb-3">
        <h1 className="text-4xl font-bold sm:mb-6 mb-2 text-[#4D413E] mt-2">Coupons</h1>

        {/* Top Controls: Add, Sort, Filter, Search */}
        <div className="flex justify-between items-center mb-0 mt-5">
          {/* Add Coupon Dialog */}
          <Dialog onOpenChange={setOpenDialogue} open={openDialogue}>
            <DialogTrigger asChild>
              <Button className="rounded-md text-sm bg-[#695d56] text-white mr-3 hover:bg-[#4D413E] transition-colors ">
                Add Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
              <DialogHeader>
                <DialogTitle>Add a Coupon</DialogTitle>
                <DialogDescription>
                  Enter details for the new coupon.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-5 py-4">
                <div className="flex flex-col items-left gap-4">
                  <Label htmlFor="couponTitle">Coupon Name</Label>
                  <Input
                    id="couponTitle"
                    placeholder="Enter 4 letters and 2 digits"
                    value={couponTitle}
                    onChange={(e) => setCouponTitle(e.target.value)}
                    className="bg-zinc-100"
                  />
                  {error && <span className="text-red-500 text-xs">{error}</span>}
                </div>
                <div className="flex flex-col items-left gap-4">
                  <Label htmlFor="discount">Percentage Discount *</Label>
                  <Input
                    id="discount"
                    type="number"
                    required
                    placeholder="e.g., 20"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="bg-zinc-100"
                  />
                </div>
                <div className="flex flex-col items-left gap-4">
                  <Label htmlFor="minPrice">Minimum Price *</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    required
                    placeholder="e.g., 500"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="bg-zinc-100"
                  />
                </div>
              </div>
              <DialogFooter className="gap-2 flex flex-col">

                <Button
                  disabled={!couponTitle || !discount || !minPrice}
                  className="bg-baw-baw-g3 text-white hover:bg-[#4D413E] transition-colors"
                  onClick={handleAddCoupon}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Coupon"}
                </Button>
                <Button variant="outline" onClick={() => setOpenDialogue(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Sort Dropdown */}
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

          {/* Search Input */}
          <div className="flex items-center">
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

      {/* Tab buttons - Original styling */}
      <div className="flex md:flex-wrap flex-nowrap sm:mb-6 mb-2 table-scrollbar overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-4 mb-5 me-4 py-2 ${activeTab === tab.toLowerCase() ? "bg-[#695d56] text-white" : "text-[#695d56]"
              }`}
            variant={activeTab === tab.toLowerCase() ? "solid" : "outline"}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Table section - Original styling */}
      {loading ? (
        <div className="items-center justify-center flex py-2 h-[50vh] w-full rounded z-10">
          <ClipLoader
            color={"#4D413E"}
            loading={loading}
            size={24}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="bg-[#F3EAE7] min-h-[580px] rounded-lg shadow-md">
          {renderTable()}
        </div>
      )}

      {/* Pagination - Original styling */}
      {filteredCoupons.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-[#4D413E]">
            Page {currentPage} of {paginatedData.totalPages}
          </span>
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
    </div>
  );
};

export default CouponsPage
