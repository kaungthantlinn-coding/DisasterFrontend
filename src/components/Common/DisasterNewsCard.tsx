import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  MapPin,
  Clock,
  Globe,
  Activity,
  Flame,
  Waves,
  Wind,
  Mountain,
  Zap,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  TrendingUp,
} from "lucide-react";
import { useDisasterNews } from "../../hooks/useDisasterNews";
import {
  DisasterNewsItem,
  disasterNewsService,
} from "../../services/disasterNewsService";
import DisasterDetailModal from "./DisasterDetailModal";
interface DisasterNewsCardsProps {
  className?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  autoSlide?: boolean;
  slideInterval?: number;
  itemsPerSlide?: number;
  maxItems?: number;
  minSeverity?: "low" | "medium" | "high" | "critical";
  showControls?: boolean;
}

const DisasterNewsCards: React.FC<DisasterNewsCardsProps> = ({
  className = "",
  autoRefresh = true,
  refreshInterval = 5 * 60 * 1000,
  autoSlide = true,
  slideInterval = 8000,
  itemsPerSlide = 3,
  maxItems = 20,
  minSeverity,
  showControls = true,
}) => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoSlide);
  const [selectedItem, setSelectedItem] = useState<DisasterNewsItem | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { news, loading, error, lastUpdated, refresh } = useDisasterNews({
    autoRefresh,
    refreshInterval,
    maxItems,
    minSeverity,
  });

  const totalSlides = Math.ceil(news.length / itemsPerSlide);

  // Get appropriate icon for disaster type
  const getDisasterIcon = (
    type: DisasterNewsItem["type"],
    severity?: string
  ) => {
    const iconProps = {
      size: 20,
      className: `${getSeverityColor(severity)}`,
    };

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
        return "text-red-500";
      case "high":
        return "text-orange-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-blue-500";
    }
  };

  // Get severity background
  const getSeverityBackground = (severity?: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 border-red-200 hover:bg-red-100";
      case "high":
        return "bg-orange-50 border-orange-200 hover:bg-orange-100";
      case "medium":
        return "bg-yellow-50 border-yellow-200 hover:bg-yellow-100";
      case "low":
        return "bg-green-50 border-green-200 hover:bg-green-100";
      default:
        return "bg-blue-50 border-blue-200 hover:bg-blue-100";
    }
  };

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Auto-slide functionality
  useEffect(() => {
    if (isPlaying && news.length > itemsPerSlide) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, slideInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isPlaying, news.length, itemsPerSlide, totalSlides, slideInterval]);

  // Navigation functions
  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Modal operations
  const handleItemClick = (item: DisasterNewsItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  if (loading && news.length === 0) {
    return (
      <div
        className={`bg-gradient-to-r from-slate-900 to-blue-900 text-white py-8 ${className}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <RefreshCw className="animate-spin mr-3" size={24} />
            <span className="text-lg font-medium">
              Loading disaster updates...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error && news.length === 0) {
    return (
      <div
        className={`bg-gradient-to-r from-red-900 to-red-800 text-white py-8 ${className}`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <AlertTriangle className="mx-auto mb-4" size={32} />
            <p className="text-lg font-medium mb-4">
              Unable to load disaster updates
            </p>
            <button
              onClick={refresh}
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div
        className={`bg-gradient-to-r from-green-900 to-emerald-800 text-white py-8 ${className}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Globe className="mr-3" size={24} />
            <span className="text-lg font-medium">
              No current disaster alerts - All systems monitoring normally
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-r from-slate-900 via-red-900 to-slate-900 text-white py-6 relative overflow-hidden ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-red-600 px-4 py-2 rounded-full flex items-center shadow-lg mr-4">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-bold uppercase tracking-wider">
                Live Disaster Updates
              </span>
            </div>
            <div className="flex items-center text-white/70 text-sm">
              <TrendingUp size={16} className="mr-2" />
              {news.length} active alerts
            </div>
          </div>

          {showControls && (
            <div className="flex items-center space-x-3">
              <button
                onClick={goToPrevious}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                disabled={totalSlides <= 1}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={togglePlayPause}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              <button
                onClick={goToNext}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                disabled={totalSlides <= 1}
              >
                <ChevronRight size={20} />
              </button>

              <button
                onClick={refresh}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                disabled={loading}
              >
                <RefreshCw
                  size={20}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
            </div>
          )}
        </div>

        {/* News Cards Slider */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {news
                    .slice(
                      slideIndex * itemsPerSlide,
                      (slideIndex + 1) * itemsPerSlide
                    )
                    .map((item, index) => (
                      <div
                        key={`${slideIndex}-${index}`}
                        className={`rounded-xl p-4 border-2 transition-all duration-300 hover:scale-105 cursor-pointer disaster-news-item ${getSeverityBackground(
                          item.severity
                        )} group`}
                        onClick={() => handleItemClick(item)}
                        title="Click for detailed information"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                            {getDisasterIcon(item.type, item.severity)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                              {item.title}
                            </h3>

                            <div className="space-y-1">
                              {item.location && (
                                <div className="flex items-center text-xs text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                                  <MapPin
                                    size={12}
                                    className="mr-1 flex-shrink-0"
                                  />
                                  <span className="truncate">
                                    {item.location}
                                  </span>
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                                  <Clock size={12} className="mr-1" />
                                  {formatTimeAgo(item.timestamp)}
                                </div>

                                <div className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded group-hover:bg-blue-200 group-hover:text-blue-800 transition-colors duration-200">
                                  {item.source}
                                </div>
                              </div>

                              {item.magnitude && (
                                <div className="text-xs font-bold text-red-600 group-hover:text-red-700 transition-colors duration-200">
                                  Magnitude: {item.magnitude}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-blue-600 group-hover:text-blue-800 font-medium transition-colors duration-200 disaster-link">
                                View details
                              </span>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <ExternalLink
                                  size={12}
                                  className="text-blue-600"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Indicators */}
        {totalSlides > 1 && (
          <div className="flex justify-center space-x-2 mt-6">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentSlide
                    ? "w-8 h-2 bg-white rounded-full"
                    : "w-2 h-2 bg-white/40 rounded-full hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}

        {/* Last Updated */}
        {lastUpdated && (
          <div className="flex items-center justify-center text-xs text-white/60 mt-4">
            <Activity size={12} className="mr-1" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Detailed View Modal */}
      <DisasterDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={selectedItem}
      />
    </div>
  );
};

export default DisasterNewsCards;
