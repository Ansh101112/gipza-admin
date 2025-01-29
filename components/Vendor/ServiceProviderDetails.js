"use client"

import React, { useEffect, useState } from "react";
import ServiceTable from "./ServiceTable";
import { FaArrowLeft } from "react-icons/fa";

const ServiceProviderDetails = ({ selectedVendor, handleBackToList }) => {
    const [productCount, setProductCount] = useState(null);
    const [query, setQuery] = useState(null);

    useEffect(() => {
        const fetchProductCount = async () => {
          try {
            const response = await fetch("/api/products/getProductCount", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ vendorId: selectedVendor.id }),
            });
    
            const data = await response.json();
            setProductCount(data.productCount || 0);
          } catch (error) {
            console.error("Failed to fetch product count:", error);
          }
        };

        const fetchVendorQueries = async (vendorId) => {
            const response = await fetch(`/api/helpdesk/vendorQueriesSummary?vendorId=${vendorId}`);
            const data = await response.json();
            setQuery(data)
            return data;
        };
          
    
        if (selectedVendor?.id) {
          fetchProductCount();
          fetchVendorQueries(selectedVendor?.id);
        }
      }, [selectedVendor]);
      
    const formatTimestamp = (timestamp) => {
        const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
        const date = new Date(milliseconds);
      
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };
  return (
    <div className="bg-white sm:px-6 px-2 pt-2 py-2 rounded-lg shadow-md">
      <button
        onClick={handleBackToList}
        className="text-sm flex items-center gap-2 text-black mb-4 font-semibold sm:mt-0 mt-4"
      >
        <FaArrowLeft/> Back
      </button>

      <div className="bg-[#F3EAE7] px-6 py-3 rounded-lg">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-lg font-semibold">Meet {selectedVendor?.personalDetails?.name}!</h2>
                <p className="text-sm text-gray-600">{selectedVendor?.id}</p>
            </div>
            <div className="flex items-center">
                <span className="px-3 py-1 bg-[#46E51E] text-[#4D413E] text-xs font-medium rounded-lg">
                {selectedVendor?.isVerified ? "Verified" : "Not Verified"}
                </span>
                <img
                src={selectedVendor?.documents?.photo}
                alt="Vendor Profile"
                className="w-12 h-12 rounded-full ml-4"
                />
            </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 md:gap-8 gap-0 rounded-lg">
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-[#F3EAE7] p-4 rounded-lg shadow-sm text-start">
            <p className="text-sm font-medium text-gray-500">Services Completed</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{productCount || 0}</h3>
            <p className="text-sm font-medium text-gray-500 mt-4">Revenue Generated</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">Rs. {query?.unresolvedQueries || 0}</h3>

          </div>
          <div className="bg-[#F3EAE7] p-4 rounded-lg shadow-sm text-start">
          <p className="text-sm font-medium text-gray-500">Avg. Working Hours</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{query?.totalQueries || 0}</h3>
            <p className="text-sm font-medium text-gray-500 mt-4">Avg. Working days</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{query?.unresolvedQueries || 0}</h3>
          </div>
          <div className="bg-[#F3EAE7] p-4 rounded-lg shadow-sm text-start">
            <p className="text-sm font-medium text-gray-500">Total Queries</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{query?.totalQueries || 0}</h3>
            <p className="text-sm font-medium text-gray-500 mt-4">Total Queries</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{query?.unresolvedQueries || 0}</h3>
          </div>
          <div className="bg-[#F3EAE7] p-4 rounded-lg shadow-sm text-start">
              <p className="text-sm font-medium text-gray-500">Average Rating</p>
              <p className="text-2xl font-bold text-[#46E51E] text-start mt-1">3.75</p>
              <p className="text-sm font-medium text-gray-500 mt-4">Total number of Reviews</p>
              <p className="text-2xl font-bold text-gray-900 text-start mt-1">546</p>
          </div>
        </div>
        <div className="bg-[#F3EAE7] mt-6 py-6 sm:px-6 px-2 rounded-lg shadow-md">
            <div className="grid grid-cols-2">
                <div className="space-y-2"> 
                    <p>Registration Date</p>
                    <p>Status</p>
                    <p>Phone Number</p>
                    <p>Email ID </p>
                    <p>Location</p>
                    <p>Aadhaar Card</p>
                    <p>Gst Certificate</p>
                    <p>Pan Card</p>
                    <p>GST No. </p>
                </div>
                <div className="space-y-2">
                    <p>{formatTimestamp(selectedVendor?.createdAt)}</p>
                    <p>{selectedVendor?.active ? "Active" : "In Active"}</p>
                    <p>{selectedVendor?.personalDetails?.phoneNumber}</p>
                    <p>{selectedVendor?.personalDetails?.email}</p>
                    <p>{selectedVendor?.personalDetails?.email}</p>
                    <p> 
                        <a
                        href={selectedVendor?.documents?.aadhaarCard}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="italic font-medium"
                        >
                        Link
                        </a>
                    </p>
                    <p>
                        <a
                        href={selectedVendor?.documents?.gstCertificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="italic font-medium"
                        >
                        Link
                        </a>
                    </p>
                    <p>
                        <a
                        href={selectedVendor?.documents?.panCard}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="italic font-medium"
                        >
                        Link
                        </a>
                    </p>
                    <p>{selectedVendor?.businessDetails?.gstNumber}</p>
                </div>
            </div>
          </div>
      </div>

      <div className="mt-8">
        <ServiceTable vendorId={selectedVendor.id}/>
      </div>
    </div>
  );
};

export default ServiceProviderDetails;
