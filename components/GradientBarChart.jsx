"use client";
import { AiOutlineStock } from "react-icons/ai";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  defs,
  linearGradient,
  stop,
  Rectangle,
} from "recharts";

const data = [
  { name: "Jan", value: 200000 },
  { name: "Feb", value: 100000 },
  { name: "Mar", value: 280000 },
  { name: "Apr", value: 200000 },
  { name: "May", value: 270000 },
  { name: "Jun", value: 150000 },
  { name: "Jul", value: 220000 },
  { name: "Aug", value: 300000 },
];

const GradientBarChart = ({ lightColor, darkColor, head, count, Icon }) => {
  // Generate a unique id for each chart's gradient
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex-1 mt-3 rounded-lg flex flex-col justify-center items-center px-1 bg-baw-baw-g6 lg:h-[150px] h-[150px] box-border max-lg:w-full">
      <div className="p-2 flex justify-between items-start w-full ">
        <div className="flex flex-col justify-start items-start gap-1">
          <h4 className="text-oohpoint-primary-2 text-sm font-medium">{head}</h4>
          <p className="text-oohpoint-primary-3 text-xl font-bold">{count}</p>
        </div>
        {Icon ? (
          <AiOutlineStock className="text-xl text-green-500" />
        ) : (
          <AiOutlineStock className="text-xl text-red-500" />
        )}
      </div>
      <ResponsiveContainer width="100%" height={80}>
        <BarChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={darkColor} stopOpacity={1} />
              <stop offset="95%" stopColor={lightColor} stopOpacity={1} />
            </linearGradient>
          </defs>
          <Tooltip />
          <Bar
            dataKey="value"
            fill={`url(#${gradientId})`}
            barSize={15}
            radius={[5, 5, 5, 5]}
            background={<Rectangle fill="#F2F0F5" radius={[5, 5, 5, 5]} />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GradientBarChart;
