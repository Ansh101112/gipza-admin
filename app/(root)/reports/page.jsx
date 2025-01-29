"use client";
import React from "react";
import Image from "next/image";
import upIcon from "../../../public/up.png";
import userIcon from "../../../public/user.png";
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

const Reports = () => {
  const data = {
    salesData: [
      { month: "Jan", sales: 10000 },
      { month: "Feb", sales: 15000 },
      { month: "Mar", sales: 14000 },
      { month: "Apr", sales: 17000 },
      { month: "May", sales: 19000 },
      { month: "Jun", sales: 18000 },
      { month: "Jul", sales: 16000 },
      { month: "Aug", sales: 17000 },
      { month: "Sep", sales: 15500 },
      { month: "Oct", sales: 17500 },
      { month: "Nov", sales: 20000 },
      { month: "Dec", sales: 22000 },
    ],
    profitData: [
      { month: "Jan", profit: 90000 },
      { month: "Feb", profit: 120000 },
      { month: "Mar", profit: 95000 },
      { month: "Apr", profit: 100000 },
      { month: "May", profit: 140000 },
      { month: "Jun", profit: 135000 },
      { month: "Jul", profit: 130000 },
      { month: "Aug", profit: 110000 },
      { month: "Sep", profit: 120000 },
      { month: "Oct", profit: 150000 },
      { month: "Nov", profit: 160000 },
      { month: "Dec", profit: 180000 },
    ],
    recentOrders: [
      { id: "#A1008", product: "Dog Feeder", quantity: 15, sales: 1024, image: "/dog-feeder.png" },
      { id: "#A1009", product: "Cat Milk", quantity: 15, sales: 1024, image: "/cat-milk.png" },
      { id: "#A1010", product: "Bird Cage", quantity: 15, sales: 1024, image: "/bird-cage.png" },
      { id: "#A1011", product: "Bones Toffee", quantity: 15, sales: 1024, image: "/bones-toffee.png" },
    ],
    cards: [
      { title: "Profit", value: "$1,068,900", percentage: "3%", icon: upIcon },
      { title: "Sales Account", value: "$192,065", previous: "$132,000 last year", icon: upIcon },
      { title: "General Leads", value: "$192,065", previous: "$132,000 last year", icon: upIcon },
      { title: "Churn Rate", value: "$192,065", previous: "$132,000 last year", icon: upIcon },
      { title: "Returning Users", value: "$192,065", previous: "$132,000 last year", icon: upIcon },
    ],
  };

  const maxSales = Math.max(...data.salesData.map(item => item.sales));
  const maxProfit = Math.max(...data.profitData.map(item => item.profit));

  return (
    <div className="max-w-7xl mx-auto p-6 bg-[#F8F8F8]">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#4D413E]">Reports</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search"
            className="p-2 border rounded-lg text-gray-600"
          />
          <button className="bg-gray-300 p-2 rounded-lg text-[#4D413E]">Export</button>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        {/* Sales Bar Graph */}
        <div className="w-full lg:w-2/3 bg-white rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-semibold text-[#7b625a]">Sales in year</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={data.salesData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#9c8b84" }} tickLine={false} />
              <YAxis hide domain={[0, maxSales]} />
              <Tooltip />
              <Bar dataKey="sales" fill="#6D4C41" radius={[10, 10, 0, 0]} barSize={30}>
                {data.salesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.month === "Dec" ? "#4a403a" : "#6D4C41"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders */}
        <div className="w-full lg:w-1/3 bg-white rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-semibold text-[#7b625a]">Recent Orders</h2>
          <ul>
            {data.recentOrders.map((order) => (
              <li key={order.id} className="flex items-center justify-between p-2">
                <Image src={order.image} alt={order.product} width={50} height={50} className="rounded" />
                <div className="flex-1 ml-4">
                  <h3 className="font-semibold">{order.product}</h3>
                  <p className="text-gray-600">{order.id}</p>
                </div>
                <p>{order.sales} Sales</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        {/* Profit Bar Graph */}
        <div className="bg-white p-4 rounded-xl shadow-md lg:col-span-1">
          <h3 className="text-lg font-semibold text-[#7b625a]">Profit</h3>
          <p className="text-2xl font-bold mt-2">$1,068,900</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={data.profitData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#9c8b84" }} tickLine={false} />
              <YAxis hide domain={[0, maxProfit]} />
              <Tooltip />
              <Bar dataKey="profit" fill="#795548" radius={[10, 10, 0, 0]} barSize={30}>
                {data.profitData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.month === "Dec" ? "#4a403a" : "#795548"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right-side cards in 2-column, 2-row format */}
        <div className="grid lg:grid-cols-2 gap-4 lg:col-span-2">
          {data.cards.slice(1).map((card, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#7b625a]">{card.title}</h3>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-gray-600">{card.previous}</p>
              </div>
              <Image src={card.icon} alt={card.title} width={24} height={24} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
