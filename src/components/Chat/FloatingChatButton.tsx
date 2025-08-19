import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const FloatingChatButton: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const openChat = () => {
    navigate('/cj-chat-list', { state: { background: location } });
  };

  return (
    <button
      onClick={openChat}
      className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 group focus:outline-none focus:ring-4 focus:ring-blue-300"
      aria-label="Open Chat"
    >
      <MessageCircle size={28} className="group-hover:scale-110 transition-transform duration-300" />
    </button>
  );
};

export default FloatingChatButton;