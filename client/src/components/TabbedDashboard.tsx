import React, { useState } from "react";
import { BarChart3, TrendingUp, ListChecks } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface TabbedDashboardProps {
  marketAnalysisContent: React.ReactNode;
  optionsTradesContent: React.ReactNode;
  watchlistContent: React.ReactNode;
}

export default function TabbedDashboard({
  marketAnalysisContent,
  optionsTradesContent,
  watchlistContent,
}: TabbedDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>("market-analysis");

  const tabs: Tab[] = [
    {
      id: "market-analysis",
      label: "Market Analysis",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: "options-trades",
      label: "Options Trades",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: "watchlist",
      label: "Trade Watchlist",
      icon: <ListChecks className="w-5 h-5" />,
    },
  ];

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-border bg-muted/50">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-card text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "market-analysis" && (
          <div className="animate-fadeIn">{marketAnalysisContent}</div>
        )}
        {activeTab === "options-trades" && (
          <div className="animate-fadeIn">{optionsTradesContent}</div>
        )}
        {activeTab === "watchlist" && (
          <div className="animate-fadeIn">{watchlistContent}</div>
        )}
      </div>
    </div>
  );
}
