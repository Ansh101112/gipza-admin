"use client"
import React from "react";
import Image from "next/image";

const Card = ({ vendor1, num_vendor1, vendor2, num_vendor2, img1, img2 }) => {
  return (
    <div className="bg-baw-baw-g6 rounded-lg p-4 flex flex-col justify-between items-start flex-1 max-lg:w-full">
      <div className="flex justify-between w-full items-center">
        <div>
          <h1>{vendor1}</h1>
          <p className="font-bold text-xl">{num_vendor1}</p>
        </div>
        <Image src={img1} width={30} height={30} alt="Vendor Image 1" />
      </div>
      <div className="flex justify-between w-full items-center mt-3">
        <div>
          <h1>{vendor2}</h1>
          <p className="font-bold  text-xl">{num_vendor2}</p>
        </div>
        <Image src={img2} width={30} height={30} alt="Vendor Image 2" />
      </div>
    </div>
  );
};

export default Card;
