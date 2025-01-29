"use client";

import React, { useState, useMemo } from 'react';
import { MdOutlineEdit, MdOutlineDelete, MdRefresh } from 'react-icons/md';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/users/uiTwo/table";
import { ClipLoader } from "react-spinners";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function TagsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false);
  const [isEditTagModalOpen, setIsEditTagModalOpen] = useState(false);
  const [isDeleteTagModalOpen, setIsDeleteTagModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [newTag, setNewTag] = useState({ name: "", description: "", slug: "" });
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [columnFilters, setColumnFilters] = useState([]);
  const [search, setSearch] = useState("name");
  const ITEMS_PER_PAGE = 10;
  const [tags, setTags] = useState([
    {
      id: '1',
      name: "Kritika",
      description: "Sample description for Kritika",
      slug: "kritika",
      createdAt: "11/01/2023",
    },
    {
      id: '2',
      name: "Tag2",
      description: "Sample description for Tag2",
      slug: "tag2",
      createdAt: "12/01/2023",
    },
  ]);

  const paginatedData = useMemo(() => {
    let filtered = [...tags];

    if (columnFilters[0]?.value) {
      filtered = filtered.filter((item) => {
        const searchField = item[search];
        return searchField.toLowerCase().includes(columnFilters[0].value.toLowerCase());
      });
    }

    const calculatedTotalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return {
      tags: filtered.slice(startIndex, endIndex),
      totalPages: calculatedTotalPages,
    };
  }, [tags, columnFilters, search, currentPage]);

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

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const openAddTagModal = () => {
    setNewTag({ name: "", description: "", slug: "" });
    setIsAddTagModalOpen(true);
  };

  const closeAddTagModal = () => setIsAddTagModalOpen(false);

  const openEditTagModal = (tag) => {
    console.log('Opening edit modal with tag:', tag);
    setSelectedTag({...tag});
    setIsEditTagModalOpen(true);
  };

  const closeEditTagModal = () => {
    setIsEditTagModalOpen(false);
    setSelectedTag(null);
  };

  const openDeleteTagModal = (tag) => {
    setSelectedTag(tag);
    setIsDeleteTagModalOpen(true);
  };

  const closeDeleteTagModal = () => setIsDeleteTagModalOpen(false);

  const handleAddTag = () => {
    if (!newTag.name || !newTag.description || !newTag.slug) {
      alert("Please fill in all fields before adding a tag.");
      return;
    }
  
    const newTagData = {
      ...newTag,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleDateString(),
    };
  
    setTags((prevTags) => [...prevTags, newTagData]);
    closeAddTagModal();
  };
  
  const handleEditTag = () => {
    console.log('Selected Tag:', selectedTag);
    console.log('Current Tags:', tags);

    if (!selectedTag.name || !selectedTag.description || !selectedTag.slug) {
      alert("Please fill in all fields before saving changes.");
      return;
    }
  
    const updatedTags = tags.map((tag) =>
      tag.id === selectedTag.id ? selectedTag : tag
    );
  
    console.log('Updated Tags:', updatedTags);
    setTags(updatedTags);
    closeEditTagModal();
  };
  
  const handleDeleteTag = () => {
    const updatedTags = tags.filter((tag) => tag.slug !== selectedTag.slug);
  
    setTags(updatedTags);
    closeDeleteTagModal();
  };

  const handleSort = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    const sortedTags = [...tags].sort((a, b) => {
      if (sortOrder === 'asc') {
        return b.name.localeCompare(a.name);
      } else {
        return a.name.localeCompare(b.name);
      }
    });
    setTags(sortedTags);
  };

  return (
    <div className="lg:px-6 md:px-4 lg:py-6 py-2 px-0">
      <div className="flex flex-wrap justify-between mb-3">
        <h1 className="text-4xl font-bold sm:mb-6 mb-2 text-[#4D413E]">Tags</h1>

        {/* Top Controls: Add, Sort, Filter, Search */}
        <div className="flex justify-between items-center mb-6 mt-5">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsAddTagModalOpen(true)}
              className="px-3 py-2.5 rounded-md text-sm bg-[#695d56] text-white hover:bg-[#4D413E] transition-colors"
            >
              Add New Tag
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
                  onCheckedChange={() => {
                    setSortOrder('asc');
                    handleSort();
                  }}
                >
                  Ascending
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortOrder === 'desc'}
                  onCheckedChange={() => {
                    setSortOrder('desc');
                    handleSort();
                  }}
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
                <ClipLoader size={20} color="#85716B" loading={true} />
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
              <TableHead className="h-12 px-4 bg-[#F3EAE7] text-[#9c786c] py-1 font-semibold text-nowrap rounded-tl-lg">Name</TableHead>
              <TableHead className="h-12 px-4 bg-[#F3EAE7] text-[#9c786c] py-1 font-semibold text-nowrap">Description</TableHead>
              <TableHead className="h-12 px-4 bg-[#F3EAE7] text-[#9c786c] py-1 font-semibold text-nowrap">Slug</TableHead>
              <TableHead className="h-12 px-4 bg-[#F3EAE7] text-[#9c786c] py-1 font-semibold text-nowrap">Created At</TableHead>
              <TableHead className="h-12 px-4 bg-[#F3EAE7] text-[#9c786c] py-1 font-semibold text-nowrap rounded-tr-lg">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="align-center text-[#6e554a] text-sm font-medium h-1 p-2">
                  {tag.name}
                </TableCell>
                <TableCell className="align-center text-[#6e554a] text-sm font-medium h-1 p-1">
                  {tag.description}
                </TableCell>
                <TableCell className="align-center text-[#6e554a] text-sm font-medium h-1 p-1">
                  {tag.slug}
                </TableCell>
                <TableCell className="align-center text-[#6e554a] text-sm font-medium h-1 p-1">
                  {tag.createdAt}
                </TableCell>
                <TableCell className="align-center text-[#6e554a] text-sm font-medium h-1 p-1">
                  <div className="flex gap-4 justify-center p-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-5 px-3 border rounded-xl border-[#4D413E] bg-transparent text-[#6e554a]"
                      onClick={() => openEditTagModal(tag)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-5 px-3 border rounded-xl border-[#4D413E] bg-transparent text-[#6e554a]"
                      onClick={() => openDeleteTagModal(tag)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {paginatedData.tags.length > 0 && (
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

      {/* Add Tag Modal */}
      {isAddTagModalOpen && (
        <Dialog open={isAddTagModalOpen} onOpenChange={setIsAddTagModalOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Add New Tag</DialogTitle>
              <DialogDescription>
                Add a new tag to your collection.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col items-center gap-2">
                <Label htmlFor="name" className="flex justify-start w-full ml-1">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter tag name"
                  className="col-span-3"
                  value={newTag.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/\s+/g, '-');
                    setNewTag({
                      ...newTag,
                      name: name,
                      slug: slug
                    });
                  }}
                />
              </div>

              <div className="flex flex-col items-center gap-2">
                <Label htmlFor="description" className="flex justify-start w-full ml-1">
                  Description
                </Label>
                <Input
                  id="description"
                  placeholder="Enter description"
                  className="col-span-3"
                  value={newTag.description}
                  onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
                />
              </div>

              <div className="flex flex-col items-center gap-2">
                <Label htmlFor="slug" className="flex justify-start w-full ml-1">
                  Slug
                </Label>
                <Input
                  id="slug"
                  placeholder="Enter slug"
                  className="col-span-3"
                  value={newTag.slug}
                  onChange={(e) => setNewTag({ ...newTag, slug: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                className="bg-[#695d56] text-white hover:bg-[#4D413E] transition-colors"
                disabled={!newTag.name || !newTag.description}
                onClick={handleAddTag}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Add Tag"
                )}
              </Button>
              <Button
                onClick={() => {
                  setIsAddTagModalOpen(false);
                  setNewTag({ name: "", description: "", slug: "" });
                }}
                variant="outline"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Tag Modal */}
      {isEditTagModalOpen && selectedTag && (
        <Dialog open={isEditTagModalOpen} onOpenChange={setIsEditTagModalOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Edit Tag</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col items-center gap-2">
                <Label htmlFor="edit-name" className="flex justify-start w-full ml-1">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  placeholder="Tag Name"
                  value={selectedTag.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/\s+/g, '-');
                    setSelectedTag({
                      ...selectedTag,
                      name: name,
                      slug: slug
                    });
                  }}
                  className="col-span-3"
                />
              </div>

              <div className="flex flex-col items-center gap-2">
                <Label htmlFor="edit-description" className="flex justify-start w-full ml-1">
                  Description
                </Label>
                <Input
                  id="edit-description"
                  placeholder="Description"
                  value={selectedTag.description}
                  onChange={(e) => setSelectedTag({ ...selectedTag, description: e.target.value })}
                  className="col-span-3"
                />
              </div>

              <div className="flex flex-col items-center gap-2">
                <Label htmlFor="edit-slug" className="flex justify-start w-full ml-1">
                  Slug
                </Label>
                <Input
                  id="edit-slug"
                  placeholder="Slug"
                  value={selectedTag.slug}
                  onChange={(e) => setSelectedTag({ ...selectedTag, slug: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={closeEditTagModal}
                className="border-[#4D413E] text-[#4D413E]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditTag}
                className="bg-[#695d56] text-white hover:bg-[#4D413E] transition-colors"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Tag Modal */}
      {isDeleteTagModalOpen && selectedTag && (
        <Dialog open={isDeleteTagModalOpen} onOpenChange={setIsDeleteTagModalOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Delete Tag</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this tag? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-2 py-4">
              <p className="text-[#6e554a]">
                Tag Name: <span className="font-medium">{selectedTag.name}</span>
              </p>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteTagModalOpen(false)}
                className="border-[#4D413E] text-[#4D413E]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteTag}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
