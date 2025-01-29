"use client";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Dogs", value: 46200 },
  { name: "Fish", value: 33600 },
  { name: "Cats", value: 33800 },
  { name: "Others", value: 29400 },
];

const COLORS = ["#e57373", "#a1887f", "#fff176", "#d7ccc8"];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-sm"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PetOwnersPieChart = () => {
  return (
    <div className="lg:flex-1 flex  flex-col items-center  p-4 rounded-md  mt-4 bg-[#F4F1F0] max-lg:w-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-4  w-full">Pet Owners</h3>
      <div className="flex gap-2 max-lg:w-full max-lg:flex-col max-lg:items-center max-lg:justify-center">
        <PieChart width={180} height={250}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

        <ul className="mt-4 space-y-1">
          {data.map((entry, index) => (
            <li
              key={`legend-${index}`}
              className="flex items-center text-gray-600 text-sm"
            >
              <span
                className="inline-block w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              ></span>
              {`${entry.name}: ${(entry.value / 1000).toFixed(1)}K`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PetOwnersPieChart;
