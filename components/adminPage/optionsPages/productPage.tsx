"use client";

import * as React from "react";
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
import load from "../../../public/public/load.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeftIcon,
  ArrowRight,
  ArrowUpDown,
  CheckCircle,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontal,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/auth-context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  getProductsFromFireStore,
  updateProductsFromFirestore,
} from "@/lib/productFirebaseFunc";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import ImageViewer from "./imageViewer";
import Image from "next/image";

export type Product = {
  productUId: string;
  category: string;
  description: string;
  diamondColor: string;
  diamondPricePerGram: string;
  diamondWeight: string;
  dod: string;
  goldPricePerGram: string;
  goldPurity: string;
  grossWeight: string;
  gstPrice: string;
  images: [] | undefined;
  makingCharges: string;
  metalOption: string;
  netWeight: string;
  noOfDiamonds: string;
  productId: string;
  size: string;
  title: string;
  vendorId: string;
  finalPrice: string;
  internationalPrice: string;
  gender: [] | ["All"];
};

export function ProductPage() {
  const [selectedProduct, setSelectedProduct] = React.useState<any[]>([]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [section, setSection] = React.useState("active");
  const [data, setData] = React.useState<Product[]>([]);
  const [isEmpty, setIsEmpty] = React.useState<boolean>(false);
  const { currentUser } = useAuth();
  const [alert, setAlert] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [item, setItem] = React.useState<any>({});
  const [productId, setProductId] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("active");
  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
    table.getIsAllPageRowsSelected() 
      ? true 
      : table.getIsSomePageRowsSelected() 
      ? "indeterminate" 
      : false
  }

          //@ts-ignore
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            setTimeout(() => {
              if (value) {
                const dataF = table.getSelectedRowModel();
                dataF.rows.forEach((row) => {
                  //@ts-ignore
                  const idExist = selectedProduct.includes(row.original.id);
                  if (!idExist) {
                    //@ts-ignore
                    setSelectedProduct((curr) => [...curr, row.original.id]);
                    // selected.push(row.original.id);
                  }
                });
              } else {
                setSelectedProduct([]);
                // selected = [];
              }
            }, 0);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          //@ts-ignore
          onCheckedChange={(value) => {
            if (value) {
              //@ts-ignore
              setSelectedProduct((curr) => [...curr, row.original.id]);
              // selected.push(row.original.id);
            } else {
              let currProducts = selectedProduct;
              currProducts = selectedProduct.filter(
                //@ts-ignore
                (i) => i != row.original.id
              );
              setSelectedProduct(currProducts);
              // selected = selected.filter((i) => i != row.original.id);
            }

            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("category")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("description")}</div>
      ),
    },
    {
      accessorKey: "productId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product Id
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="uppecase">{row.getValue("productId")}</div>
      ),
    },
  ];

  const onCLick = (e: any) => {
    if (section != e.value && e.value == "approved") {
      setSection("approved");
    } else if (section != e.value && e.value == "active") {
      setSection("active");
    } else if (section != e.value && e.value == "disabled") {
      setSection("disabled");
    }
  };

  const getProducts = async () => {
    console.log(section);
    const products = await getProductsFromFireStore(section);
    products.map((vendor: any) => {
      vendor.createdAt = vendor.createdAt.toDate();
    });
    if (products.length === 0) {
      setIsEmpty(true);
    }
    const timeOut = setTimeout(() => {
      setData(products);
    }, 150);
    return () => {
      clearTimeout(timeOut);
    };
  };

  React.useEffect(() => {
    table.setPageSize(5);

    if (currentUser) {
      getProducts();
    }
    //@ts-ignore
    table.setRowSelection(false);
  }, [section, currentUser]);
  const table = useReactTable({
    data,
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
    if (modal) {
      data.map((item) => {
        if (productId === item.productId) {
          console.log(item);
          setItem(item);
          setSelectedProduct([item.productId]);
        }
      });
    }
  }, [modal, productId, data]);

  const handleViewClick = (productId: string) => {
    console.log(productId);
    setProductId(productId);
    setModal((prev) => !prev);
  };

  const handleChangeStatus = async (status: string) => {
    try {
      setStatus(status);
      console.log("hello");
      handleAlertClick(status);
      return true;
    } catch (error) {
      console.error("Error updating queries:", error);
    }
  };

  const handleAlertClick = async (status: string) => {
    console.log(status);
    setAlert(true);
    console.log(alert);
    return true;
  };

  const handleChange = async () => {
    const updatedVendor = await updateProductsFromFirestore({
      queryObject: selectedProduct,
      status,
    });
    if (updatedVendor) {
      setSection(status);
    }
    setModal(false);
    setSelectedProduct([]);
  };

  return (
    <div className={`flex justify-around w-full h-full relative  `}>
      {modal && (
        <div
          className="fixed inset-0 z-[99] overflow-y-auto flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl w-3/4 max-h-4/5 overflow-y-auto"
            style={{ maxHeight: "80vh" }}
          >
            <div className="flex justify-end pb-0 mb-2">
              <button
                onClick={() => {
                  setModal(false);
                  setSelectedProduct([]);
                }}
                className="focus:outline-none"
              >
                <X />
              </button>
            </div>
            <div className="flex md:flex-row flex-col-reverse justify-center items-center w-full">
              <div className="flex flex-col md:w-1/2 w-full ">
                <div className="flex justify-center mt-4 pl-6 mb-4 items-center text-2xl font-semibold">
                  <div className="text-gray-700">{item.id}</div>
                </div>
                <div>
                  <div className="flex flex-col">
                    <span className="m-2">Title</span>
                    <Input
                      readOnly
                      value={item.title}
                      className="rounded-xl border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="m-2">Description</span>
                    <Textarea
                      readOnly
                      value={item.description}
                      className="h-auto resize-none rounded-xl border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="m-2">Category</span>
                    <Input
                      readOnly
                      value={item.category}
                      className="rounded-xl border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center ml-4 md:w-1/2 w-full">
                <ImageViewer images={item.images} />
              </div>
            </div>
            <div>
              <div className="flex flex-col md:flex-row">
                <div className="flex md:w-1/2 w-full flex-col justify-start px-2">
                  <div className="flex flex-col">
                    <span className="m-2">Subcategory</span>
                    <Input
                      readOnly
                      value={item.subCategory}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="flex flex-col">
                    <span className="m-2">Size</span>
                    <Input readOnly value={item.size} className="rounded-xl" />
                  </div>
                  <div className="flex flex-col">
                    <span className="m-2">Date of Dispatch</span>
                    <Input readOnly value={item.dispatchDays} className="rounded-xl" />
                  </div>
                </div>
                <div className="flex md:w-1/2 w-full flex-col justify-start px-2">
                <div className="flex flex-col">
                    <span className="m-2">Maximum Retail price</span>
                    <Input
                      readOnly
                      value={item.maxRetailPrice}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="m-2">Minimum Order Quantity</span>
                    <Input readOnly value={item.size} className="rounded-xl" />
                  </div>
                  <div className="flex flex-row justify-end mt-10">
                    <Button
                      type="submit"
                      className="mx-2 text-green-400"
                      disabled={section === "approved"}
                      onClick={() => {
                        handleChangeStatus("approved");
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      type="submit"
                      className="mx-2 text-red-400 "
                      disabled={section === "disabled"}
                      onClick={() => {
                        handleChangeStatus("disabled");
                      }}
                    >
                      Disable
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEmpty || data.length > 0 ? (
        <div className="w-full  h-auto  bg-white rounded-2xl p-4 mb-6">
          <div className="flex justify-between">
            <div className="text-4xl text-[#4D413E] font-bold mb-4">
              Products
            </div>

              <div className="flex items-center gap-2 py-4">
              {section === "active" && (
                  <>
                    <Button
                      onClick={() => handleChangeStatus("approved")}
                      disabled={!selectedProduct.length}
                      className="flex gap-2 rounded-xl h-8 bg-slate-900 text-white"
                    >
                      <CheckCircle className="h-3 w-3" />
                      <p className="text-xs">Approve ({selectedProduct.length})</p>
                    </Button>
                    <Button
                      onClick={() => handleChangeStatus("disabled")}
                      disabled={!selectedProduct.length}
                      className="flex gap-2 rounded-xl h-8 bg-slate-900 text-white"
                    >
                      <CheckCircle className="h-3 w-3" />
                      <p className="text-xs">Disable ({selectedProduct.length})</p>
                    </Button>
                  </>
                )}
                {section === "approved" && (
                  <>
                    <Button
                      onClick={() => handleChangeStatus("disabled")}
                      disabled={!selectedProduct.length}
                      className="flex gap-2 rounded-xl h-8 bg-slate-900 text-white"
                    >
                      <CheckCircle className="h-3 w-3" />
                      <p className="text-xs">Disable ({selectedProduct.length})</p>
                    </Button>
                  </>
                )}
                {section === "disabled" && (
                  <>
                    <Button
                      onClick={() => handleChangeStatus("approved")}
                      disabled={!selectedProduct.length}
                      className="flex gap-2 rounded-xl h-8 bg-slate-900 text-white"
                    >
                      <CheckCircle className="h-3 w-3" />
                      <p className="text-xs">Approve ({selectedProduct.length})</p>
                    </Button>
                  </>
                )}
                <Input
                  placeholder="Search by Title"
                  value={
                    (table.getColumn("title")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table.getColumn("title")?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                  />
              <div className="flex gap-3 sm:justify-end justify-start md:p-0 pl-2 items-center">
                <Image
                  className="min-w-10 cursor-pointer"
                  onClick={getProducts}
                  height={40}
                  width={40}
                  src={load}
                  alt="load"
                />
                {alert && selectedProduct.length > 0 && (
                  <AlertDialog open={alert} onOpenChange={() => setAlert(false)}>
                    <AlertDialogContent className="bg-white rounded-lg shadow-lg p-6">
                      <AlertDialogHeader className="mb-4">
                        <AlertDialogTitle className="text-2xl font-bold text-red-600">
                          Warning!
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-800">
                          Are you certain you wish to proceed with this action?
                          Please consider carefully before making your decision.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex justify-end">
                        <AlertDialogCancel className="px-4 py-2 mr-2 bg-white text-[#695d56] border border-gray-300 rounded-md hover:bg-gray-200 transition-colors">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="px-4 py-2 bg-[#695d56] text-white rounded-md hover:bg-gray-800 transition-colors"
                          onClick={() => handleChange()}
                        >
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
          </div>

          </div>
          <div className="flex gap-2 mb-5">
            <Button
              value="approved"
              className={cn(
                "rounded-md text-white ",
                section === "approved"
                  ? "bg-[#695d56]"
                  : "bg-white text-[#695d56]",
                "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={(e) => onCLick(e.target)}
            >
              Approved
            </Button>
            <Button
              value="active"
              className={cn(
                "rounded-md text-white ",
                section === "active"
                  ? "bg-[#695d56]"
                  : "bg-white text-[#695d56]",
                "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={(e) => onCLick(e.target)}
            >
              Active
            </Button>
            <Button
              value="disabled"
              className={cn(
                "rounded-md text-white ",
                section === "disabled"
                  ? "bg-[#695d56]"
                  : "bg-white text-[#695d56]",
                "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={(e) => onCLick(e.target)}
            >
              Disabled
            </Button>
          </div>
          

          {/* @ts-ignore */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
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
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                      <Button
                        variant="outline"
                        className="mt-1.5 font-normal rounded-full"
                        onClick={() => handleViewClick(row.original.productId)}
                      >
                        View Details
                      </Button>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end px-2 mt-3">
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full h-[700px] relative bg-white rounded-2xl p-4 mt-4 mb-6">
          <div className="text-3xl font-medium flex justify-center mb-4">
            Products
          </div>

          <div className="flex w-full justify-start">
            <Skeleton className="bg-gray-300 w-1/3" />
          </div>
          <div className="flex w-full justify-between mt-4 p-10">
            <Skeleton className="bg-gray-300 h-[300px] w-full" />
          </div>
        </div>
      )}
    </div>
  );
}
