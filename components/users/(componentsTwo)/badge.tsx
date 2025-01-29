import React from 'react';

const Badge = ({ children, className }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ${className}`}>
      {children}
    </span>
  );
};

export default Badge;