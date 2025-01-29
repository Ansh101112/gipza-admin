"use client";

import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const Modal = ({
  isOpen = true,
  onClose,
  onConfirm,
  statusOptions = ["Verified", "Unverified", "Disabled"],
  selectedTab,
  setSelectedTab,
}) => {
  const handleConfirm = () => {
    onConfirm(selectedTab); // Pass the selected status to the onConfirm function
    onClose(); // Close the modal after confirming
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="fixed inset-0 z-[99] flex items-center justify-center overflow-y-auto"
      >
        {/* Background Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" aria-hidden="true" />
        </Transition.Child>

        {/* Modal Panel */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 scale-95"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 scale-100"
          leaveTo="opacity-0 translate-y-4 scale-95"
        >
          <Dialog.Panel className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 transform transition-all">
            <Dialog.Title className="text-xl font-semibold text-gray-800">
              Update Vendor Status
            </Dialog.Title>

            {/* Status Selection */}
            <div className="mt-4">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={selectedTab}
                onChange={(e) => setSelectedTab(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-[#695d56] rounded-md focus:outline-none focus:ring-2"
              >
                Confirm
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default Modal;
