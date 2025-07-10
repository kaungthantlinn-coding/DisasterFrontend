import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 24,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader size={size} className="animate-spin text-red-600" />
    </div>
  );
};

export default LoadingSpinner;
