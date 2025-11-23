import React from "react";
import { NewsItem } from "@/lib/marketData";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface NewsSectionProps {
  news: NewsItem[];
}

export default function NewsSection({ news }: NewsSectionProps) {
  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "positive":
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "negative":
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getImpactBadgeColor = (impact: string) => {
    switch (impact) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactBorderColor = (impact: string) => {
    switch (impact) {
      case "positive":
        return "border-l-green-500";
      case "negative":
        return "border-l-red-500";
      default:
        return "border-l-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Market News & Updates</h3>

      <div className="space-y-4">
        {news.map((item, index) => (
          <div
            key={index}
            className={`border-l-4 ${getImpactBorderColor(
              item.impact
            )} border-r border-t border-b border-gray-200 rounded-r-lg p-4 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">{getImpactIcon(item.impact)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                    {item.title}
                  </h4>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 capitalize ${getImpactBadgeColor(
                      item.impact
                    )}`}
                  >
                    {item.impact}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{item.summary}</p>
                <p className="text-xs text-gray-500">Source: {item.source}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* News Summary */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <p className="text-xs text-gray-600 font-semibold uppercase">News Summary</p>
        <p className="text-sm text-gray-700 mt-2">
          <span className="font-semibold">Positive factors</span> include strong FII inflows and bank stock rallies. <span className="font-semibold">Negative factors</span> include global market weakness and AI valuation concerns. The market is consolidating near all-time highs.
        </p>
      </div>
    </div>
  );
}
