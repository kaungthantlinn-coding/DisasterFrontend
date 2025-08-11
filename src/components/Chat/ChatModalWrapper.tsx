import React from 'react';

interface ChatModalWrapperProps {
  children: React.ReactNode;
  routeName?: string;
  onClose: () => void;
}

const ChatModalWrapper: React.FC<ChatModalWrapperProps> = ({ children, routeName, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Modal background with blur and dark overlay */}
      <div
        className="absolute inset-0 backdrop-blur-sm flex items-center justify-center"
        onClick={onClose}
      >
        {/* Watermark route name */}
        {routeName && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-7xl md:text-8xl font-extrabold text-white/10 drop-shadow-lg uppercase tracking-widest">
              {routeName}
            </span>
          </div>
        )}
      </div>
      {/* Modal content */}
      <div
        className="relative w-full h-full max-w-none max-h-none bg-white/40 backdrop-blur-lg flex flex-col overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default ChatModalWrapper;