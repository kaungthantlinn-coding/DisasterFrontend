import React, { useState } from 'react';
import { User } from 'lucide-react';
import {
  isValidImageUrl,
  optimizeAvatarUrl,
  getInitials,
  getAvatarBackgroundColor,
  getAvatarTextColor
} from '../../utils/avatarUtils';

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

  // Optimize the image URL for better performance and reliability
  const optimizedSrc = src ? optimizeAvatarUrl(src) : undefined;



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

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    // Silently handle image errors to avoid console spam
    // Google profile images often fail due to privacy settings or expired tokens
    setImageError(true);
    setImageLoading(false);
  };

  const baseClasses = `${sizeClasses[size]} rounded-full object-cover ${className}`;

  // Get dynamic background and text colors based on name
  const backgroundColor = getAvatarBackgroundColor(name);
  const textColor = getAvatarTextColor(backgroundColor);

  // Show image if src exists and no error occurred (temporarily bypass validation)
  if (src && !imageError) {
    return (
      <div className="relative">
        <img
          src={optimizedSrc || src}
          alt={alt || name || 'User avatar'}
          className={baseClasses}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        {imageLoading && (
          <div className={`${baseClasses} ${backgroundColor} animate-pulse flex items-center justify-center absolute inset-0`}>
            <User size={iconSizes[size]} className={textColor.replace('text-', 'text-').replace('-600', '-400')} />
          </div>
        )}
      </div>
    );
  }

  // Show initials if name is available
  if (name && getInitials(name)) {
    return (
      <div className={`${baseClasses} ${backgroundColor} flex items-center justify-center ${textColor} font-medium`}>
        <span className={`text-${size === 'sm' ? 'xs' : size === 'md' ? 'sm' : 'base'}`}>
          {getInitials(name)}
        </span>
      </div>
    );
  }

  // Fallback to default user icon
  return (
    <div className={`${baseClasses} ${backgroundColor} flex items-center justify-center`}>
      <User size={iconSizes[size]} className={textColor} />
    </div>
  );
};

export default Avatar;