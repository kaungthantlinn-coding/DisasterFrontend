/**
 * Utility functions for handling avatar URLs and image processing
 */

/**
 * Validates if a URL is a valid image URL
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return false;

  try {
    const urlObj = new URL(url);
    // Check for valid protocols
    if (!['http:', 'https:', 'data:'].includes(urlObj.protocol)) {
      return false;
    }

    // Check for common image extensions or data URLs
    const isImageExtension = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url);
    const isDataUrl = url.startsWith('data:image/');
    const isGoogleUserContent = url.includes('googleusercontent.com');
    const isGravatar = url.includes('gravatar.com');

    // For Google profile images, be more permissive and let the browser handle loading
    // We'll handle failures silently in the Avatar component

    return isImageExtension || isDataUrl || isGoogleUserContent || isGravatar;
  } catch {
    return false;
  }
};

/**
 * Optimizes and normalizes avatar URLs for better performance and reliability
 */
export const optimizeAvatarUrl = (url: string): string | undefined => {
  if (!url || url.trim() === '') {
    return undefined;
  }

  // Temporarily bypass validation to allow all URLs through
  // if (!isValidImageUrl(url)) {
  //   return undefined;
  // }

  try {
    // Validate URL format
    new URL(url);
    
    // Ensure HTTPS for security
    let optimizedUrl = url.replace('http://', 'https://');
    
    // Optimize Google profile images
    if (optimizedUrl.includes('googleusercontent.com')) {
      // Remove any malformed parameters and add proper size parameter
      optimizedUrl = optimizedUrl.split('?')[0];
      if (!optimizedUrl.includes('=s')) {
        optimizedUrl += '=s128-c';
      } else {
        // Update existing size parameter for better quality
        optimizedUrl = optimizedUrl.replace(/=s\d+-c/, '=s128-c');
      }
    }
    
    // Optimize Gravatar images
    if (optimizedUrl.includes('gravatar.com')) {
      const hasSize = optimizedUrl.includes('s=');
      if (!hasSize) {
        const separator = optimizedUrl.includes('?') ? '&' : '?';
        optimizedUrl += `${separator}s=128&d=mp`;
      }
    }
    
    return optimizedUrl;
  } catch {
    // Invalid URL format
    return undefined;
  }
};

/**
 * Extracts photo URL from multiple possible fields (for API responses)
 */
export const extractPhotoUrl = (user: any): string | undefined => {
  const possibleFields = [
    user.photoUrl,
    user.photo_url,
    user.picture, // Google OAuth standard field
    user.avatar,
    user.profile_picture,
    user.image,
    user.avatar_url
  ];

  const photoUrl = possibleFields.find(field => 
    field && typeof field === 'string' && field.trim() !== ''
  );

  return optimizeAvatarUrl(photoUrl);
};

/**
 * Generates initials from a name
 */
export const getInitials = (name?: string): string => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Generates a deterministic background color based on name
 */
export const getAvatarBackgroundColor = (name?: string): string => {
  if (!name) return 'bg-blue-100';
  
  const colors = [
    'bg-blue-100',
    'bg-green-100', 
    'bg-purple-100',
    'bg-yellow-100',
    'bg-pink-100',
    'bg-indigo-100',
    'bg-red-100',
    'bg-gray-100'
  ];
  
  // Simple hash function to get consistent color for same name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Gets corresponding text color for background
 */
export const getAvatarTextColor = (backgroundColor: string): string => {
  const colorMap: Record<string, string> = {
    'bg-blue-100': 'text-blue-600',
    'bg-green-100': 'text-green-600',
    'bg-purple-100': 'text-purple-600',
    'bg-yellow-100': 'text-yellow-600',
    'bg-pink-100': 'text-pink-600',
    'bg-indigo-100': 'text-indigo-600',
    'bg-red-100': 'text-red-600',
    'bg-gray-100': 'text-gray-600'
  };
  
  return colorMap[backgroundColor] || 'text-blue-600';
};
