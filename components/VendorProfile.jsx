import React from "react";
import { useNavigate } from "react-router-dom"; 
const vendor = [
  {
    name: "Aman Gupta",
    Id: "V001",
    productsSold: 150,
    totalProducts: 200,
    revenueGenerated: 750000,
    queries: 3,
    unresolvedQueries: 1,
    rating: 4.2,
    reviews: 100,
    registrationDate: "01-10-2023",
    phone: "+91 9876543210",
    email: "aman@guptavendors.com",
    location: "Mumbai, India",
    status: "Active",
    gst: "GST001",
    products: [
      { name: "Pet Bed", category: "Accessories", price: 1200, margin: 200, stock: 50, status: "In Stock", lastUpdated: "10-10-2024 12:00:00" },
      { name: "Dog Food", category: "Food", price: 500, margin: 100, stock: 300, status: "In Stock", lastUpdated: "10-10-2024 12:00:00" },
      { name: "Cat Litter", category: "Grooming", price: 250, margin: 50, stock: 100, status: "Out of Stock", lastUpdated: "10-10-2024 12:00:00" },
    ],
  },
  {
    name: "Anil Kumar",
    Id: "V011",
    productsSold: 90,
    totalProducts: 120,
    revenueGenerated: 400000,
    queries: 2,
    unresolvedQueries: 0,
    rating: 4.0,
    reviews: 50,
    registrationDate: "01-09-2023",
    phone: "+91 9876543220",
    email: "anil@kumarvendors.com",
    location: "Delhi, India",
    status: "Active",
    gst: "GST002",
    products: [
      { name: "Dog Collar", category: "Accessories", price: 400, margin: 100, stock: 200, status: "In Stock", lastUpdated: "10-10-2024 12:00:00" },
      { name: "Dog Leash", category: "Accessories", price: 600, margin: 150, stock: 150, status: "In Stock", lastUpdated: "10-10-2024 12:00:00" },
      { name: "Bird Seed", category: "Food", price: 300, margin: 50, stock: 50, status: "In Stock", lastUpdated: "10-10-2024 12:00:00" },
    ],
  },
  {
    name: "Sunil Agarwal",
    Id: "V021",
    productsSold: 200,
    totalProducts: 250,
    revenueGenerated: 900000,
    queries: 4,
    unresolvedQueries: 2,
    rating: 3.5,
    reviews: 80,
    registrationDate: "01-08-2023",
    phone: "+91 9876543230",
    email: "sunil@agarwalvendors.com",
    location: "Bangalore, India",
    status: "Inactive",
    gst: "GST003",
    products: [
      { name: "Cat Toy", category: "Accessories", price: 200, margin: 50, stock: 100, status: "In Stock", lastUpdated: "10-10-2024 12:00:00" },
      { name: "Dog Shampoo", category: "Grooming", price: 350, margin: 75, stock: 70, status: "In Stock", lastUpdated: "10-10-2024 12:00:00" },
      { name: "Fish Food", category: "Food", price: 150, margin: 25, stock: 50, status: "In Stock", lastUpdated: "10-10-2024 12:00:00" },
    ],
  },
  {
    name: "Rahul Sharma",
    Id: "V031",
    productsSold: 75,
    totalProducts: 100,
    revenueGenerated: 300000,
    queries: 1,
    unresolvedQueries: 0,
    rating: 4.5,
    reviews: 20,
    registrationDate: "15-07-2023",
    phone: "+91 9876543240",
    email: "rahul@sharmavendors.com",
    location: "Hyderabad, India",
    status: "Active",
    gst: "GST004",
    products: [
      { name: "Pet Carrier", category: "Accessories", price: 2000, margin: 300, stock: 30, status: "In Stock", lastUpdated: "10-10-2024 12:00:00" },
      { name: "Aquarium", category: "Accessories", price: 5000, margin: 800, stock: 10, status: "In Stock", lastUpdated: "10-10-2024 12:00:00" },
      { name: "Reptile Food", category: "Food", price: 400, margin: 100, stock: 20, status: "Out of Stock", lastUpdated: "10-10-2024 12:00:00" },
    ],
  },
  {
    name: "Kritika",
    Id: "KRIT64867784",
    productsSold: 120,
    totalProducts: 147,
    revenueGenerated: 546465,
    queries: 5,
    unresolvedQueries: 0,
    rating: 3.7,
    reviews: 546,
    registrationDate: "11-09-2024",
    phone: "+91 583 42/43",
    email: "kritikabhardwaj@gmail.com",
    location: "Delhi, India",
    status: "Active",
    gst: "583475/3",
    products: [
      { name: "Dog Shampoo", category: "Grooming", price: 300, margin: 3, stock: 1000, status: "In Stock", lastUpdated: "12-08-2024 11:00:76" },
      { name: "Cat Food", category: "Food", price: 300, margin: 3, stock: 1000, status: "In Stock", lastUpdated: "12-08-2024 11:00:76" },
      { name: "Bird Cage", category: "Accessories", price: 300, margin: 3, stock: 1000, status: "Out of Stock", lastUpdated: "12-08-2024 11:00:76" },
    ],
  }
];
  

