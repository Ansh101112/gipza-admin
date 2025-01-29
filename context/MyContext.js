"use client";
import React, { createContext, useState } from "react";

const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <MyContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyProvider };
