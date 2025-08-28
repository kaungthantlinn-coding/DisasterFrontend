import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  MapPin,
  Clock,
  Activity,
  Flame,
  Waves,
  Wind,
  Mountain,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useDisasterNews } from "../../hooks/useDisasterNews";
import {
  DisasterNewsItem,
  disasterNewsService,
} from "../../services/disasterNewsService";
import DisasterDetailModal from "./DisasterDetailModal";

interface ScrollingNewsTickerProps {
  className?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  speed?: "slow" | "medium" | "fast";
  maxItems?: number;
  minSeverity?: "low" | "medium" | "high" | "critical";
  showSource?: boolean;
  showLocation?: boolean;
  showTime?: boolean;
}

const ScrollingNewsTicker: React.FC<ScrollingNewsTickerProps> = ({
  className = "",
  autoRefresh = true,
  refreshInterval = 5 * 60 * 1000,
  speed = "medium",
  maxItems = 30,
  minSeverity,
  showSource = true,
  showLocation = true,
  showTime = true,
}) => {
  const { t } = useTranslation();
  const [animationDuration, setAnimationDuration] = useState(60);
  const [selectedItem, setSelectedItem] = useState<DisasterNewsItem | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { news, loading, error, refresh } = useDisasterNews({
    autoRefresh,
    refreshInterval,
    maxItems,
    minSeverity,
  });

  // Handle modal operations
  const handleItemClick = (item: DisasterNewsItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // Speed configurations (seconds for full scroll)
  const speedConfig = {
    slow: 80,
    medium: 60,
    fast: 40,
  };

  useEffect(() => {
    setAnimationDuration(speedConfig[speed]);
  }, [speed]);

  // Get appropriate icon for disaster type
  const getDisasterIcon = (type: DisasterNewsItem["type"]) => {
    const iconProps = { size: 14, className: "mr-1" };

    switch (type) {
      case "earthquake":
        return <Activity {...iconProps} />;
      case "wildfire":
        return <Flame {...iconProps} />;
      case "flood":
        return <Waves {...iconProps} />;
      case "storm":
      case "cyclone":
        return <Wind {...iconProps} />;
      case "volcano":
        return <Mountain {...iconProps} />;
      default:
        return <AlertTriangle {...iconProps} />;
    }
  };

  // Get severity color
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400";
      case "high":
        return "text-orange-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-blue-400";
    }
  };

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  // Create news items text with clickable links
  const createNewsText = () => {
    if (news.length === 0)
      return "No recent disaster alerts - All systems monitoring normally";

    return news
      .map((item, index) => {
        const parts = [];

        // Add icon and title
        parts.push(item.title);

        // Add location if enabled and available
        if (showLocation && item.location) {
          parts.push(`📍 ${item.location}`);
        }

        // Add source if enabled
        if (showSource) {
          parts.push(`[${item.source}]`);
        }

        // Add time if enabled
        if (showTime) {
          parts.push(`⏱️ ${formatTimeAgo(item.timestamp)}`);
        }

        return parts.join(" • ");
      })
      .join(" ••• ");
  };

  // Create clickable news items
  const createClickableNewsItems = () => {
    if (news.length === 0) {
      return (
        <span className="text-white/90">
          No recent disaster alerts - All systems monitoring normally
        </span>
      );
    }

    return news.map((item, index) => {
      const parts = [];

      // Add title
      parts.push(item.title);

      // Add location if enabled and available
      if (showLocation && item.location) {
        parts.push(`📍 ${item.location}`);
      }

      // Add source if enabled
      if (showSource) {
        parts.push(`[${item.source}]`);
      }

      // Add time if enabled
      if (showTime) {
        parts.push(`⏱️ ${formatTimeAgo(item.timestamp)}`);
      }

      const content = parts.join(" • ");

      return (
        <React.Fragment key={index}>
          <button
            onClick={() => handleItemClick(item)}
            className="inline-block hover:bg-white/20 hover:text-blue-200 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out px-2 py-1 rounded cursor-pointer border border-transparent hover:border-white/30 hover:backdrop-blur-sm disaster-link"
            title="Click for detailed information"
          >
            {content}
          </button>
          {index < news.length - 1 && (
            <span className="mx-2 text-white/60">•••</span>
          )}
        </React.Fragment>
      );
    });
  };

  if (loading && news.length === 0) {
    return (
      <div
        className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 overflow-hidden ${className}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <RefreshCw className="animate-spin mr-2" size={16} />
            <span className="text-sm font-medium">
              Loading live disaster alerts...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error && news.length === 0) {
    return (
      <div
        className={`bg-gradient-to-r from-red-600 to-red-700 text-white py-2 overflow-hidden ${className}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <AlertTriangle className="mr-2" size={16} />
            <span className="text-sm font-medium">
              Unable to load disaster news
            </span>
            <button
              onClick={refresh}
              className="ml-3 bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-xs font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const newsText = createNewsText();

  return (
    <div
      className={`bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white py-2 overflow-hidden relative ${className}`}
    >
      {/* Breaking News Label */}
      <div className="absolute left-0 top-0 bottom-0 bg-red-600 flex items-center px-4 z-10 shadow-lg">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap">
            BREAKING
          </span>
        </div>
      </div>

      {/* Scrolling Content */}
      <div className="ml-20 overflow-hidden">
        <div
          className="whitespace-nowrap text-sm font-medium py-1 animate-scroll-left flex items-center"
          style={{
            animationDuration: `${animationDuration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        >
          {createClickableNewsItems()}
          <span className="mx-4 text-white/60">•••</span>
          {createClickableNewsItems()}
          <span className="mx-4 text-white/60">•••</span>
          {createClickableNewsItems()}
        </div>
      </div>

      <button
        onClick={refresh}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors z-10"
        title="Refresh news"
        disabled={loading}
      >
        <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
      </button>

      {/* Detailed View Modal */}
      <DisasterDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={selectedItem}
      />
    </div>
  );
};

export default ScrollingNewsTicker;
