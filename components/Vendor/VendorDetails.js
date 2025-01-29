"use client";

import React, { useEffect, useState } from "react";
import VendorProductsTable from "./VendorProductsTable";
import { FaArrowLeft } from "react-icons/fa";
import { getEachVendorDetail } from "@/lib/vendorFirebaseFunc";
import PropTypes from "prop-types";

export default function VendorDetails({ vendor, onClose }) {
  if (!vendor) {
    return <div>No vendor details available</div>;
  }

  const [productCount, setProductCount] = useState(null);
  const [query, setQuery] = useState(null);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const response = await fetch("/api/products/getProductCount", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ vendorId: vendor.id }),
        });

        const data = await response.json();
        setProductCount(data.productCount || 0);
      } catch (error) {
        console.error("Failed to fetch product count:", error);
      }
    };

    const fetchVendorQueries = async (vendorId) => {
      const response = await fetch(
        `/api/helpdesk/vendorQueriesSummary?vendorId=${vendorId}`
      );
      const data = await response.json();
      setQuery(data);
      console.log(data);
      return data;
    };

    if (vendor?.id) {
      fetchProductCount();
      fetchVendorQueries(vendor?.id);
    }
  }, [vendor]);

  const handleBackToList = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="rounded-lg">
      <button
        onClick={handleBackToList}
        className="text-sm flex items-center gap-2 text-black mb-4 font-semibold sm:mt-0 mt-4"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="bg-[#F3EAE7] px-6 py-3 rounded-lg ">
        <div className="flex items-center justify-between ">
          <div>
            <h2 className="text-lg font-semibold">
              Meet {vendor?.personalDetails?.name}!
            </h2>
            <p className="text-sm text-gray-600">{vendor?.id}</p>
          </div>
          <div className="flex items-center">
            <span className="px-3 py-1 bg-[#46E51E] text-[#4D413E] text-xs font-medium rounded-lg">
              {vendor?.status === "isVerified"
                ? "Verified"
                : vendor?.status === "isDisabled"
                ? "Disabled"
                : vendor?.status === "isInitiated"
                ? "Initiated"
                : "Unverified"}
            </span>
            <img
              src={vendor?.documents?.photo}
              alt="Vendor Profile"
              className="w-12 h-12 rounded-full ml-4"
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-8 rounded-lg mt-10">
        <div className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-[#F3EAE7] p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Personal Details
              </h2>
              <p className="text-sm text-gray-500">
                Name: {vendor?.personalDetails?.name}
              </p>
              <p className="text-sm font-medium text-gray-500">
                Phone: {vendor?.personalDetails?.phoneNumber}
              </p>
              <p className="text-sm font-medium text-gray-500">
                Email: {vendor?.personalDetails?.email}
              </p>
              <p className="text-sm font-medium text-gray-500">
                Is Ecommerce:{" "}
                {vendor?.personalDetails?.isEcommerce ? "Yes" : "No"}
              </p>
              <p className="text-sm font-medium text-gray-500">
                Is Service:{" "}
                {vendor?.personalDetails?.isService ? "Yes" : "No"}
              </p>
            </div>

            <div className="bg-[#F3EAE7] p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Bank Details
              </h2>
              <p className="text-sm font-medium text-gray-500">
                Holder Name: {vendor?.bankDetails?.holderName}
              </p>
              <p className="text-sm font-medium text-gray-500">
                Account Number: {vendor?.bankDetails?.accountNumber}
              </p>
              <p className="text-sm font-medium text-gray-500">
                IFSC Code: {vendor?.bankDetails?.ifsc}
              </p>
            </div>
          </div>

          <div className="bg-[#F3EAE7] p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Documents</h2>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">
                <a
                  href={vendor?.documents?.aadhaarCard}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Aadhar Card
                </a>
              </p>
              <p className="text-sm font-medium text-gray-500">
                <a
                  href={vendor?.documents?.gstCertificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  GST Certificate
                </a>
              </p>
              <p className="text-sm font-medium text-gray-500">
                <a
                  href={vendor?.documents?.panCard}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  PAN Card
                </a>
              </p>
              <p className="text-sm font-medium text-gray-500">
                <a
                  href={vendor?.documents?.photo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Photo
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#F3EAE7] p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Business Details
          </h2>
          <p className="text-sm font-medium text-gray-500">
            Brand Name: {vendor?.businessDetails?.brandName}
          </p>
          <p className="text-sm font-medium text-gray-500">
            Business Name: {vendor?.businessDetails?.businessName}
          </p>
          <p className="text-sm font-medium text-gray-500">
            Establishment Year:{" "}
            {vendor?.businessDetails?.establishmentYear}
          </p>
          <p className="text-sm font-medium text-gray-500">
            GST Number: {vendor?.businessDetails?.gstNumber}
          </p>
          <p className="text-sm font-medium text-gray-500">
            PAN Number: {vendor?.businessDetails?.panNumber}
          </p>
          <p className="text-sm font-medium text-gray-500">
            Pickup Address: {vendor?.businessDetails?.pickupAddress}
          </p>
          <p className="text-sm font-medium text-gray-500">
            Pin Code: {vendor?.businessDetails?.pinCode}
          </p>
          <p className="text-sm font-medium text-gray-500">
            Registration Date: {formatTimestamp(vendor?.createdAt)}
          </p>
        </div>
      </div>

      {vendor?.id && (
        <div className="mt-8">
          <VendorProductsTable vendorId={vendor.id} />
        </div>
      )}
    </div>
  );
}

VendorDetails.propTypes = {
  vendor: PropTypes.shape({
    id: PropTypes.string,
  }),
  onClose: PropTypes.func,
};

VendorDetails.defaultProps = {
  vendor: null,
  onClose: () => {},
};
