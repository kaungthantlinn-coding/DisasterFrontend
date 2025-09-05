import React, { useState, useEffect } from 'react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  fallbackSrc?: string;
}

const SmartImage: React.FC<SmartImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  onClick,
  fallbackSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA0NUw0NSA0MEw1NSA1MEw2MCA0NUw3MCA1NUw3MCA2NUgxMFY1NUwyMCA0NUwyNSA1MEwzNSA0MEw0MCA0NVoiIGZpbGw9IiNEMUQ1REIiLz4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNSIgZmlsbD0iI0QxRDVEQiIvPgo8L3N2Zz4K'
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [attemptIndex, setAttemptIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate possible URLs to try
  const generatePossibleUrls = (originalSrc: string) => {
    const BACKEND_URL = "http://localhost:5057";
    
    // Extract the path from the original URL
    let path = originalSrc;
    if (originalSrc.startsWith('http://') || originalSrc.startsWith('https://')) {
      try {
        const url = new URL(originalSrc);
        path = url.pathname;
      } catch {
        path = originalSrc;
      }
    }
    
    // Ensure path starts with /
    if (!path.startsWith('/')) {
      path = `/${path}`;
    }
    
    return [
      originalSrc,                                    // Original URL
      `${BACKEND_URL}${path}`,                       // Direct path
      `${BACKEND_URL}/api${path}`,                   // Through API
      `${BACKEND_URL}/static${path}`,                // Static folder
      `${BACKEND_URL}/files${path}`,                 // Files folder
      `${BACKEND_URL}/public${path}`,                // Public folder
      `${BACKEND_URL}/wwwroot${path}`,               // ASP.NET wwwroot
    ];
  };

  const possibleUrls = generatePossibleUrls(src);

  const handleImageError = () => {
    console.error(`❌ Image failed to load: ${currentSrc}`);

    // Try next URL
    if (attemptIndex < possibleUrls.length - 1) {
      const nextIndex = attemptIndex + 1;
      const nextUrl = possibleUrls[nextIndex];
      console.log(`🔄 Trying next URL (${nextIndex + 1}/${possibleUrls.length}): ${nextUrl}`);

      setAttemptIndex(nextIndex);
      setCurrentSrc(nextUrl);
    } else {
      // All attempts failed, show fallback
      console.error('❌ All image URL attempts failed, showing fallback');
      setHasError(true);
      setIsLoading(false);
      setCurrentSrc(fallbackSrc);
    }
  };

  const handleImageLoad = () => {
    console.log(`✅ Image loaded successfully: ${currentSrc}`);
    setIsLoading(false);
    setHasError(false);
  };

  // Reset when src changes
  useEffect(() => {
    setCurrentSrc(src);
    setAttemptIndex(0);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  return (
    <div className="relative">
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        onClick={onClick}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
      
      {/* Loading indicator */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Error indicator */}
      {hasError && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs px-1 py-0.5 rounded-b">
          Failed to load
        </div>
      )}
    </div>
  );
};

export default SmartImage;
