"use client";
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AiOutlineStock } from 'react-icons/ai';

const ServingLocations = () => {
  return (
    <div className="flex-1 mt-3 rounded-lg flex flex-col justify-center items-center px-1 bg-baw-baw-g6 lg:h-[150px]  max-lg:w-full  box-border">
      {/* Header Section */}
      <div className="flex justify-between items-center w-full mb-4">
        <h4 className="text-lg font-semibold text-gray-600">Serving Locations</h4>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-red-500 bg-gray-50">
          <AiOutlineStock className="text-red-500 text-xl" />
        </div>
      </div>

      {/* Leaflet Map */}
      <div className="w-full rounded-lg overflow-hidden">
        <MapContainer
          center={[20, 0]} // Center the map on the world
          zoom={2}
          scrollWheelZoom={false}
          style={{ height: '70px' }} // Adjusted height
          className="w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default ServingLocations;
