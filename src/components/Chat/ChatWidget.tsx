import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Minimize2, Send, AlertTriangle, Headphones, Zap, Shield } from 'lucide-react';

interface ChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'emergency' | 'info' | 'warning';
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  position = 'bottom-right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 1,
      text: "🚨 Emergency Support Online! I'm here to help you with disaster reporting, emergency assistance, and safety guidance. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'emergency'
    };
    setMessages([welcomeMessage]);
  }, []);

  // Simulate bot responses
  const getBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    let response = "";
    let type: 'emergency' | 'info' | 'warning' = 'info';

    if (lowerMessage.includes('emergency') || lowerMessage.includes('help') || lowerMessage.includes('urgent')) {
      response = "🚨 This sounds urgent! For immediate emergencies, call 911. I can also help you file a disaster report or connect you with local emergency services. What type of emergency are you experiencing?";
      type = 'emergency';
    } else if (lowerMessage.includes('flood') || lowerMessage.includes('fire') || lowerMessage.includes('earthquake')) {
      response = "⚠️ I understand you're dealing with a natural disaster. I can help you report this incident and connect you with appropriate resources. Please stay safe and follow local evacuation orders if any.";
      type = 'warning';
    } else if (lowerMessage.includes('report') || lowerMessage.includes('incident')) {
      response = "📋 I can help you file an incident report. This will alert local authorities and emergency services. Would you like me to guide you through the reporting process?";
      type = 'info';
    } else {
      response = "I'm here to help with emergency situations, disaster reporting, and safety guidance. You can ask me about filing reports, emergency contacts, or safety procedures. How can I assist you?";
      type = 'info';
    }

    return {
      id: Date.now(),
      text: response,
      sender: 'bot',
      timestamp: new Date(),
      type
    };
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const userMessage: Message = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setMessage('');
      setIsTyping(true);

      // Simulate bot response delay
      setTimeout(() => {
        const botResponse = getBotResponse(message);
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
        
        if (!isOpen) {
          setUnreadCount(prev => prev + 1);
        }
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  const getMessageStyle = (type?: string) => {
    switch (type) {
      case 'emergency':
        return 'bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500';
      default:
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500';
    }
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {!isOpen ? (
        // Beautiful Chat Trigger Button
        <div className="relative">
          <button
            onClick={handleOpenChat}
            className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
            aria-label="Open emergency chat"
          >
            {/* Pulsing ring animation */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-ping opacity-20"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse opacity-30"></div>
            
            <MessageCircle
              size={28}
              className="relative z-10 group-hover:scale-110 transition-transform duration-300"
            />
            
            {/* Emergency indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle size={10} className="text-white" />
            </div>
          </button>

          {/* Unread count badge */}
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-bounce">
              {unreadCount}
            </div>
          )}

          {/* Floating help text */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
              Emergency Support Chat
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      ) : (
        // Beautiful Chat Interface
        <div
          className={`bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 transition-all duration-500 ${
            isMinimized ? 'h-20 w-80' : 'h-[500px] w-96'
          }`}
        >
          {/* Elegant Chat Header */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-t-3xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
            </div>
            
            <div className="flex items-center space-x-4 relative z-10">
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Headphones size={20} className="text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg">Emergency Support</h3>
                <div className="flex items-center space-x-2 text-sm text-blue-100">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Online • Response time: &lt; 2min</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 relative z-10">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 transform hover:scale-110"
                aria-label="Minimize chat"
              >
                <Minimize2 size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 transform hover:scale-110"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 p-6 h-80 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white/50 backdrop-blur-sm">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender === 'bot' && (
                        <div className="flex items-start space-x-3 max-w-xs">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                            {msg.type === 'emergency' ? (
                              <AlertTriangle size={16} className="text-white" />
                            ) : msg.type === 'warning' ? (
                              <Shield size={16} className="text-white" />
                            ) : (
                              <Zap size={16} className="text-white" />
                            )}
                          </div>
                          <div className={`rounded-2xl rounded-tl-md p-4 shadow-lg ${getMessageStyle(msg.type)}`}>
                            <p className="text-sm text-gray-800 leading-relaxed">{msg.text}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {msg.sender === 'user' && (
                        <div className="max-w-xs">
                          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-tr-md p-4 shadow-lg">
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            <p className="text-xs text-blue-100 mt-2">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <MessageCircle size={16} className="text-white" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-tl-md p-4 shadow-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Beautiful Message Input */}
              <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-gray-200/50 rounded-b-3xl">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your emergency message..."
                      className="w-full px-4 py-3 bg-gray-50/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 placeholder-gray-500"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
                    aria-label="Send message"
                  >
                    <Send size={18} />
                  </button>
                </div>
                
                {/* Quick Actions */}
                <div className="flex items-center space-x-2 mt-3">
                  <button className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium hover:bg-red-200 transition-colors">
                    🚨 Emergency
                  </button>
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors">
                    📋 Report
                  </button>
                  <button className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200 transition-colors">
                    ℹ️ Info
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
