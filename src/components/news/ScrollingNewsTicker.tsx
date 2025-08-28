import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Play, Pause, RotateCcw } from 'lucide-react';

interface NewsItem {
  id: string;
  text: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  timestamp: string;
}

interface ScrollingNewsTickerProps {
  news?: NewsItem[];
  speed?: number;
  height?: string;
  backgroundColor?: string;
  textColor?: string;
}

export const ScrollingNewsTicker: React.FC<ScrollingNewsTickerProps> = ({
  news = [],
  speed = 50,
  height = '40px',
  backgroundColor = 'bg-red-600',
  textColor = 'text-white'
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(0);
  const tickerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Mock news data
  const mockNews: NewsItem[] = [
    {
      id: '1',
      text: '🚨 URGENT: Severe flooding in Yangon Region - Evacuation centers now open',
      severity: 'Critical',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      text: '⚠️ Earthquake monitoring continues in Mandalay - Magnitude 5.2 recorded',
      severity: 'High',
      timestamp: new Date().toISOString()
    },
    {
      id: '3',
      text: '🌀 Cyclone warning for coastal areas - Residents advised to prepare emergency kits',
      severity: 'High',
      timestamp: new Date().toISOString()
    }
  ];

  const displayNews = news.length > 0 ? news : mockNews;
  const newsText = displayNews.map(item => item.text).join(' • ');

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentPosition(prev => {
        const contentWidth = contentRef.current?.scrollWidth || 0;
        const containerWidth = tickerRef.current?.clientWidth || 0;
        
        if (prev <= -(contentWidth + containerWidth)) {
          return containerWidth;
        }
        return prev - 1;
      });
    }, 100 - speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentPosition(0);
  };

  return (
    <div className={`${backgroundColor} ${textColor} relative overflow-hidden`} style={{ height }}>
      <div className="flex items-center h-full">
        {/* Controls */}
        <div className="flex items-center gap-2 px-4 border-r border-white/20">
          <AlertTriangle className="h-4 w-4 animate-pulse" />
          <span className="text-sm font-semibold">LIVE</span>
        </div>

        {/* Scrolling Content */}
        <div 
          ref={tickerRef}
          className="flex-1 relative overflow-hidden h-full"
        >
          <div
            ref={contentRef}
            className="absolute whitespace-nowrap flex items-center h-full text-sm font-medium"
            style={{
              transform: `translateX(${currentPosition}px)`,
              transition: isPlaying ? 'none' : 'transform 0.3s ease'
            }}
          >
            {newsText}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-1 px-2 border-l border-white/20">
          <button
            onClick={handlePlayPause}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3" />
            )}
          </button>
          <button
            onClick={handleReset}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
