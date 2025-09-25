import { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const FinancialAnalysisChart = () => {
  const [activeSeries, setActiveSeries] = useState("all"); // 'all' is the default view

  const data = [
    {
      month: "Apr",
      income: 125000,
      expenses: 87000,
      profitMargin: 30.4,
      growthRate: 12.5,
    },
    {
      month: "May",
      income: 142000,
      expenses: 92000,
      profitMargin: 35.2,
      growthRate: 13.6,
    },
    {
      month: "Jun",
      income: 138000,
      expenses: 89000,
      profitMargin: 35.5,
      growthRate: 9.5,
    },
    {
      month: "Jul",
      income: 165000,
      expenses: 95000,
      profitMargin: 42.4,
      growthRate: 19.6,
    },
    {
      month: "Aug",
      income: 152000,
      expenses: 91000,
      profitMargin: 40.1,
      growthRate: 10.0,
    },
    {
      month: "Sep",
      income: 178000,
      expenses: 98000,
      profitMargin: 44.9,
      growthRate: 17.1,
    },
  ].map((d) => ({ ...d, netProfit: d.income - d.expenses }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg w-64 font-sans">
          <p className="font-bold text-slate-800 text-lg mb-2">
            {label} 2025 Financial Summary
          </p>
          <div className="space-y-2">
            {payload.map((pld: any) => (
              <div
                key={pld.dataKey}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center">
                  <div
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: pld.stroke || pld.fill }}
                  ></div>
                  <span className="text-slate-600">{pld.name}:</span>
                </div>
                <span className="font-semibold text-slate-800">
                  {pld.dataKey === "profitMargin" ||
                  pld.dataKey === "growthRate"
                    ? `${pld.value}%`
                    : `₹${pld.value.toLocaleString()}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative overflow-hidden w-full bg-white/80 p-6 rounded-2xl border my-4 backdrop-blur-md shadow-xl font-sans">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-emerald-800"></div>

      <div>
        <h3 className="font-bold text-xl text-slate-800 mb-1 ml-2">
          Interactive Financial Analysis
        </h3>
        <p className="text-sm text-slate-500 mb-4 ml-2">
          Six Month Business Summary (2025)
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-4 p-1 bg-slate-100 rounded-full">
        <button
          onClick={() => setActiveSeries("all")}
          className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${
            activeSeries === "all"
              ? "bg-slate-800 text-white shadow"
              : "text-slate-600 hover:bg-slate-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveSeries("income")}
          className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${
            activeSeries === "income"
              ? "bg-green-500 text-white shadow"
              : "text-green-700 hover:bg-green-100"
          }`}
        >
          Income
        </button>
        <button
          onClick={() => setActiveSeries("expenses")}
          className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${
            activeSeries === "expenses"
              ? "bg-red-500 text-white shadow"
              : "text-red-700 hover:bg-red-100"
          }`}
        >
          Expenses
        </button>
        <button
          onClick={() => setActiveSeries("netProfit")}
          className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${
            activeSeries === "netProfit"
              ? "bg-blue-600 text-white shadow"
              : "text-blue-700 hover:bg-blue-100"
          }`}
        >
          Net Profit
        </button>
        <button
          onClick={() => setActiveSeries("profitMargin")}
          className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${
            activeSeries === "profitMargin"
              ? "bg-purple-500 text-white shadow"
              : "text-purple-700 hover:bg-purple-100"
          }`}
        >
          Profit Margin
        </button>
      </div>

      <div className="w-full h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 5, right: 20, left: -10, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNetProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient
                id="colorProfitMargin"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              dy={10}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              unit=" ₹"
              width={80}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b" }}
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-IN", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value)
              }
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              unit="%"
              domain={[0, 50]}
              width={50}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(241, 245, 249, 0.7)" }}
            />

            {(activeSeries === "all" || activeSeries === "income") && (
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="income"
                name="Income"
                fill="url(#colorIncome)"
                stroke="#22c55e"
                strokeWidth={3}
              />
            )}
            {(activeSeries === "all" || activeSeries === "expenses") && (
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                fill="url(#colorExpenses)"
                stroke="#ef4444"
                strokeWidth={3}
              />
            )}
            {(activeSeries === "all" || activeSeries === "netProfit") && (
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="netProfit"
                name="Net Profit"
                fill="url(#colorNetProfit)"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            )}
            {(activeSeries === "all" || activeSeries === "profitMargin") && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="profitMargin"
                name="Profit Margin"
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialAnalysisChart;
