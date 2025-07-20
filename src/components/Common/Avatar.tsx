import React, { useState } from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  name, 
  size = 'md', 
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24
  };

  const getInitials = (name?: string): string => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    console.warn('Avatar image failed to load:', src);
    setImageError(true);
    setImageLoading(false);
  };

  const baseClasses = `${sizeClasses[size]} rounded-full object-cover ${className}`;

  // Show image if src exists and no error occurred
  if (src && !imageError) {
    return (
      <div className="relative">
        <img
          src={src}
          alt={alt || name || 'User avatar'}
          className={baseClasses}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        {imageLoading && (
          <div className={`${baseClasses} bg-gray-200 animate-pulse flex items-center justify-center absolute inset-0`}>
            <User size={iconSizes[size]} className="text-gray-400" />
          </div>
        )}
      </div>
    );
  }

  // Show initials if name is available
  if (name && getInitials(name)) {
    return (
      <div className={`${baseClasses} bg-blue-100 flex items-center justify-center text-blue-600 font-medium`}>
        <span className={`text-${size === 'sm' ? 'xs' : size === 'md' ? 'sm' : 'base'}`}>
          {getInitials(name)}
        </span>
      </div>
    );
  }

  // Fallback to default user icon
  return (
    <div className={`${baseClasses} bg-blue-100 flex items-center justify-center`}>
      <User size={iconSizes[size]} className="text-blue-600" />
    </div>
  );
};

export default Avatar;