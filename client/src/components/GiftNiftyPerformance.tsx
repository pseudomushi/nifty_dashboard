import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { GiftNiftyData } from "@/lib/marketData";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface GiftNiftyPerformanceProps {
  giftData: GiftNiftyData | any;
  labels: string[];
  niftyPrices: number[];
  giftPrices: number[];
}

export default function GiftNiftyPerformance({
  giftData,
  labels,
  niftyPrices,
  giftPrices,
}: GiftNiftyPerformanceProps) {
  const isPositive = (giftData?.change || 0) >= 0;

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Nifty 50",
          data: niftyPrices,
          borderColor: "rgb(59, 130, 246)", // Blue
          backgroundColor: "rgba(59, 130, 246, 0.05)",
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: "rgb(59, 130, 246)",
          pointBorderColor: "#fff",
          pointBorderWidth: 1,
          borderWidth: 2,
        },
        {
          label: "GIFT Nifty",
          data: giftPrices,
          borderColor: "rgb(168, 85, 247)", // Purple
          backgroundColor: "rgba(168, 85, 247, 0.05)",
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: "rgb(168, 85, 247)",
          pointBorderColor: "#fff",
          pointBorderWidth: 1,
          borderWidth: 2,
        },
      ],
    }),
    [labels, niftyPrices, giftPrices]
  );

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: { size: 12, weight: "normal" as const },
          color: "rgb(107, 114, 128)",
          padding: 15,
        },
      },
      title: {
        display: true,
        text: "Nifty 50 vs GIFT Nifty - 24 Hour Comparison",
        font: { size: 16, weight: "bold" as const },
        color: "rgb(31, 41, 55)",
        padding: { bottom: 20 },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 12, weight: "bold" as const },
        bodyFont: { size: 11 },
        padding: 10,
        displayColors: true,
      } as any,
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          font: { size: 11 },
          color: "rgb(107, 114, 128)",
          callback: function (value: any) {
            return value.toFixed(0);
          },
        },
        grid: {
          color: "rgba(229, 231, 235, 0.5)",
          drawBorder: false,
        },
      },
      x: {
        ticks: {
          font: { size: 11 },
          color: "rgb(107, 114, 128)",
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">GIFT Nifty Performance</h3>

        {/* GIFT Nifty Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {/* Current Price */}
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <p className="text-xs text-gray-600 font-semibold">Current Price</p>
            <p className="text-xl font-bold text-purple-600 mt-1">{(giftData?.currentPrice || 0).toFixed(2)}</p>
          </div>

          {/* Change */}
          <div
            className={`rounded-lg p-3 border ${
              isPositive
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <p className="text-xs text-gray-600 font-semibold">Change</p>
            <div className="flex items-center gap-1 mt-1">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <p className={`text-lg font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                {isPositive ? "+" : ""}{(giftData?.change || 0).toFixed(2)}
              </p>
            </div>
            <p className={`text-xs mt-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {isPositive ? "+" : ""}{(giftData?.changePercent || 0).toFixed(2)}%
            </p>
          </div>

          {/* High */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-gray-600 font-semibold">Day High</p>
                <p className="text-lg font-bold text-blue-600 mt-1">{(giftData?.high || 0).toFixed(2)}</p>
          </div>

          {/* Low */}
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
            <p className="text-xs text-gray-600 font-semibold">Day Low</p>
                <p className="text-lg font-bold text-orange-600 mt-1">{(giftData?.low || 0).toFixed(2)}</p>
          </div>
        </div>

        {/* Timestamp and Additional Info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <p className="text-xs text-gray-600 font-semibold">Last Updated</p>
            <p className="text-sm text-gray-900 font-medium">{giftData?.timestamp || 'N/A'}</p>
          </div>
          <div className="flex gap-4">
            <div>
              <p className="text-xs text-gray-600 font-semibold">Volume</p>
              <p className="text-sm text-gray-900 font-medium">{giftData?.volume || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-semibold">Open Interest</p>
              <p className="text-sm text-gray-900 font-medium">{giftData?.openInterest || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="mb-6">
        <Line data={chartData} options={options} height={300} />
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900">GIFT Nifty Lead</p>
              <p className="text-xs text-blue-800 mt-1">
                GIFT Nifty typically leads the Nifty 50 by 5-10 points. Use it as an early indicator for market direction before NSE opens.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-purple-900">Trading Hours</p>
              <p className="text-xs text-purple-800 mt-1">
                GIFT Nifty trades 24/5 (Monday 6 PM to Friday 4 AM IST). Monitor it for global market signals and overnight movements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
