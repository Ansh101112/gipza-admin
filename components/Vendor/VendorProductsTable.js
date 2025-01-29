import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/users/uiTwo/table";
  
const VendorProductsTable = ({ vendorId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVendorProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/products/getVendorProducts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ vendorId }),
        });

        if (!response.ok) {
          throw new Error(response.message);
        }

        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) fetchVendorProducts();
  }, [vendorId]);

  const formatTimestamp = (timestamp) => {
    const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
    const date = new Date(milliseconds);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const secondsFormatted = String(date.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${secondsFormatted}`;
  };


  return (
    <div className="bg-[#F3EAE7] -z-50 rounded-lg shadow-md">
      {loading && <p className="text-center py-4">Loading products...</p>}
      {error && <p className="text-center text-red-500 py-4">{error}</p>}
      {!loading && !error && products.length > 0 && (
        <Table className="border-none -z-0">
          <TableHeader>
            <TableRow className="border-none font-bold text-[#2E2624]">
              <TableHead className="py-3 font-semibold text-nowrap">Product Photo</TableHead>
              <TableHead className="py-3 font-semibold text-nowrap">Product ID</TableHead>
              <TableHead className="py-3 font-semibold text-nowrap">Product Name</TableHead>
              <TableHead className="py-3 font-semibold text-nowrap">Category</TableHead>
              <TableHead className="py-3 font-semibold text-nowrap">Price</TableHead>
              <TableHead className="py-3 font-semibold text-nowrap">Stock</TableHead>
              <TableHead className="py-3 font-semibold text-nowrap">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => {
              const bgColor = index % 2 === 0 ? "bg-white" : "bg-[#F3EAE7]";
              return (
                <TableRow key={product.id} className={`my-1 shadow-sm border-none overflow-hidden rounded-xl bg-transparent`}>
                  <TableCell className={`${bgColor}`}>
                    <img src={product.images[0]} alt={product?.title} className="max-w-8 w-8 h-8 rounded-full mr-2 "/>
                  </TableCell>
                  <TableCell className={`px-1 py-1 ${bgColor}`}>{product.id}</TableCell>
                  <TableCell className={`px-1 py-1 ${bgColor}`}>{product.title}</TableCell>
                  <TableCell className={`px-1 py-1 ${bgColor}`}>{product.category}</TableCell>
                  <TableCell className={`px-1 py-1 ${bgColor}`}>₹{product.sellingPrice}</TableCell>
                  <TableCell className={`px-1 py-1 ${bgColor}`}>{product.size}</TableCell>
                  <TableCell className={`px-1 py-1 ${bgColor}`}>{formatTimestamp(product.createdAt)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      {!loading && !error && products.length === 0 && (
        <p className="text-center py-4">No products found for this vendor.</p>
      )}
    </div>
  );
};

export default VendorProductsTable;
