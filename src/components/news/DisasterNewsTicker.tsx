import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, MapPin, Volume2, VolumeX } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  location: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  timestamp: string;
  type: string;
}

interface DisasterNewsTickerProps {
  news?: NewsItem[];
  autoScroll?: boolean;
  scrollSpeed?: number;
}

export const DisasterNewsTicker: React.FC<DisasterNewsTickerProps> = ({
  news = [],
  autoScroll = true,
  scrollSpeed = 50
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Mock news data if none provided
  const mockNews: NewsItem[] = [
    {
      id: '1',
      title: 'Severe flooding reported in Yangon Region - Emergency shelters activated',
      location: 'Yangon',
      severity: 'High',
      timestamp: new Date().toISOString(),
      type: 'Flood'
    },
    {
      id: '2',
      title: 'Earthquake monitoring continues in Mandalay - No immediate threats',
      location: 'Mandalay',
      severity: 'Medium',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      type: 'Earthquake'
    },
    {
      id: '3',
      title: 'Cyclone warning issued for coastal areas - Residents advised to prepare',
      location: 'Rakhine State',
      severity: 'Critical',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      type: 'Cyclone'
    }
  ];

  const displayNews = news.length > 0 ? news : mockNews;

  useEffect(() => {
    if (!autoScroll || isPaused || displayNews.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayNews.length);
    }, scrollSpeed * 100);

    return () => clearInterval(interval);
  }, [autoScroll, isPaused, displayNews.length, scrollSpeed]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    const baseClasses = "h-4 w-4";
    switch (severity) {
      case 'Critical':
      case 'High':
        return <AlertTriangle className={`${baseClasses} text-red-500 animate-pulse`} />;
      case 'Medium':
        return <AlertTriangle className={`${baseClasses} text-orange-500`} />;
      default:
        return <AlertTriangle className={`${baseClasses} text-yellow-500`} />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (displayNews.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-center">No emergency alerts at this time</p>
      </div>
    );
  }

  const currentNews = displayNews[currentIndex];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span className="font-semibold text-sm">EMERGENCY ALERTS</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-white hover:text-gray-200 transition-colors"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? '▶️' : '⏸️'}
          </button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-white hover:text-gray-200 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {getSeverityIcon(currentNews.severity)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(currentNews.severity)}`}>
                {currentNews.severity}
              </span>
              <span className="text-xs text-gray-500 uppercase font-medium">
                {currentNews.type}
              </span>
            </div>
            
            <h3 className="text-sm font-medium text-gray-900 leading-tight mb-2">
              {currentNews.title}
            </h3>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{currentNews.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(currentNews.timestamp)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation dots */}
        {displayNews.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {displayNews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-red-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        {displayNews.length > 1 && (
          <div className="text-center mt-2">
            <span className="text-xs text-gray-500">
              {currentIndex + 1} of {displayNews.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
