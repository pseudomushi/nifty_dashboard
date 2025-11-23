import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { MarketAnalysis } from "@/lib/marketData";

interface MarketMetricsProps {
  analysis: MarketAnalysis;
}

export default function MarketMetrics({ analysis }: MarketMetricsProps) {
  const isPositive = analysis.change >= 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Current Price */}
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
        <p className="text-xs text-gray-600 font-semibold uppercase">Current Price</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{analysis.currentPrice.toFixed(2)}</p>
        <p className="text-xs text-gray-500 mt-1">Nifty 50</p>
      </div>

      {/* Change */}
      <div
        className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
          isPositive ? "border-green-500" : "border-red-500"
        }`}
      >
        <p className="text-xs text-gray-600 font-semibold uppercase">Change</p>
        <div className="flex items-center gap-2 mt-2">
          {isPositive ? (
            <ArrowUp className="w-5 h-5 text-green-600" />
          ) : (
            <ArrowDown className="w-5 h-5 text-red-600" />
          )}
          <p className={`text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? "+" : ""}{analysis.change.toFixed(2)}
          </p>
        </div>
        <p className={`text-xs mt-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {isPositive ? "+" : ""}{analysis.changePercent.toFixed(2)}%
        </p>
      </div>

      {/* Day High */}
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
        <p className="text-xs text-gray-600 font-semibold uppercase">Day High</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{analysis.dayHigh.toFixed(2)}</p>
        <p className="text-xs text-gray-500 mt-1">52W High: 26,246.65</p>
      </div>

      {/* Day Low */}
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
        <p className="text-xs text-gray-600 font-semibold uppercase">Day Low</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{analysis.dayLow.toFixed(2)}</p>
        <p className="text-xs text-gray-500 mt-1">52W Low: 21,743.65</p>
      </div>
    </div>
  );
}
