"use client"
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
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

// Dummy Data
const initialCategories = [
  {
    id: 1,
    name: 'Kritika',
    description: 'This is the description for Kritika',
    slug: 'kritika-slug',
    createdAt: '11/01/2023',
  },
  {
    id: 2,
    name: 'React Basics',
    description: 'Learn React.js from scratch.',
    slug: 'react-basics',
    createdAt: '10/15/2023',
  },
  {
    id: 3,
    name: 'JavaScript',
    description: 'Master JavaScript with hands-on tutorials.',
    slug: 'javascript',
    createdAt: '09/22/2023',
  },
  {
    id: 4,
    name: 'HTML & CSS',
    description: 'Understanding the basics of web design with HTML and CSS.',
    slug: 'html-css',
    createdAt: '08/30/2023',
  },
];

const CategoriesPage = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    id: '',
    name: '',
    description: '',
    slug: '',
    createdAt: '',
  });
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [search, setSearch] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');

  const searchTitles = ["name", "description", "slug", "createdAt"];

  // Calculate paginated data
  const paginatedData = useMemo(() => {
    let filtered = [...categories];

    // Apply search filter if exists
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
      categories: filtered.slice(startIndex, endIndex),
      totalPages: calculatedTotalPages,
    };
  }, [categories, columnFilters, search, currentPage]);

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
    // Simulate refresh - in real app, this would fetch new data
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // Open Add Modal
  const openAddModal = () => setIsModalOpen(true);
  const closeAddModal = () => {
    setIsModalOpen(false);
    setNewCategory({ id: '', name: '', description: '', slug: '', createdAt: '' });
  };

  // Open Edit Modal
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  // Open Delete Modal
  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  // Add Category
  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.description || !newCategory.slug) {
      alert('Please fill out all fields');
      return;
    }
    setCategories([...categories, { ...newCategory, id: Date.now(), createdAt: new Date().toLocaleDateString() }]);
    closeAddModal();
  };

  // Edit Category
  const handleEditCategory = () => {
    setCategories(
      categories.map((cat) =>
        cat.id === selectedCategory.id
          ? { ...selectedCategory, name: selectedCategory.name, description: selectedCategory.description, slug: selectedCategory.slug }
          : cat
      )
    );
    closeEditModal();
  };

  // Delete Category
  const handleDeleteCategory = () => {
    setCategories(categories.filter((category) => category.id !== selectedCategory.id));
    closeDeleteModal();
  };

  // Add this sorting function
  const handleSort = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    const sortedCategories = [...categories].sort((a, b) => {
      if (sortOrder === 'asc') {
        return b.name.localeCompare(a.name);
      } else {
        return a.name.localeCompare(b.name);
      }
    });
    setCategories(sortedCategories);
  };

  // Render Categories
  const renderCategories = () => {
    return categories.map((category) => (
      <tr key={category.id} className="border-b">
        <td className="py-4"> {category.name}</td>
        <td className="py-4"> {category.description}</td>
        <td className="py-4"> {category.slug}</td>
        <td className="py-4"> {category.createdAt}</td>
        <td className="py-4 flex">
          <button onClick={() => openEditModal(category)} className="mr-4 flex items-center px-2 py-1 bg-gray-200 rounded">
            <MdOutlineEdit /> Edit
          </button>
          <button onClick={() => openDeleteModal(category)} className="flex items-center px-2 py-1 bg-red-400 text-white rounded">
            <MdOutlineDelete /> Delete
          </button>
        </td>
      </tr>
    ));
  };
  return (
    <div className="lg:px-6 md:px-4 lg:py-6 py-2 px-0">
      <div className="flex flex-wrap justify-between mb-3">
        <h1 className="text-4xl font-bold sm:mb-6 mb-2 text-[#4D413E]">Categories</h1>

        {/* Top Controls: Add, Sort, Filter, Search */}
        <div className="flex justify-between items-center mb-6 mt-5">
          <div className="flex items-center gap-4">
            <Button
              onClick={openAddModal}
              className="px-3 py-2.5 rounded-md text-sm bg-[#695d56] text-white hover:bg-[#4D413E] transition-colors"
            >
              Add New Category
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
                    const sortedCategories = [...categories].sort((a, b) =>
                      a.name.localeCompare(b.name)
                    );
                    setCategories(sortedCategories);
                  }}
                >
                  Ascending
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortOrder === 'desc'}
                  onCheckedChange={() => {
                    setSortOrder('desc');
                    const sortedCategories = [...categories].sort((a, b) =>
                      b.name.localeCompare(a.name)
                    );
                    setCategories(sortedCategories);
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
              <TableHead className="h-12 px-4 bg-[#F3EAE7] text-[#9c786c] py-1 font-semibold text-nowrap ">Description</TableHead>
              <TableHead className="h-12 px-4 bg-[#F3EAE7] text-[#9c786c] py-1 font-semibold text-nowrap ">Slug</TableHead>
              <TableHead className="h-12 px-4 bg-[#F3EAE7] text-[#9c786c] py-1 font-semibold text-nowrap ">Created At</TableHead>
              <TableHead className="h-12 px-4 bg-[#F3EAE7] text-[#9c786c] py-1 font-semibold text-nowrap rounded-tr-lg">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.categories.map((category) => (
              <TableRow key={category.id} className="">
                <TableCell className="align-center text-[#6e554a] text-sm font-medium h-1 p-2">
                  {category.name}
                </TableCell>
                <TableCell className="align-center text-[#6e554a] text-sm font-medium h-1 p-1">
                  {category.description}
                </TableCell>
                <TableCell className="align-center text-[#6e554a] text-sm font-medium h-1 p-1">
                  {category.slug}
                </TableCell>
                <TableCell className="align-center text-[#6e554a] text-sm font-medium h-1 p-1">
                  {category.createdAt}
                </TableCell>
                <TableCell className="align-center text-[#6e554a] text-sm font-medium h-1 p-1">
                  <div className="flex gap-4 justify-center p-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-5 px-3 border rounded-xl border-[#4D413E] bg-transparent text-[#6e554a]"
                      onClick={() => openEditModal(category)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-5 px-3 border rounded-xl border-[#4D413E] bg-transparent text-[#6e554a]"
                      onClick={() => openDeleteModal(category)}
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

      {/* Pagination */}
      {paginatedData.categories.length > 0 && (
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

      {/* Add Category Modal */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Add a new category to your collection.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col items-center gap-2">
                <Label htmlFor="name" className="flex justify-start w-full ml-1">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter category name"
                  className="col-span-3"
                  value={newCategory.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/\s+/g, '-');
                    setNewCategory({
                      ...newCategory,
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
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
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
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                className="bg-[#453e3a] text-white hover:bg-[#7d6f67] transition-colors"
                disabled={!newCategory.name || !newCategory.description}
                onClick={handleAddCategory}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Add Category"
                )}
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  setNewCategory({ id: '', name: '', description: '', slug: '', createdAt: '' });
                }}
                variant="outline"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Category Modal */}
      {isEditModalOpen && selectedCategory && (
        <>
          <div className="fixed inset-0  z-[60]" />
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:max-w-[425px] bg-white z-[400]">
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col items-center gap-2">
                  <Label htmlFor="edit-name" className="flex justify-start w-full ml-1">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    placeholder="Category Name"
                    value={selectedCategory.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/\s+/g, '-');
                      setSelectedCategory({
                        ...selectedCategory,
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
                    value={selectedCategory.description}
                    onChange={(e) => setSelectedCategory({ ...selectedCategory, description: e.target.value })}
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
                    value={selectedCategory.slug}
                    onChange={(e) => setSelectedCategory({ ...selectedCategory, slug: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={closeEditModal}
                  className="border-[#4D413E] text-[#4D413E]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditCategory}
                  className="bg-[#695d56] text-white"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Delete Category Modal */}
      {isDeleteModalOpen && selectedCategory && (
        <>
          <div className="fixed inset-0 " />
          <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:max-w-[425px] bg-white z-[400]">
              <DialogHeader>
                <DialogTitle>Delete Category</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this category? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-2 py-4">
                <p className="text-[#6e554a]">
                  Category Name: <span className="font-medium">{selectedCategory.name}</span>
                </p>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="border-[#4D413E] text-[#4D413E]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteCategory}
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
        </>
      )}
    </div>
  );
};

export default CategoriesPage;

