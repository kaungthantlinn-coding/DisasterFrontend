import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Minimize2, Send, AlertTriangle, Headphones } from 'lucide-react';
import { fetchCjUsers } from '../../apis/userManagement';
import { sendMessageToCj, fetchConversation, fetchSendersToCj } from '../../apis/chat';

interface ChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  currentUserId: string; // <-- Add this prop
}

// Add helper to get/set unread count in localStorage
const UNREAD_CHAT_KEY = 'unread_chat_count';
export function getUnreadChatCount() {
  return parseInt(window.localStorage.getItem(UNREAD_CHAT_KEY) || '0', 10);
}
export function clearUnreadChatCount() {
  window.localStorage.setItem(UNREAD_CHAT_KEY, '0');
}
export function incrementUnreadChatCount() {
  const current = getUnreadChatCount();
  window.localStorage.setItem(UNREAD_CHAT_KEY, String(current + 1));
}

// Helper functions for per-CJ unread state
function getUnreadCjIds(): string[] {
  try {
    return JSON.parse(window.localStorage.getItem('unread_cj_ids') || '[]');
  } catch {
    return [];
  }
}
function addUnreadCjId(userId: string) {
  const ids = getUnreadCjIds();
  if (!ids.includes(userId)) {
    ids.push(userId);
    window.localStorage.setItem('unread_cj_ids', JSON.stringify(ids));
  }
}
function clearUnreadCjId(userId: string) {
  const ids = getUnreadCjIds().filter((id: string) => id !== userId);
  window.localStorage.setItem('unread_cj_ids', JSON.stringify(ids));
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  position = 'bottom-right',
  currentUserId,
}) => {
  try {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [cjUsers, setCjUsers] = useState<any[]>([]);
    const [selectedCj, setSelectedCj] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(getUnreadChatCount());
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [senderList, setSenderList] = useState<any[]>([]);
    const [isCjRole, setIsCjRole] = useState(false);
    const [unreadCjIds, setUnreadCjIds] = useState(getUnreadCjIds());

    const positionClasses = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
    };

    useEffect(() => {
      fetchCjUsers().then(setCjUsers).catch(() => setCjUsers([]));
    }, []);

    useEffect(() => {
      if (selectedCj) {
        setIsLoading(true);
        fetchConversation({ userId: currentUserId, cjId: selectedCj.userId })
          .then(setMessages)
          .catch(() => setMessages([]))
          .finally(() => setIsLoading(false));
      }
    }, [selectedCj, currentUserId]);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
      // Determine if current user is CJ role
      try {
        if (window?.localStorage?.getItem('roles')) {
          const roles = JSON.parse(window.localStorage.getItem('roles') || '[]');
          setIsCjRole(roles.includes('cj'));
        } else if (currentUserId && cjUsers.some(u => u.userId === currentUserId)) {
          setIsCjRole(true);
        }
      } catch (err) {
        setIsCjRole(false);
      }
    }, [currentUserId, cjUsers]);

    useEffect(() => {
      if (isCjRole && currentUserId) {
        fetchSendersToCj(currentUserId).then(setSenderList).catch(() => setSenderList([]));
      }
    }, [isCjRole, currentUserId]);

    useEffect(() => {
      setUnreadCount(getUnreadChatCount());
    }, []);

    useEffect(() => {
      const interval = setInterval(() => {
        setUnreadCjIds(getUnreadCjIds());
      }, 1000);
      return () => clearInterval(interval);
    }, []);

    const handleSend = async () => {
      try {
        if (!selectedCj || !message.trim()) return;
        await sendMessageToCj({
          senderId: currentUserId,
          receiverId: selectedCj.userId,
          message,
        });
        setMessage('');
        fetchConversation({ userId: currentUserId, cjId: selectedCj.userId }).then(setMessages).catch(() => setMessages([]));
        // Increment unread count in localStorage for CJ
        incrementUnreadChatCount();
        setUnreadCount(getUnreadChatCount());
        if (!isCjRole) {
          addUnreadCjId(selectedCj.userId);
          setUnreadCjIds(getUnreadCjIds());
        }
      } catch (err) {
        const errorMsg = typeof err === 'object' && err && 'message' in err ? (err as any).message : String(err);
        alert('Failed to send message: ' + (errorMsg || 'Unknown error'));
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    const handleOpenChat = () => {
      setIsOpen(true);
      setUnreadCount(0);
      clearUnreadChatCount();
    };

    if (!currentUserId) {
      return <div className="p-4 text-red-500">You are not logged in properly. Please login again.</div>;
    }

    // console.log('currentUserId', currentUserId);
    // console.log('isCjRole', isCjRole);
    // console.log('cjUsers', cjUsers);
    // console.log('selectedCj', selectedCj);

    return (
      <div className={`fixed ${positionClasses[position]} z-50`}>
        {/* Only show floating chat icon for non-CJ users */}
        {!isCjRole && !isOpen ? (
          <div className="relative">
            <button
              onClick={handleOpenChat}
              className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
              aria-label="Open chat"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-ping opacity-20"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse opacity-30"></div>
              <MessageCircle size={28} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <AlertTriangle size={10} className="text-white" />
              </div>
            </button>
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-bounce">
                {unreadCount}
              </div>
            )}
          </div>
        ) : (
          <div className={`bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 transition-all duration-500 ${isMinimized ? 'h-20 w-80' : 'h-[500px] w-96'}`}>
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-t-3xl relative overflow-hidden">
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
                  <h3 className="font-bold text-lg">CJ Chat</h3>
                  <div className="flex items-center space-x-2 text-sm text-blue-100">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Online</span>
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
            {!isMinimized && (
              <>
                {/* CJ role user: sender list */}
                {isCjRole && !selectedCj && (
                  <div className="px-4 pb-2">
                    <label className="block text-sm font-medium mb-2">Chat Users</label>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {senderList.length === 0 && <div className="text-gray-400 text-sm">No users have sent you a message yet.</div>}
                      {senderList.map(u => (
                        <button
                          key={u.userId}
                          onClick={() => setSelectedCj(u)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-blue-50 transition group"
                        >
                          {u.photoUrl && (
                            <img src={u.photoUrl} alt={u.name} className="w-10 h-10 rounded-full border" />
                          )}
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-gray-800 group-hover:text-blue-700">{u.name}</div>
                            <div className="text-xs text-gray-500">{u.email}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {/* User role: CJ user list */}
                {!isCjRole && !selectedCj && (
                  <div className="px-4 pb-2">
                    <label className="block text-sm font-medium mb-2">CJ User များ</label>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {cjUsers.map(u => (
                        <button
                          key={u.userId}
                          onClick={() => {
                            setSelectedCj(u);
                            clearUnreadCjId(u.userId);
                            setUnreadCjIds(getUnreadCjIds());
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-blue-50 transition group"
                        >
                          {u.photoUrl && (
                            <img src={u.photoUrl} alt={u.name} className="w-10 h-10 rounded-full border" />
                          )}
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-gray-800 group-hover:text-blue-700 flex items-center">
                              {u.name}
                              {unreadCjIds.includes(u.userId) && (
                                <span className="ml-2 inline-block w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">{u.email}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {/* Chat area: CJ or user */}
                {selectedCj && (
                  <>
                    {/* Back button to sender/CJ list */}
                    <div className="flex items-center gap-3 px-6 pb-2">
                      <button onClick={() => setSelectedCj(null)} className="text-blue-500 hover:underline text-xs mr-2">← {isCjRole ? 'User List' : 'CJ List'}</button>
                      {selectedCj.photoUrl && (
                        <img src={selectedCj.photoUrl} alt={selectedCj.name} className="w-10 h-10 rounded-full border" />
                      )}
                      <div>
                        <div className="font-semibold text-gray-800">{selectedCj.name}</div>
                        <div className="text-xs text-gray-500">{selectedCj.email}</div>
                      </div>
                    </div>
                    <div className="flex-1 px-6 h-64 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white/50 backdrop-blur-sm">
                      {isLoading && <div className="text-center text-gray-400 py-8">Loading messages...</div>}
                      {!isLoading && messages.length === 0 && (
                        <div className="text-center text-gray-400 py-8">No messages yet.</div>
                      )}
                      <div className="space-y-4">
                        {messages.map((m) => (
                          <div key={m.chatId} className={`flex ${m.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                            <div className={m.senderId === currentUserId
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-tr-md p-3 shadow-lg max-w-xs'
                              : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 text-gray-800 rounded-2xl rounded-tl-md p-3 shadow-lg max-w-xs'}>
                              <div className="text-sm leading-relaxed">{m.message}</div>
                              <div className="text-xs text-gray-500 mt-1 text-right">{m.sentAt ? new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </div>
                    <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-gray-200/50 rounded-b-3xl">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Message..."
                            className="w-full px-4 py-3 bg-gray-50/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 placeholder-gray-500"
                            disabled={!selectedCj}
                          />
                        </div>
                        <button
                          onClick={handleSend}
                          disabled={!selectedCj || !message.trim()}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
                          aria-label="Send message"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  } catch (err) {
    return <div className="p-4 text-red-500">ChatWidget error: {String(err)}</div>;
  }
};

export default ChatWidget;
