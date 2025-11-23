import React from "react";
import { TechnicalLevels } from "@/lib/marketData";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TechnicalLevelsProps {
  levels: TechnicalLevels;
}

export default function TechnicalLevelsComponent({ levels }: TechnicalLevelsProps) {
  const distanceToR1 = levels.resistance1 - levels.currentPrice;
  const distanceToS1 = levels.currentPrice - levels.support1;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Technical Levels</h3>

      <div className="space-y-4">
        {/* Resistance Levels */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-red-500" />
            Resistance Levels
          </h4>
          <div className="space-y-2 ml-6">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
              <div>
                <p className="text-xs text-gray-600">R2 (Strong Resistance)</p>
                <p className="text-lg font-bold text-red-600">{levels.resistance2.toFixed(2)}</p>
              </div>
              <p className="text-xs text-red-600 font-semibold">
                +{(levels.resistance2 - levels.currentPrice).toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-100 rounded-lg border border-red-300">
              <div>
                <p className="text-xs text-gray-600">R1 (Immediate Resistance)</p>
                <p className="text-lg font-bold text-red-700">{levels.resistance1.toFixed(2)}</p>
              </div>
              <p className="text-xs text-red-700 font-semibold">+{distanceToR1.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Current Price */}
        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border-2 border-blue-500">
          <div>
            <p className="text-xs text-gray-600 font-semibold">Current Price</p>
            <p className="text-2xl font-bold text-blue-600">{levels.currentPrice.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">Nifty 50</p>
            <p className="text-sm text-gray-500">Nov 21, 2025</p>
          </div>
        </div>

        {/* Support Levels */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-green-500" />
            Support Levels
          </h4>
          <div className="space-y-2 ml-6">
            <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg border border-green-300">
              <div>
                <p className="text-xs text-gray-600">S1 (Immediate Support)</p>
                <p className="text-lg font-bold text-green-700">{levels.support1.toFixed(2)}</p>
              </div>
              <p className="text-xs text-green-700 font-semibold">-{distanceToS1.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="text-xs text-gray-600">S2 (Strong Support)</p>
                <p className="text-lg font-bold text-green-600">{levels.support2.toFixed(2)}</p>
              </div>
              <p className="text-xs text-green-600 font-semibold">
                -{(levels.currentPrice - levels.support2).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insight */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-xs text-gray-600 font-semibold">Key Insight</p>
        <p className="text-sm text-gray-700 mt-2">
          The index is positioned between strong support (26,050-26,100) and strong resistance (26,280-26,350). High probability of consolidation and volatility within this range.
        </p>
      </div>
    </div>
  );
}
