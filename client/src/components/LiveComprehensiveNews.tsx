import React, { useState } from "react";
import { LiveNewsItem } from "@/lib/liveMarketData";
import { TrendingUp, TrendingDown, Minus, Globe, Flag, TrendingUpIcon, ExternalLink } from "lucide-react";

interface LiveComprehensiveNewsProps {
  news: LiveNewsItem[];
}

export default function LiveComprehensiveNews({ news }: LiveComprehensiveNewsProps) {
  const [activeTab, setActiveTab] = useState<"all" | "international" | "national" | "market">("all");

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "positive":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "negative":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "international":
        return <Globe className="w-4 h-4" />;
      case "national":
        return <Flag className="w-4 h-4" />;
      default:
        return <TrendingUpIcon className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "international":
        return "bg-blue-100 text-blue-800";
      case "national":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case "high":
        return "border-l-4 border-red-500";
      case "medium":
        return "border-l-4 border-yellow-500";
      default:
        return "border-l-4 border-gray-400";
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

  const internationalNews = news.filter((n) => n.category === "international");
  const nationalNews = news.filter((n) => n.category === "national");
  const marketNews = news.filter((n) => n.category === "market");

  const allNews = [...news].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getNewsToDisplay = () => {
    switch (activeTab) {
      case "international":
        return internationalNews;
      case "national":
        return nationalNews;
      case "market":
        return marketNews;
      default:
        return allNews;
    }
  };

  const newsToDisplay = getNewsToDisplay();

  const renderNewsItem = (item: LiveNewsItem) => (
    <div
      key={item.id}
      className={`${getRelevanceColor(
        item.relevance
      )} bg-white rounded-r-lg p-4 hover:shadow-md transition-shadow border-r border-t border-b border-gray-200`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1 flex items-center gap-2">
          {getImpactIcon(item.impact)}
          <div className={`p-1.5 rounded ${getCategoryColor(item.category)}`}>
            {getCategoryIcon(item.category)}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold text-gray-900 text-sm leading-tight">{item.title}</h4>
            <div className="flex gap-2 flex-shrink-0">
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap capitalize ${getImpactBadgeColor(
                  item.impact
                )}`}
              >
                {item.impact}
              </span>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-800 whitespace-nowrap">
                {item.relevance}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-3">{item.summary}</p>

          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500">
                <span className="font-semibold">Source:</span> {item.source}
              </p>
              {/* Clickable source URL */}
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                title="Click to verify source"
              >
                Verify
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-gray-500">{item.timestamp}</p>
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Live Market News & Global Events</h3>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors ${
            activeTab === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All News ({allNews.length})
        </button>
        <button
          onClick={() => setActiveTab("international")}
          className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === "international"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Globe className="w-4 h-4" />
          International ({internationalNews.length})
        </button>
        <button
          onClick={() => setActiveTab("national")}
          className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === "national"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Flag className="w-4 h-4" />
          National ({nationalNews.length})
        </button>
        <button
          onClick={() => setActiveTab("market")}
          className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === "market"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <TrendingUpIcon className="w-4 h-4" />
          Market ({marketNews.length})
        </button>
      </div>

      {/* Live Data Indicator */}
      <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
        <p className="text-xs text-green-800 font-semibold">Live Data - Updated in Real-Time</p>
      </div>

      {/* News Items */}
      <div className="space-y-4">
        {newsToDisplay.length > 0 ? (
          newsToDisplay.map((item) => renderNewsItem(item))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No news items available</p>
          </div>
        )}
      </div>

      {/* News Summary by Category */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-900">International</h4>
          </div>
          <p className="text-sm text-blue-800">
            {internationalNews.filter((n) => n.impact === "positive").length} positive,{" "}
            {internationalNews.filter((n) => n.impact === "negative").length} negative factors
          </p>
        </div>

        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <Flag className="w-5 h-5 text-orange-600" />
            <h4 className="font-semibold text-orange-900">National</h4>
          </div>
          <p className="text-sm text-orange-800">
            {nationalNews.filter((n) => n.impact === "positive").length} positive,{" "}
            {nationalNews.filter((n) => n.impact === "negative").length} negative factors
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUpIcon className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-900">Market</h4>
          </div>
          <p className="text-sm text-green-800">
            {marketNews.filter((n) => n.impact === "positive").length} positive,{" "}
            {marketNews.filter((n) => n.impact === "negative").length} negative factors
          </p>
        </div>
      </div>
    </div>
  );
}
