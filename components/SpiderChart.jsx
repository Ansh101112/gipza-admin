"use client";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  { subject: "Pending", A: 220 },
  { subject: "Active", A: 138},
  { subject: "Inactive", A: 196 },
];

const SpiderChart = ({ head }) => (
  <div className="flex-1 mt-3 rounded-lg flex flex-col justify-center items-center bg-baw-baw-g6 lg:h-[150px] h-[150px] box-border  max-lg:w-full">
    <div className="px-5 pt-8  flex justify-between items-start w-full">
      <div className="flex flex-col justify-start items-start gap-2">
        <h4 className="text-oohpoint-primary-2 font-medium">Vendors</h4> {/* Added Vendors inside div */}
      </div>
    </div>
    <ResponsiveContainer width="100%" height={140}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis />
        <PolarRadiusAxis />
        <Radar
          name="2022"
          dataKey="A"
          stroke="#441886"
          fill="#85716B"
          fillOpacity={1}
        />
      </RadarChart>
    </ResponsiveContainer>
  </div>
);

export default SpiderChart;
