'use client';

import React, { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation"; 
import { Dialog } from "@headlessui/react"; // Headless UI for accessible modal

export function ProfileHeader() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userStatus, setUserStatus] = useState("Active");

  const handleBack = () => {
    router.push("../users"); // Navigate to the previous page (./users)
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmBlock = () => {
    setUserStatus("Blocked"); // Change status to "Blocked"
    closeModal(); // Close the modal
  };

  return (
    <>
      <div className="flex items-center justify-between bg-[#F3EAE7] p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-full bg-white dark:bg-gray-700"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-xl font-semibold">Meet Kritika!</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              KRIT84867784
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Status: {userStatus}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={openModal}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Block
          </button>
          <img
            src="https://github.com/yusufhilmi.png"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={closeModal} className="fixed z-10 inset-0 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Dialog.Title className="text-lg font-bold">
            Are you sure you want to Block?
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-gray-500">
            Are you sure you want to block this user?
          </Dialog.Description>

          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              No, cancel
            </button>
            <button
              onClick={confirmBlock}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Yes, Confirm
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
