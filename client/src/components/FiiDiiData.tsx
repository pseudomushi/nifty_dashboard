import React from "react";
import { TrendingUp } from "lucide-react";

interface FiiDiiDataProps {
  diiNetBuy: number;
  fiiNetBuy: number;
  totalNetBuy: number;
  date: string;
}

export default function FiiDiiData({
  diiNetBuy,
  fiiNetBuy,
  totalNetBuy,
  date,
}: FiiDiiDataProps) {
  const maxValue = Math.max(diiNetBuy, fiiNetBuy);
  const diiPercentage = (diiNetBuy / maxValue) * 100;
  const fiiPercentage = (fiiNetBuy / maxValue) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">FII/DII Activity</h3>
        <p className="text-xs text-gray-500">Data as of {date}</p>
      </div>

      <div className="space-y-6">
        {/* DII Data */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Domestic Institutional Investors (DII)</span>
            </div>
            <span className="text-lg font-bold text-blue-600">₹{diiNetBuy.toFixed(2)} Cr</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${diiPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Net buying activity from domestic institutions</p>
        </div>

        {/* FII Data */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-900">Foreign Institutional Investors (FII)</span>
            </div>
            <span className="text-lg font-bold text-green-600">₹{fiiNetBuy.toFixed(2)} Cr</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-green-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${fiiPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Net buying activity from foreign institutions</p>
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-900">Total Net Buying</span>
            <span className="text-xl font-bold text-indigo-600">₹{totalNetBuy.toFixed(2)} Cr</span>
          </div>
          <p className="text-xs text-gray-600 mt-2">Combined institutional buying provides strong support for the market</p>
        </div>
      </div>

      {/* Insight */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-xs text-gray-600 font-semibold uppercase">Institutional Confidence</p>
        <p className="text-sm text-gray-700 mt-2">
          Both FIIs and DIIs were <span className="font-semibold">net buyers</span>, indicating strong institutional confidence in the Indian market. This provides a solid floor for the market and supports bullish trades.
        </p>
      </div>
    </div>
  );
}
