"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { name: "Aug 14", uv: 4500 },
  { name: "Aug 15", uv: 4000 },
  { name: "Aug 16", uv: 5900 }, // Highlight this
  { name: "Aug 17", uv: 3000 },
  { name: "Aug 18", uv: 1500 },
  { name: "Aug 19", uv: 2000 },
  { name: "Aug 20", uv: 4500 },
  { name: "Aug 21", uv: 4300 },
];

// Custom tooltip (optional)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded-lg shadow-md">
        <p className="text-gray-800 font-semibold">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const Example = () => {
  return (
    <div
      style={{
        backgroundColor: "#fdf1ec",
        padding: "20px",
        borderRadius: "10px",
      }}
      className="flex-1 w-[59%] mt-3 rounded-lg flex flex-col bg-baw-baw-g6 box-border p-2 max-lg:w-full"
    >
      <h3 className="text-gray-800 text-lg font-semibold mb-2">New Users</h3>
      <div className="text-red-500 flex items-center mb-4">
        <div className="bg-red-100 px-2 py-1 rounded-full text-sm mr-2">
          -0.1%
        </div>
        <p className="text-gray-600">From Last Period</p>
        <div className="w-full flex justify-end mt-2">
          <button className="text-gray-600 hover:text-black">View Report</button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}> {/* Minimized height */}
        <BarChart
          data={data}
          margin={{
            top: 10, // Reduced top margin
            right: 30,
            left: 0,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#9c8b84" }} tickLine={false} />
          <YAxis hide domain={[0, 7000]} /> {/* Set the max Y-axis range */}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(255, 255, 255, 0.2)" }}
          />

          {/* Adjust bar size and radius to create minimized bars */}
          <Bar dataKey="uv" fill="#c8b3a8" radius={[50, 50, 0, 0]} barSize={50}> {/* Smaller barSize */}
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.name === "Aug 16" ? "#4a403a" : "#c8b3a8"} // Highlight bar color
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Example;
