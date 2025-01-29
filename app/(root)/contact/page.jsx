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
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";
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
import { useEffect, useState } from "react";
import { MdOutlineRemoveRedEye, MdRefresh } from "react-icons/md";
import { ClipLoader } from "react-spinners";

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const contactsPerPage = 2;

  const handleViewDetails = (contact) => {
    setSelectedContact(contact);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedContact(null);
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/contactUs/getContacts");
      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }
      const data = await response.json();
      console.log(data)
      setContacts(data.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter((contact) => {
    const name = contact?.name?.toLowerCase() || "";
    const userId = contact?.id?.toString().toLowerCase() || "";
    return (
      name.includes(searchQuery.toLowerCase()) ||
      userId.includes(searchQuery.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  // Paginated contacts for the current page
  const currentContacts = filteredContacts.slice(
    (currentPage - 1) * contactsPerPage,
    currentPage * contactsPerPage
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
    setSearchQuery("");
    setCurrentPage(1);
    fetchContacts();
  };

  return (
    <div className="lg:px-6 md:px-4 lg:py-6 py-2 px-0">
      <div className="flex justify-between items-center mb-6 mt-4 md:mt-0 ">
        <h1 className="sm:text-4xl text-2xl font-bold mr-2 text-[#4D413E]">Contacts</h1>
        <div className="flex items-center">
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mr-4 rounded-lg bg-[#F3EAE7] text-[#85716B]"
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

      {/* Contacts Table */}
      <div className="bg-[#F3EAE7] rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="font-bold text-[#2E2624]">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentContacts.map((contact, index) => {
              const bgColor = index % 2 === 0 ? "bg-white" : "bg-[#F3EAE7]";
              return (
                <TableRow key={index} className={`my-1 shadow-sm border-none overflow-hidden rounded-xl bg-transparent`}>
                  <TableCell className={`px-3 py-1 rounded-s-xl ${bgColor}`}>{contact?.name || "N/A"}</TableCell>
                  <TableCell className={`px-1 py-1 ${bgColor}`}>{contact?.email || "N/A"}</TableCell>
                  <TableCell className={`px-1 py-1 ${bgColor}`}>{contact?.phoneNumber || "N/A"}</TableCell>
                  <TableCell className={`px-1 py-1 ${bgColor}`}>{contact?.service || "N/A"}</TableCell>
                  <TableCell className={`px-1 py-1 ${bgColor}`}>{contact?.message.slice(0, 15) || "N/A"}</TableCell>
                  <TableCell className={`px-1 py-1 ${bgColor}`}>
                    {contact?.createdAt?.seconds
                      ? new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        }).format(new Date(contact.createdAt.seconds * 1000))
                      : "N/A"}
                  </TableCell>
                  <TableCell
                    className={`px-3 py-2 rounded-e-xl flex items-center gap-2 ${bgColor}`}
                  >
                    <MdOutlineRemoveRedEye
                      className="text-xl cursor-pointer"
                      onClick={() => handleViewDetails(contact)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end mt-4">
        <PaginationPrevious onClick={handlePreviousPage} />
        <PaginationLink onClick={(e) => { e.preventDefault(); handlePageClick(currentPage); }}>
            {currentPage}
          </PaginationLink>
        <PaginationNext onClick={handleNextPage} />
      </div>

      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact Details</DialogTitle>
              <DialogClose />
            </DialogHeader>
            <DialogDescription className="max-h-[60vh] table-scrollbar overflow-y-auto p-4 bg-white rounded-lg shadow-md">
              <div className="flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={selectedContact?.name || ""}
                    readOnly
                    className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    id="email"
                    value={selectedContact?.email || ""}
                    readOnly
                    className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    value={selectedContact?.phoneNumber || ""}
                    readOnly
                    className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    value={selectedContact?.service || ""}
                    readOnly
                    className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={(selectedContact?.message || "N/A")}
                    readOnly
                    rows={5}
                    className="mt-1 block w-full rounded-md table-scrollbar bg-gray-100 border-gray-300 p-2"
                  />
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <Input
                    id="date"
                    value={
                      selectedContact?.createdAt?.seconds
                        ? new Intl.DateTimeFormat("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          }).format(new Date(selectedContact.createdAt.seconds * 1000))
                        : "N/A"
                    }
                    readOnly
                    className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300"
                  />
                </div>
              </div>
            </DialogDescription>


            <DialogFooter>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
