"use client";
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Point 1', value: 400 },
  { name: 'Point 2', value: 300 },
  { name: 'Point 3', value: 500 },
  { name: 'Point 4', value: 700 },  // Highlight this point
  { name: 'Point 5', value: 600 },
  { name: 'Point 6', value: 800 },
];

const CustomLineChart = () => {
  return (
    <div className="flex-1 mt-3 rounded-lg flex flex-col bg-baw-baw-g6 lg:h-[150px] h-[200px] box-border p-2 max-lg:w-full">
      {/* Header Text aligned to the left */}
      <div className="w-full text-left mb-1">
        <h4 className="text-sm font-semibold text-gray-600">Savings</h4>
        <p className="text-lg font-bold text-gray-800">Rs. 7000</p>
      </div>

      {/* Responsive Container for the Line Chart */}
      <div className="flex justify-center items-center w-full">
        <ResponsiveContainer width="100%" height={60}>
          <LineChart data={data}>
            {/* Grid for Reference */}
            <CartesianGrid strokeDasharray="3 3" />

            {/* Axes */}
            <XAxis dataKey="name" hide />
            <YAxis hide />

            {/* Line with Custom Active Dot */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#85716B"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#8b5cf6' }} // Customize active dot size
            />

            {/* Tooltip */}
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Highlight for Specific Point */}
      <div className="relative mt-2">
        {/* Highlight Dot */}
        <div
          className="absolute left-[60%] top-0 w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center"
          style={{ transform: 'translateY(-50%)' }}
        >
          <div className="w-2 h-2 bg-gray-800 rounded-full" />
        </div>
        {/* Line Indicator for the Highlight */}
        <div className="h-8 bg-gray-200 w-0.5 mx-auto"></div>
      </div>
    </div>
  );
};

export default CustomLineChart;
