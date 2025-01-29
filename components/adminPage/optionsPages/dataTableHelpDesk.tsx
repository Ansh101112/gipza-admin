"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowLeftIcon,
  ArrowRight,
  ArrowUpDown,
  ChevronLeftIcon,
  ChevronRightIcon,
  X,
} from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  closeQuery,
  getQueryFromIdFromFireStore,
  getVendorFromVendorUIdFromFireStore,
  resolveQuery,
  updateQueriesFromFirestore,
} from "@/lib/firebaseFunc";
import { Textarea } from "@/components/ui/textarea";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import load from "../../../public/public/load.png";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export type Object = {
  queryId: React.ReactNode;
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  vendorId: string;
};

export function DataTable({
  getQueries,
  finalData,
  option,
  section,
  setSection,
  setIsChanged,
  searchQuery,
  sortOrder,
}: any) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState(finalData);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [alert, setAlert] = React.useState(false);
  const [vendorName, setVendorName] = React.useState<string>("");
  const [vendorBuisness, setVendorBuisness] = React.useState("");
  const [selectedQueries, setSelectedQueries] = React.useState<any[]>([]);
  const [selectedQuery, setSelectedQuery] = React.useState<string>("");
  const [viewModal, setViewModal] = React.useState(false);
  const [sendModal, setSendModal] = React.useState(false);
  const [resolveMsg, setResolveMsg] = React.useState<string>("");
  const [closeMsg, setCloseMsg] = React.useState<string>("");
  const [item, setItem] = React.useState<any>();
  const [status, setStatus] = React.useState<any>("active");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Filter and sort data
  const processedData = useMemo(() => {
    let filteredData = [...finalData];

    // Search by title
    if (searchQuery) {
      filteredData = filteredData.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by date
    filteredData.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return filteredData;
  }, [finalData, searchQuery, sortOrder]);

  // Create paginated data
  const paginatedData = useMemo(() => {
    const calculatedTotalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE) || 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return {
      queries: processedData.slice(startIndex, endIndex),
      totalPages: calculatedTotalPages,
    };
  }, [processedData, currentPage]);

  // Reset to first page when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOrder]);

  const handleNextPage = () => {
    if (currentPage < paginatedData.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const getSellerDetails = async (id: string) => {
    const vendor = await getVendorFromVendorUIdFromFireStore(id);
    if (vendor) {
      setVendorName(vendor.ownerName);
      setVendorBuisness(vendor.buissnessName);
    } else {
      console.log("no seller found of these id");
    }
  };

  const columns: ColumnDef<Object>[] = [
    {
      accessorKey: "queryId",
      header: () => <div className="text-left">Query ID</div>,
      cell: ({ row }) => <div className="text-left">{row.original.queryId}</div>,
      size: 250,
    },
    {
      accessorKey: "title",
      header: () => <div className="text-left">Title</div>,
      cell: ({ row }) => <div className="text-left">{row.original.title}</div>,
      size: 350,
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-left">Created At</div>,
      cell: ({ row }) => (
        <div className="text-left">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </div>
      ),
      size: 250,
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        return (
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              size="sm"
              className="text-5 px-3 border rounded-xl border-[#4D413E] bg-transparent text-[#6e554a]"
              onClick={() => handleViewClick(row.original.id)}
            >
              View
            </Button>
            {section === "active" && (
              <Button
                variant="outline"
                size="sm"
                className="text-5 px-3 border rounded-xl border-[#4D413E] bg-transparent text-[#6e554a]"
                onClick={() => handleSendClick(row.original.id)}
              >
                Resolve
              </Button>
            )}
          </div>
        );
      },
      size: 250,
    },
  ];

  // Initialize table with paginated data
  const table = useReactTable({
    data: paginatedData.queries,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  React.useEffect(() => {
    table.setPageSize(5);
    setData(finalData);
    //@ts-ignore
    table.setRowSelection(false);
  }, [finalData]);

  const handleSendClick = async (queryId: string) => {
    try {
      const query = await getQueryFromIdFromFireStore(queryId);
      setSendModal(true);
      console.log(query);
      if (query) {
        setItem(query);
        setSelectedQuery(queryId);
        setSelectedQueries([queryId]);
        await getSellerDetails(query?.vendorUId);
      }
    } catch (error) {
      console.log("Error getting details for viewing a query");
    }
  };

  const handleViewClick = async (queryId: string) => {
    try {
      const query = await getQueryFromIdFromFireStore(queryId);
      setViewModal(true);
      console.log(query);
      if (query) {
        setItem(query);
        setSelectedQueries([queryId]);
        await getSellerDetails(query?.vendorUId);
      }
    } catch (error) {
      console.log("Error getting details for viewing a query");
    }
  };

  const handleResolve = async () => {
    try {
      if (!resolveMsg || resolveMsg.trim() === "") {
        toast.error("Please enter a resolution message");
        return;
      }

      const queryId = item.queryId || item.id;
      
      await resolveQuery(queryId, resolveMsg);
      toast.success("Query resolved successfully!");
      setSendModal(false);
      setResolveMsg("");
      setIsChanged(true);
      getQueries();
    } catch (error) {
      console.error("Error resolving query:", error);
      toast.error("Failed to resolve query");
    }
  };

  const handleClose = async () => {
    try {
      setSendModal(false);
      await closeQuery(selectedQuery, closeMsg);
      console.log("Query closed successfully");
      setSection("active");
    } catch (error) {
      console.error("Error closing query:", error);
    }
  };

  return (
    <>
      {viewModal && (
        <div
          className="fixed inset-0 z-[99] overflow-y-auto flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="bg-white p-8 rounded-xl shadow-xl w-2/4 max-h-4/5 overflow-y-auto"
            style={{ maxHeight: "80vh" }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-[#4D413E]">Query Details</h2>
              <button
                onClick={() => {
                  setViewModal(false);
                  setSelectedQueries([]);
                }}
                className="focus:outline-none text-[#4D413E]"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col">
                <Label className="text-[#6e554a] mb-2">Vendor ID</Label>
                <Input
                  readOnly
                  value={item.vendorUId}
                  className="rounded-xl border-[#4D413E]"
                />
              </div>
              <div className="flex flex-col">
                <Label className="text-[#6e554a] mb-2">Query Title</Label>
                <Input 
                  readOnly 
                  value={item.title} 
                  className="rounded-xl border-[#4D413E]" 
                />
              </div>
              <div className="flex flex-col">
                <Label className="text-[#6e554a] mb-2">Query Description</Label>
                <Textarea
                  readOnly
                  value={item.description}
                  className="rounded-xl border-[#4D413E] min-h-[100px]"
                />
              </div>

              {section !== "active" && (
                <div className="flex flex-col">
                  <Label className="text-[#6e554a] mb-2">Resolution Message</Label>
                  <Textarea
                    readOnly
                    value={item.resolveMsg}
                    className="rounded-xl border-[#4D413E]"
                  />
                </div>
              )}

              {(section === "reopened" || (section === "closed" && item.reopenMsg)) && (
                <div className="flex flex-col">
                  <Label className="text-[#6e554a] mb-2">Re-Open Message</Label>
                  <Textarea
                    readOnly
                    value={item.reopenMsg}
                    className="rounded-xl border-[#4D413E]"
                  />
                </div>
              )}

              {section === "closed" && (
                <div className="flex flex-col">
                  <Label className="text-[#6e554a] mb-2">Close Message</Label>
                  <Textarea
                    readOnly
                    value={item.closeMsg}
                    className="rounded-xl border-[#4D413E]"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <Button
                variant="outline"
                onClick={() => setViewModal(false)}
                className="text-[#4D413E] border-[#4D413E] hover:bg-[#4D413E] hover:text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {sendModal && (
        <div
          className="fixed inset-0 z-[99] overflow-y-auto flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="bg-white p-8 rounded-xl shadow-xl w-2/4 max-h-4/5 overflow-y-auto"
            style={{ maxHeight: "80vh" }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-[#4D413E]">
                {section === "active" ? "Resolve Query" : "Close Query"}
              </h2>
              <button
                onClick={() => {
                  setSendModal(false);
                  setSelectedQueries([]);
                }}
                className="focus:outline-none text-[#4D413E]"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col">
                <Label className="text-[#6e554a] mb-2">Subject</Label>
                <div className="rounded-xl border border-[#4D413E] p-4 text-[#6e554a]">
                  {item.queryId}: {section === "active" ? "Issue Resolved" : "Issue Closed"}
                </div>
              </div>

              {section === "active" ? (
                <div className="flex flex-col">
                  <Label className="text-[#6e554a] mb-2">Resolution Message</Label>
                  <Textarea
                    value={resolveMsg}
                    onChange={(e) => setResolveMsg(e.target.value)}
                    className="rounded-xl border-[#4D413E] min-h-[100px]"
                    placeholder="Enter your resolution message..."
                  />
                </div>
              ) : (
                <div className="flex flex-col">
                  <Label className="text-[#6e554a] mb-2">Close Message</Label>
                  <Textarea
                    value={closeMsg}
                    onChange={(e) => setCloseMsg(e.target.value)}
                    className="rounded-xl border-[#4D413E] min-h-[100px]"
                    placeholder="Enter your closing message..."
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setSendModal(false)}
                className="text-[#4D413E] border-[#4D413E] hover:bg-[#4D413E] hover:text-white"
              >
                Cancel
              </Button>
              {section === "active" ? (
                <Button
                  onClick={handleResolve}
                  className="bg-[#4D413E] text-white hover:bg-[#3d332f]"
                >
                  Resolve Query
                </Button>
              ) : (
                <Button
                  onClick={handleClose}
                  className="bg-[#4D413E] text-white hover:bg-[#3d332f]"
                >
                  Close Query
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#F3EAE7] rounded-lg min-h-[580px]">
        <Table className="border-none">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="h-12 px-6 bg-[#F3EAE7] text-[#9c786c] py-1 font-semibold text-nowrap rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                className="rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg "
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                      className="px-6 py-2 align-middle text-[#6e554a] text-sm font-medium "
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center bg-[#F3EAE7]"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {processedData.length > 0 && (
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
    </>
  );
}
