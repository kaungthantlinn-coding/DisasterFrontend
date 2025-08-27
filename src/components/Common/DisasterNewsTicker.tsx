import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';
import { useDisasterNews } from '../../hooks/useDisasterNews';
import { DisasterNewsItem, disasterNewsService } from '../../services/disasterNewsService';
import DisasterDetailModal from './DisasterDetailModal';

interface DisasterNewsTickerProps {
  className?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  speed?: 'slow' | 'medium' | 'fast';
  showControls?: boolean;
  maxItems?: number;
  minSeverity?: 'low' | 'medium' | 'high' | 'critical';
}

const DisasterNewsTicker: React.FC<DisasterNewsTickerProps> = ({
  className = '',
  autoRefresh = true,
  refreshInterval = 5 * 60 * 1000, // 5 minutes
  speed = 'medium',
  showControls = true,
  maxItems = 20,
  minSeverity
}) => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<DisasterNewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { news, loading, error, lastUpdated, refresh } = useDisasterNews({
    autoRefresh,
    refreshInterval,
    maxItems,
    minSeverity
  });

  // Speed configurations
  const speedConfig = {
    slow: { duration: 60, itemDuration: 8000 },
    medium: { duration: 40, itemDuration: 6000 },
    fast: { duration: 30, itemDuration: 4000 }
  };

  const currentSpeed = speedConfig[speed];

  // Get appropriate icon for disaster type
  const getDisasterIcon = (type: DisasterNewsItem['type'], severity?: string) => {
    const iconProps = {
      size: 16,
      className: `mr-2 ${getSeverityColor(severity)}`
    };

    switch (type) {
      case 'earthquake':
        return <Activity {...iconProps} />;
      case 'wildfire':
        return <Flame {...iconProps} />;
      case 'flood':
        return <Waves {...iconProps} />;
      case 'storm':
      case 'cyclone':
        return <Wind {...iconProps} />;
      case 'volcano':
        return <Mountain {...iconProps} />;
      default:
        return <AlertTriangle {...iconProps} />;
    }
  };

  // Get severity color
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  };

  // Get severity background
  const getSeverityBackground = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'high':
        return 'bg-orange-50 border-orange-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Auto-advance ticker
  useEffect(() => {
    if (isPlaying && news.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % news.length);
      }, currentSpeed.itemDuration);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isPlaying, news.length, currentSpeed.itemDuration]);

  // Handle play/pause
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

  // Manual navigation
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % news.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  if (loading && news.length === 0) {
    return (
      <div className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <RefreshCw className="animate-spin mr-2" size={16} />
            <span className="text-sm font-medium">{t('common.loading')} disaster news...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && news.length === 0) {
    return (
      <div className={`bg-gradient-to-r from-red-600 to-red-700 text-white py-3 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <AlertTriangle className="mr-2" size={16} />
            <span className="text-sm font-medium">Failed to load disaster news</span>
            <button 
              onClick={refresh}
              className="ml-3 bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-xs font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className={`bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Globe className="mr-2" size={16} />
            <span className="text-sm font-medium">No recent disaster news - All systems monitoring normally</span>
          </div>
        </div>
      </div>
    );
  }

  const currentNews = news[currentIndex];

  return (
    <div className={`bg-gradient-to-r from-slate-900 via-red-900 to-slate-900 text-white shadow-lg ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center py-3">
          {/* Breaking News Badge */}
          <div className="flex items-center flex-shrink-0 mr-4">
            <div className="bg-red-600 px-3 py-1 rounded-full flex items-center shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              <span className="text-xs font-bold uppercase tracking-wider">
                LIVE ALERTS
              </span>
            </div>
          </div>

          {/* News Content */}
          <div className="flex-1 overflow-hidden" ref={tickerRef}>
            <div 
              className="flex items-center transition-all duration-700 ease-in-out"
              style={{
                transform: `translateX(${currentIndex * 0}%)` // We'll handle this differently for smooth transitions
              }}
            >
              <div 
                className={`flex items-center min-w-full p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer ${getSeverityBackground(currentNews.severity)} text-gray-900 mr-4 group`}
                onClick={() => handleItemClick(currentNews)}
                title="Click for detailed information"
              >
                {getDisasterIcon(currentNews.type, currentNews.severity)}
                
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-sm group-hover:text-blue-600 transition-colors duration-200">
                      {currentNews.title}
                    </span>
                    
                    {currentNews.location && (
                      <div className="flex items-center text-xs text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                        <MapPin size={12} className="mr-1" />
                        {currentNews.location}
                      </div>
                    )}
                    
                    <div className="flex items-center text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                      <Clock size={12} className="mr-1" />
                      {formatTimeAgo(currentNews.timestamp)}
                    </div>
                    
                    <div className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded group-hover:bg-blue-200 group-hover:text-blue-800 transition-colors duration-200">
                      {currentNews.source}
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ExternalLink size={14} className="text-blue-600 hover:text-blue-800" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          {showControls && (
            <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
              <button
                onClick={goToPrevious}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                title="Previous"
              >
                <ChevronRight size={16} className="transform rotate-180" />
              </button>
              
              <button
                onClick={togglePlayPause}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              
              <button
                onClick={goToNext}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                title="Next"
              >
                <ChevronRight size={16} />
              </button>
              
              <button
                onClick={refresh}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                title="Refresh"
                disabled={loading}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
              
              {/* Counter */}
              <div className="text-xs bg-white/10 px-2 py-1 rounded">
                {currentIndex + 1}/{news.length}
              </div>
            </div>
          )}

          {/* Last Updated */}
          {lastUpdated && (
            <div className="hidden lg:flex items-center text-xs text-white/70 ml-4">
              <Activity size={12} className="mr-1" />
              Updated: {lastUpdated.toLocaleTimeString()}
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

      {/* Progress Bar */}
      <div className="h-1 bg-white/20 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-red-400 to-orange-400 transition-all ease-linear"
          style={{
            width: isPlaying ? '100%' : '0%',
            transitionDuration: isPlaying ? `${currentSpeed.itemDuration}ms` : '0ms'
          }}
        />
      </div>
    </div>
  );
};

export default DisasterNewsTicker;