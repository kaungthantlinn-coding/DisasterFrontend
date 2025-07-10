import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';

interface ViewReportsButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  animated?: boolean;
}

const ViewReportsButton: React.FC<ViewReportsButtonProps> = ({
  className = "",
  variant = "primary",
  size = "md",
  showIcon = true,
  animated = true,
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-lg";
      case "secondary":
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 shadow-sm hover:shadow-lg";
      case "outline":
        return "border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white";
      default:
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-lg";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-4 py-2 text-sm";
      case "md":
        return "px-6 py-3 text-base";
      case "lg":
        return "px-8 py-4 text-lg";
      default:
        return "px-6 py-3 text-base";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return 16;
      case "md":
        return 20;
      case "lg":
        return 24;
      default:
        return 20;
    }
  };

  const handleClick = () => {
    navigate('/reports');
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group font-semibold rounded-xl transition-all duration-200 flex items-center justify-center
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${animated ? 'transform hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      View All Reports
      {showIcon && (
        <ArrowRight 
          size={getIconSize()} 
          className="ml-2 group-hover:translate-x-1 transition-transform" 
        />
      )}
    </button>
  );
};

// Alternative card-style component
export const ViewReportsCard: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => navigate('/reports')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-200 p-6 cursor-pointer
        transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group
        ${className}
      `}
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <FileText size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            View All Reports
          </h3>
          <p className="text-gray-600 text-sm">
            Browse disaster reports in your area
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewReportsButton;
