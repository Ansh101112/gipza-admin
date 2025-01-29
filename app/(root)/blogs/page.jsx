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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState, useMemo } from "react";
import { MdRefresh } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import dynamic from "next/dynamic";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [detailsViewActive, setDetailsViewActive] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const ordersPerPage = 10;
  const [search, setSearch] = useState("title");
  const [columnFilters, setColumnFilters] = useState([]);

  const fetchVendors = async () => {
    try {
      const response = await fetch("/api/blogs/getAllBlogs");
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }
      const data = await response.json();
      setOrders(data.data); 
      console.log(data.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleRefresh = () => {
    setSearchQuery("");
    setCurrentPage(1);
    setLoading(true);
    fetchVendors();
  };

  const handleBlogEdit = (blog) => {
    setSelectedBlog(blog);
    setDetailsViewActive(true);
  };

  const BlogEditor = dynamic(() => import("../../../components/BlogEditorForm"), { ssr: false });

  const { currentOrders, totalPages } = useMemo(() => {
    let filteredOrders = [...orders];

    // Apply search filter using columnFilters
    if (columnFilters[0]?.value) {
      filteredOrders = filteredOrders.filter((order) => {
        const searchField = order[search]?.toLowerCase() || '';
        return searchField.includes(columnFilters[0].value.toLowerCase());
      });
    }

    // Apply sort
    if (sortOrder === 'desc') {
      filteredOrders = filteredOrders.sort((a, b) => {
        if (a[search] < b[search]) return 1;
        if (a[search] > b[search]) return -1;
        return 0;
      });
    } else {
      filteredOrders = filteredOrders.sort((a, b) => {
        if (a[search] < b[search]) return -1;
        if (a[search] > b[search]) return 1;
        return 0;
      });
    }

    // Calculate pagination
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);

    return { currentOrders, totalPages };
  }, [orders, columnFilters, search, currentPage, sortOrder, ordersPerPage]);

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

  return (
    <>
      {detailsViewActive ? (
        <BlogEditor
          selectedBlog={selectedBlog}
          handleBackToList={() => {setDetailsViewActive(false), setSelectedBlog(null);}}
        />
      ) : (
        <div className="lg:px-6 md:px-4 lg:py-6 py-2 px-0">
          <div className="flex flex-wrap justify-between mb-3">
            <h1 className="text-4xl font-bold sm:mb-6 mb-2 text-[#4D413E]">Blogs</h1>

            <div className="flex justify-between items-center mb-6 mt-5">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setDetailsViewActive(true)}
                  className="px-3 py-2.5 rounded-md text-sm bg-[#695d56] text-white hover:bg-[#4D413E] transition-colors"
                >
                  Add New Blog
                </Button>

                <Input
                  placeholder={`Search by ${search}...`}
                  value={columnFilters[0]?.value || ""}
                  onChange={(event) => setColumnFilters([{ id: search, value: event.target.value }])}
                  className="max-w-sm"
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                      Sort <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem
                      checked={sortOrder === 'asc'}
                      onCheckedChange={() => setSortOrder('asc')}
                    >
                      Ascending
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortOrder === 'desc'}
                      onCheckedChange={() => setSortOrder('desc')}
                    >
                      Descending
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>

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

          <div className="bg-[#F3EAE7] rounded-lg min-h-[580px]">
            <Table className="border-none">
              <TableHeader className="min-w-10 rounded-tl-lg rounded-tr-lg">
                <TableRow className="rounded-t-lg">
                  <TableHead className="h-12 px-4 bg-[#F3EAE7] text-[#9c786c] py-1 font-semibold text-nowrap rounded-tl-lg">Title</TableHead>
                  <TableHead className="h-12 px-4 bg-[#F3EAE7] text-[#9c786c] py-1 font-semibold text-nowrap">Description</TableHead>
                  <TableHead className="h-12 px-4 bg-[#F3EAE7] text-[#9c786c] py-1 font-semibold text-nowrap">Category</TableHead>
                  <TableHead className="h-12 px-4 bg-[#F3EAE7] text-[#9c786c] py-1 font-semibold text-nowrap">Tags</TableHead>
                  <TableHead className="h-12 px-4 bg-[#F3EAE7] text-[#9c786c] py-1 font-semibold text-nowrap rounded-tr-lg">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <TableRow 
                      key={order.id}
                      onClick={() => handleBlogEdit(order)}
                      className="cursor-pointer "
                    >
                      <TableCell className="align-center text-[#6e554a] text-sm font-medium h-2 px-2">
                        {order?.title}
                      </TableCell>
                      <TableCell className="align-center text-[#6e554a] text-sm font-medium h-2 px-2">
                        {order?.description}
                      </TableCell>
                      <TableCell className="align-center text-[#6e554a] text-sm font-medium h-2 px-2">
                        {order?.category}
                      </TableCell>
                      <TableCell className="align-center text-[#6e554a] text-sm font-medium h-2 px-2">
                        {order.tags.length > 0 ? `${order.tags.slice(0, 3).join(', ')}` : 'No Tags'}
                      </TableCell>
                      <TableCell className="align-center text-[#6e554a] text-sm font-medium h-2 px-2">
                        {new Date(order?.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-[#6e554a]">
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {currentOrders.length > 0 && (
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
        </div>
      )}
    </>
  );
}