const VendorDetails=()=>{
  return (
    <div className="vendor-details bg-white p-5 rounded-lg shadow-md mt-5 w-full" onClick={handleVendorClick} style={{ cursor: 'pointer' }}>
      {/* Vendor Summary Section */}
      <div className="details-header flex justify-between items-center mb-5">
        <div>
          <h2 className="text-2xl font-semibold">Meet {vendor.name}!</h2>
          <p className="text-gray-600">{vendor.code}</p>
        </div>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded">{vendor.status}</span>
      </div>

      <div className="summary grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-100 rounded text-center">
          <p className="text-sm text-gray-600">Products Sold</p>
          <p className="text-lg font-bold">{vendor.productsSold}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded text-center">
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="text-lg font-bold">{vendor.totalProducts}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded text-center">
          <p className="text-sm text-gray-600">Revenue Generated</p>
          <p className="text-lg font-bold">Rs. {vendor.revenueGenerated}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded text-center">
          <p className="text-sm text-gray-600">Total Queries</p>
          <p className="text-lg font-bold">{vendor.queries}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded text-center">
          <p className="text-sm text-gray-600">Average Rating</p>
          <p className="text-lg font-bold text-green-600">{vendor.rating}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded text-center">
          <p className="text-sm text-gray-600">Total Reviews</p>
          <p className="text-lg font-bold">{vendor.reviews}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <p><strong>Registration Date:</strong> {vendor.registrationDate}</p>
          <p><strong>Status:</strong> {vendor.status}</p>
          <p><strong>Phone number:</strong> {vendor.phone}</p>
          <p><strong>Email ID:</strong> {vendor.email}</p>
        </div>
        <div>
          <p><strong>Location:</strong> {vendor.location}</p>
          <p><strong>License Certificate:</strong> <a href="#" className="text-blue-600">link</a></p>
          <p><strong>PAN Card:</strong> <a href="#" className="text-blue-600">link</a></p>
          <p><strong>GST No.:</strong> {vendor.gst}</p>
        </div>
      </div>

      {/* List of Products Section */}
      <h3 className="text-lg font-semibold mb-3">List of Products</h3>
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left border">Product Name</th>
            <th className="p-2 text-left border">Category</th>
            <th className="p-2 text-left border">Sold Price</th>
            <th className="p-2 text-left border">Margin Earned</th>
            <th className="p-2 text-left border">Stock</th>
            <th className="p-2 text-left border">Status</th>
            <th className="p-2 text-left border">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {vendor.products.map((product, index) => (
            <tr key={index} className="border-t">
              <td className="p-2 border">{product.name}</td>
              <td className="p-2 border">{product.category}</td>
              <td className="p-2 border">Rs. {product.price}</td>
              <td className="p-2 border">Rs. {product.margin}</td>
              <td className="p-2 border">{product.stock}</td>
              <td className={`p-2 border ${product.status === "In Stock" ? "text-green-600" : "text-red-600"}`}>
                {product.status}
              </td>
              <td className="p-2 border">{product.lastUpdated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorDetails;