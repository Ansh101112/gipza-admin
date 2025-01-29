"use client";

export const dynamic = "force-static";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import load from "../../../public/public/load.png";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAuth } from "@/hooks/auth-context";

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

import { ArrowUpDown, ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";

import {
  getAllUsersFromFireStore,
  getAllAdminsFromFireStore,
} from "@/lib/userFirebaseFunc";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "@/firebase";
import { getAuth } from "firebase/auth";
import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { setPersistence, browserSessionPersistence } from "firebase/auth";
import { onSnapshot, collection } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { IoMdRefresh } from "react-icons/io";
import ClipLoader from "react-spinners/ClipLoader";
import { MdRefresh } from "react-icons/md";
import { ClipLoader as ReactClipLoader } from "react-spinners";
//@ts-ignore
export type Query = {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  adminID: string;
  uid: string;
  name: string;
};

export default function UserPage() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState(false);
  const [isQueryAdded, setIsQueryAdded] = useState(false);
  const [data, setData] = useState<any>([]);
  const [openDialogue, setOpenDialogue] = useState<boolean>(false);
  const [deleteDialogue, setDeleteDialogue] = useState<boolean>(false);
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [search, setSearch] = useState("adminID");
  const [slugToAdd, setSlugToAdd] = useState<string>("");
  const [descToAdd, setDescToAdd] = useState<string>("");
  const [isEdit, setIsEdit] = useState<Boolean>(false);
  const [uid1, setUid1] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [users, setUsers] = useState<{ id: string; [key: string]: any }[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Define columns first
  const columns: ColumnDef<Query>[] = [
    {
      accessorKey: "adminID",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Admin ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const formatted = row.getValue("adminID") as string;
        return <div className="text-left font-medium ">{formatted}</div>;
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const formatted = row.getValue("email") as string;
        return <div className="text-left font-medium ">{formatted}</div>;
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("role")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },
  ];

  // First create filtered data
  const filteredData = useMemo(() => {
    let filtered = [...data];
    // Apply search filter if exists
    const searchValue = columnFilters[0]?.value;
    if (searchValue && typeof searchValue === "string") {
      filtered = filtered.filter((item) => {
        const searchField = item[search];
        return (
          typeof searchField === "string" &&
          searchField.toLowerCase().includes(searchValue.toLowerCase())
        );
      });
    }

    return filtered;
  }, [data, columnFilters, search]);

  // Then create paginated data
  const paginatedData = useMemo(() => {
    const calculatedTotalPages =
      Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return {
      admins: filteredData.slice(startIndex, endIndex),
      totalPages: calculatedTotalPages,
    };
  }, [filteredData, currentPage]);

  // Now initialize the table with paginated data
  const table = useReactTable({
    data: paginatedData.admins,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

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

  useEffect(() => {
    setCurrentPage(1);
  }, [columnFilters]);

  useEffect(() => {
    if (!openDialogue) {
      setRole("");
      setPassword("");
      setCPassword("");
      setName("");
      setEmail("");
      setDescToAdd("");
      setStatus("");
      setIsEdit(false);
    }
  }, [openDialogue]);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onSnapshot(
      collection(db, "admins"),
      (snapshot) => {
        const adminData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setData(adminData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching queries:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const [rowSelection, setRowSelection] = useState({});
  const [currReOpenQuey, setCurrReOpenQuey] = useState<string>("");

  useEffect(() => {
    setSlugToAdd(name.toLowerCase().split(" ").join("-"));
  }, [name]);

  const searchTitles = ["adminID", "name", "email", "role", "status"];

  interface sendMail {
    email: string;
    name: string;
    message: string;
    subject: string;
  }
  const sendEmail = async ({ email, name, subject, message }: sendMail) => {
    try {
      const response = await fetch("/api/zeptomail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, subject, message }),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  // Create User Function
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const currentTime = new Date();
      const adminId = `AID${Date.now()}`;

      // 1. Check if admin already exists in both Firestore and Auth
      const adminQuerySnapshot = await getDocs(
        query(collection(db, "admins"), where("email", "==", email))
      );

      if (!adminQuerySnapshot.empty) {
        toast.error("Admin already exists.");
        return;
      }

      // 2. Create user in Firebase Authentication
      const auth = getAuth();

      let userCredential;
      try {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } catch (authError) {
        console.error("Auth Error:", authError);
        if (authError.code === "auth/email-already-in-use") {
          toast.error("Email already registered in Authentication system.");
        } else {
          toast.error(`Authentication Error: ${authError.message}`);
        }
        return;
      }

      const uid = userCredential.user.uid;

      // 3. Create admin document
      const userData = {
        adminID: adminId,
        uid: uid, // Store Firebase Auth UID
        name,
        email: email.toLowerCase(), // Store email in lowercase
        role,
        status,
        createdAt: currentTime,
        updatedAt: currentTime,
      };

      // 4. Add to Firestore with error handling
      try {
        await setDoc(doc(db, "admins", adminId), userData);

        // 5. Handle author role if needed
        if (role === "author") {
          await setDoc(doc(db, "authors", adminId), {
            name,
            slug: slugToAdd,
            description: descToAdd,
            uid: uid, // Store Firebase Auth UID here too
            email: email.toLowerCase(),
          });
        }

        // 6. Send welcome email
        const subject = "Welcome to GetJwel";
        const message = `Dear ${name}, Your account has been created successfully. Your Role is ${role}`;
        await sendEmail({ email, name, subject, message });

        toast.success("User created successfully!");
        setOpenDialogue(false);
      } catch (firestoreError) {
        // If Firestore operations fail, clean up the Authentication user
        console.error("Firestore Error:", firestoreError);
        try {
          await deleteUser(userCredential.user);
        } catch (deleteError) {
          console.error("Cleanup Error:", deleteError);
        }
        throw firestoreError;
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user.");
    }
  };

  // Delete User Function
  const handleDeleteUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "admins", uid1));

      if (!userDoc.exists()) {
        toast.error("User not found.");
        return;
      }

      const userData = userDoc.data();
      const auth = getAuth();

      // 1. Delete from Authentication if UID exists
      if (userData.uid) {
        try {
          // We need to sign in as the user to delete them
          // This might require admin SDK in production
          const user = auth.currentUser;
          if (user && user.uid === userData.uid) {
            await deleteUser(user);
          }
        } catch (authError) {
          console.error("Auth deletion error:", authError);
          // Continue with Firestore deletion even if Auth deletion fails
        }
      }

      // 2. Delete from Firestore
      await deleteDoc(doc(db, "admins", uid1));

      // 3. Delete from authors if applicable
      if (userData.role === "author") {
        await deleteDoc(doc(db, "authors", uid1));
      }

      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  // Edit User Function
  const handleEditUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "admins", uid1));

      if (!userDoc.exists()) {
        toast.error("User not found.");
        return;
      }

      const updatedUserData = {
        name,
        role,
        status,
        updatedAt: serverTimestamp(),
      };

      // 1. Update Firestore admin document
      await updateDoc(doc(db, "admins", uid1), updatedUserData);

      // 2. Handle author role changes
      const currentRole = userDoc.data().role;
      if (role !== currentRole) {
        if (role === "author") {
          // Add author document
          await setDoc(doc(db, "authors", uid1), {
            name,
            slug: slugToAdd,
            description: descToAdd,
            uid: userDoc.data().uid,
            email: userDoc.data().email,
          });
        } else if (currentRole === "author") {
          // Remove author document if role changed from author
          await deleteDoc(doc(db, "authors", uid1));
        }
      } else if (role === "author") {
        // Update existing author document
        await updateDoc(doc(db, "authors", uid1), {
          name,
          slug: slugToAdd,
          description: descToAdd,
        });
      }

      toast.success("User updated successfully!");
    } catch (error) {
      console.error("Error editing user:", error);
      toast.error("Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!currentUser?.userID) return;
    try {
      setLoading(true);
      const unsubscribe = onSnapshot(
        collection(db, "admins"),
        (snapshot) => {
          const adminData = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setData(adminData);
        },
        (error) => {
          console.error("Error fetching queries:", error);
          toast.error("Failed to fetch users");
        }
      );
      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true); // Start loading

    try {
      const unsubscribe = onSnapshot(
        collection(db, "admins"),
        (snapshot) => {
          const adminData = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setData(adminData);
          setCurrentPage(1);

          // Add a small delay before stopping loading to ensure animation is visible
          setTimeout(() => {
            setLoading(false);
          }, 500); // 500ms delay
        },
        (error) => {
          console.error("Error fetching queries:", error);
          toast.error("Failed to fetch users");
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.userID) {
      fetchUsers();
    }
  }, [currentUser]);

  return (
    <>
      <div className="lg:px-6 md:px-4 lg:py-6 py-2 px-0">
        <div className="flex flex-wrap justify-between mb-3">
          <h1 className="text-4xl font-bold sm:mb-6 mb-2 text-[#4D413E]">
            Team
          </h1>

          {/* Top Controls: Add, Sort, Filter, Search */}
          <div className="flex justify-between items-center mb-6 mt-0">
            <Dialog
              onOpenChange={setOpenDialogue}
              open={openDialogue}
              modal={true}
            >
              <DialogTrigger asChild>
                <Button className="rounded-md text-sm bg-[#695d56] text-white mr-3 hover:bg-[#4D413E] transition-colors">
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white mt-6">
                <DialogHeader>
                  <DialogTitle>
                    {isEdit ? "Edit User" : "Create User"}
                  </DialogTitle>
                  <DialogDescription>
                    {isEdit 
                      ? "Update user information and role" 
                      : "Create a new user with assigned role"
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col items-center gap-2">
                    <Label
                      htmlFor="name"
                      className="flex justify-start w-full ml-1"
                    >
                      Name
                    </Label>
                    <Input
                      value={name}
                      id="name"
                      placeholder="Enter username"
                      className="col-span-3"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Label
                      htmlFor="description"
                      className="flex w-full justify-start"
                    >
                      Email
                    </Label>
                    {isEdit ? (
                      <Input
                        value={email}
                        id="email"
                        placeholder="Enter email"
                        className="col-span-3"
                        readOnly
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    ) : (
                      <Input
                        value={email}
                        id="email"
                        placeholder="Enter email"
                        className="col-span-3"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    )}
                  </div>
                  {isEdit ? (
                    <></>
                  ) : (
                    <>
                      {" "}
                      <div className="flex flex-col items-center gap-2">
                        <Label
                          htmlFor="password"
                          className="flex w-full justify-start"
                        >
                          Password
                        </Label>
                        <Input
                          value={password}
                          required
                          id="password"
                          type="password"
                          placeholder="Password"
                          className="col-span-3"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                  <div className="flex flex-col items-center gap-2">
                    <Label
                      htmlFor="status"
                      className="flex justify-start w-full ml-1"
                    >
                      Status
                    </Label>
                    <Select
                      value={status}
                      onValueChange={(e) => {
                        setStatus(e);
                      }}
                    >
                      <SelectTrigger className="bg-zinc-100 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>

                      <SelectContent className="z-[9999]">
                        <SelectItem value="active" className="capitalize">
                          Active
                        </SelectItem>
                        <SelectItem value="inactive" className="capitalize">
                          Inactive
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col items-center gap-2 ">
                    <Label
                      htmlFor="role"
                      className="flex justify-start w-full ml-1"
                    >
                      Role
                    </Label>
                    <Select
                      value={role}
                      onValueChange={(e) => {
                        setRole(e);
                      }}
                    >
                      <SelectTrigger className="bg-zinc-100 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>

                      <SelectContent className="z-[9999]">
                        <SelectItem value="admin" className="capitalize">
                          Admin
                        </SelectItem>
                        <SelectItem value="author" className="capitalize">
                          Author
                        </SelectItem>
                        <SelectItem value="help-desk" className="capitalize">
                          Help Desk
                        </SelectItem>
                        <SelectItem
                          value="service-manager"
                          className="capitalize"
                        >
                          Service-Manager
                        </SelectItem>
                        <SelectItem
                          value="e-commerce-manager"
                          className="capitalize"
                        >
                          E-Commerce-Manager
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {role === "author" && (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="slug" className="text-right">
                          Slug
                        </Label>
                        <Input
                          id="slug"
                          required
                          value={slugToAdd}
                          onChange={(e) => setSlugToAdd(e.target.value)}
                          placeholder="Add Slug"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="desc" className="text-right">
                          Description
                        </Label>
                        <Input
                          id="desc"
                          placeholder="Enter the description"
                          required
                          value={descToAdd}
                          className="col-span-3"
                          onChange={(e) => setDescToAdd(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    className="bg-[#695d56] text-white hover:bg-[#4D413E] transition-colors"
                    disabled={email === "" || role === ""}
                    type="button"
                    onClick={async (event) => {
                      setLoading(true);
                      isEdit
                        ? await handleEditUser(event)
                        : await handleCreateUser(event);
                      setRole("");
                      setPassword("");
                      setCPassword("");
                      setName("");
                      setEmail("");
                      setChanged((curr) => !curr);
                      setIsQueryAdded(true);
                      setLoading(false);
                      setOpenDialogue(false);
                    }}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isEdit ? (
                      "Edit User"
                    ) : (
                      "Generate User"
                    )}
                  </Button>

                  <Button
                    onClick={() => {
                      setRole("");
                      setEmail("");
                      setPassword("");
                      setCPassword("");
                      setName("");
                      setOpenDialogue(false);
                      setIsQueryAdded(false);
                    }}
                    variant="outline"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {/* </div> */}

            <div>
              <Dialog
                onOpenChange={setDeleteDialogue}
                open={deleteDialogue}
                modal={true}
              >
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                    <DialogDescription>
                      Are you sure, you want to delete this user?
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter>
                    <Button
                      className="bg-[#695d56] text-white hover:bg-[#4D413E] transition-colors"
                      type="button"
                      onClick={async (event) => {
                        setLoading(true);
                        await handleDeleteUser(event);
                        setLoading(false);
                        setDeleteDialogue(false);
                        // toast.success("Successfully deleted the User");
                      }}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Delete User"
                      )}
                    </Button>

                    <Button
                      onClick={() => {
                        setDeleteDialogue(false);
                      }}
                      variant="outline"
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="w-full">
                <div className="flex items-center py-1 w-full gap-4 ">
                  <div className="w-max-content">
                    <Input
                      placeholder={`Search by ${search}...`}
                      value={
                        (table.getColumn(search)?.getFilterValue() as string) ??
                        ""
                      }
                      onChange={(event) =>
                        table
                          .getColumn(search)
                          ?.setFilterValue(event.target.value)
                      }
                      className="w-[300px]"
                    />
                  </div>

                  <Select
                    onValueChange={(e) => {
                      console.log(e);
                      setSearch(e);
                    }}
                  >
                    <SelectTrigger className="bg-zinc-100 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none w-[100px]">
                      <SelectValue placeholder="Select a search type" />
                    </SelectTrigger>

                    <SelectContent>
                      {searchTitles.map((mt: any) => (
                        <SelectItem key={mt} value={mt} className="capitalize">
                          {mt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                          Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {table
                          .getAllColumns()
                          .filter((column) => column.getCanHide())
                          .map((column) => {
                            return (
                              <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) =>
                                  column.toggleVisibility(!!value)
                                }
                              >
                                {column.id}
                              </DropdownMenuCheckboxItem>
                            );
                          })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <button
                    onClick={handleRefresh}
                    className="border border-[#85716B] text-[#A1887F] px-2 py-2 text-xl rounded-xl flex items-center gap-2 "
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
          </div>
        </div>

        {/* Table Container with fixed height */}
        <div className="bg-[#F3EAE7] rounded-lg min-h-[580px]">
          <Table className="border-none">
            <TableHeader className="min-w-10 rounded-tl-lg">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-12 px-4 bg-[#F3EAE7] text-[#9c786c] py-1 font-semibold text-nowrap rounded-tl-lg"
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
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="align-center text-[#6e554a] text-sm font-medium h-2 p-2"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    <div className="flex gap-4 justify-center p-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-5 px-3 border rounded-xl border-[#4D413E] bg-transparent text-[#6e554a]"
                        onClick={() => {
                          setOpenDialogue(true);
                          setName(row.original.name);
                          setEmail(row.original.email);
                          setRole(row.original.role);
                          setUid1(row.original.adminID ?? "");
                          setStatus(row.original.status);
                          setIsEdit(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-5 px-3 border rounded-xl border-[#4D413E] bg-transparent text-[#6e554a]"
                        onClick={() => {
                          setDeleteDialogue(true);
                          setUid1(row.original.adminID ?? "");
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableRow>
                ))
              ) : (
                <TableRow className="bg-[#F3EAE7]">
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

        {/* Pagination */}
        {paginatedData.admins.length > 0 && (
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
      </div>
    </>
  );
}
