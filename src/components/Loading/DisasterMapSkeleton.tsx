import React from 'react';

interface DisasterMapSkeletonProps {
  height?: string;
  className?: string;
}

const DisasterMapSkeleton: React.FC<DisasterMapSkeletonProps> = ({ 
  height = "400px", 
  className = "" 
}) => {
  return (
    <div className={`relative ${className}`}>
      <div 
        style={{ height }}
        className="bg-gray-200 rounded-lg overflow-hidden animate-pulse"
      >
        {/* Map background skeleton */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400"></div>
        
        {/* Skeleton markers */}
        <div className="absolute top-16 left-20">
          <div className="w-6 h-6 bg-gray-400 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute top-24 right-32">
          <div className="w-6 h-6 bg-gray-400 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute bottom-20 left-32">
          <div className="w-6 h-6 bg-gray-400 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute top-32 left-1/2">
          <div className="w-6 h-6 bg-gray-400 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute bottom-32 right-20">
          <div className="w-6 h-6 bg-gray-400 rounded-full animate-pulse"></div>
        </div>
        
        {/* Controls skeleton */}
        <div className="absolute top-4 right-4 space-y-2">
          <div className="w-8 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
        </div>
        
        {/* Legend skeleton */}
        <div className="absolute bottom-4 left-4 bg-gray-300 rounded-lg p-3 animate-pulse">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-16 h-3 bg-gray-400 rounded"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-12 h-3 bg-gray-400 rounded"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-14 h-3 bg-gray-400 rounded"></div>
            </div>
          </div>
        </div>
        
        {/* Loading indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700 font-medium">Loading disaster data...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisasterMapSkeleton;
