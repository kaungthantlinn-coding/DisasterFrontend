import React, { useEffect, useState, useRef, useCallback } from "react";
import { fetchSendersToCj, fetchConversation, sendMessageToCj } from '../apis/chat';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import { Send, Home, BarChart3, FileText, MapPin, Clock, Check, CheckCheck } from 'lucide-react';
import "./CjChatList.css";
import ChatModalWrapper from '../components/Chat/ChatModalWrapper';
import ImageViewer from '../components/Common/ImageViewer';


const CjChatList: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useAuth();
  const location = useLocation();
  const currentUserId = user?.userId;
  const [senderList, setSenderList] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [newMessages, setNewMessages] = useState<Set<string>>(new Set());
  const [newMessageCounts, setNewMessageCounts] = useState<Map<string, number>>(new Map());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get route information
  const getRouteInfo = () => {
    const pathname = location.state?.from || location.pathname;
    const routes = {
      '/': { name: 'Home', icon: <Home size={16} />, color: 'text-blue-600' },
      '/dashboard': { name: 'Dashboard', icon: <BarChart3 size={16} />, color: 'text-green-600' },
      '/reports': { name: 'Reports', icon: <FileText size={16} />, color: 'text-red-600' },
      '/cj-chat-list': { name: 'Chat', icon: <MapPin size={16} />, color: 'text-purple-600' },
      '/about': { name: 'About', icon: <Clock size={16} />, color: 'text-yellow-600' },
      '/what-we-do': { name: 'What We Do', icon: <Clock size={16} />, color: 'text-indigo-600' },
      '/get-involved': { name: 'Get Involved', icon: <Clock size={16} />, color: 'text-pink-600' },
      '/contact': { name: 'Contact', icon: <Clock size={16} />, color: 'text-teal-600' },
      '/donate': { name: 'Donate', icon: <Clock size={16} />, color: 'text-orange-600' },
      '/partnership': { name: 'Partnership', icon: <Clock size={16} />, color: 'text-cyan-600' },
    };

    // Check if pathname matches any route
    for (const [path, info] of Object.entries(routes)) {
      if (pathname.includes(path) && path !== '/') {
        return info;
      }
    }
    
    // Default to home or exact match
    return routes[pathname as keyof typeof routes] || routes['/'];
  };

  const routeInfo = getRouteInfo();

  // Helper function to check if a message is NEW (not just unread)
  const isMessageNew = useCallback((message: any, userId: string): boolean => {
    if (!message || message.senderId === currentUserId) return false;
    
    const lastSeenTimestamp = localStorage.getItem(`cj_chat_last_seen_${userId}`);
    if (!lastSeenTimestamp) return true;
    
    const messageTime = new Date(message.sentAt).getTime();
    const lastSeenTime = parseInt(lastSeenTimestamp);
    
    return messageTime > lastSeenTime;
  }, [currentUserId]);

  // Function to mark messages as seen (clear new message indicators)
  const markMessagesAsSeen = useCallback((userId: string) => {
    const now = Date.now();
    localStorage.setItem(`cj_chat_last_seen_${userId}`, now.toString());
    
    // Clear new message indicators for this user
    setNewMessages(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
    
    setNewMessageCounts(prev => {
      const newMap = new Map(prev);
      newMap.delete(userId);
      return newMap;
    });
  }, []);

  useEffect(() => {
    if (currentUserId) {
      const loadInitialSenderList = async () => {
        try {
          const initialSenderList = await fetchSendersToCj(currentUserId);
          
          // Get the latest message timestamp for each sender to order them properly
          const sendersWithTimestamps = await Promise.all(
            initialSenderList.map(async (sender: any) => {
              try {
                const conversation = await fetchConversation({ 
                  userId: sender.userId, 
                  cjId: currentUserId 
                });
                
                // Get the latest message timestamp
                const latestMessage = conversation.length > 0 ? conversation[conversation.length - 1] : null;
                const lastMessageTime = latestMessage?.sentAt ? new Date(latestMessage.sentAt).getTime() : 0;
                
                // Count NEW messages for this sender
                const newMessagesList = conversation.filter((msg: any) => 
                  isMessageNew(msg, sender.userId)
                );
                
                return {
                  ...sender,
                  lastMessageTime,
                  unreadCount: newMessagesList.length,
                  hasUnread: newMessagesList.length > 0
                };
              } catch (error) {
                console.error(`Error fetching conversation for ${sender.userId}:`, error);
                return {
                  ...sender,
                  lastMessageTime: 0,
                };
              }
            })
          );
          
          // Sort senders by most recent message (descending)
          const sortedSenders = sendersWithTimestamps.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
          setSenderList(sortedSenders);
          
          // Update notification states
          const newUnreadMessages = new Set<string>();
          const newUnreadCounts = new Map<string, number>();
          
          sortedSenders.forEach(sender => {
            if (sender.hasUnread) {
              newUnreadMessages.add(sender.userId);
              newUnreadCounts.set(sender.userId, sender.unreadCount);
            }
          });
          
          setNewMessages(newUnreadMessages);
          setNewMessageCounts(newUnreadCounts);
          
        } catch (error) {
          console.error('Error loading initial sender list:', error);
        }
      };
      
      loadInitialSenderList();
    }
  }, [currentUserId]);

  // Polling effect to check for new messages
  useEffect(() => {
    if (!currentUserId) return;

    const checkForNewMessages = async () => {
      try {
        const updatedSenderList = await fetchSendersToCj(currentUserId);
        
        // Get the latest message timestamp for each sender to order them properly
        const sendersWithTimestamps = await Promise.all(
          updatedSenderList.map(async (sender: any) => {
            try {
              const conversation = await fetchConversation({ 
                userId: sender.userId, 
                cjId: currentUserId 
              });
              
              // Get the latest message timestamp
              const latestMessage = conversation.length > 0 ? conversation[conversation.length - 1] : null;
              const lastMessageTime = latestMessage?.sentAt ? new Date(latestMessage.sentAt).getTime() : 0;
              
              // Count NEW messages for this sender
              const newMessagesList = conversation.filter((msg: any) => 
                isMessageNew(msg, sender.userId)
              );
              
              return {
                ...sender,
                lastMessageTime,
                unreadCount: newMessagesList.length,
                hasUnread: newMessagesList.length > 0
              };
            } catch (error) {
              console.error(`Error fetching conversation for ${sender.userId}:`, error);
              return {
                ...sender,
                lastMessageTime: 0,
              };
            }
          })
        );
        
        // Sort senders by most recent message (descending)
        const sortedSenders = sendersWithTimestamps.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
        
        setSenderList(prevSenderList => {
          // Check if the order has changed
          const prevSenderIds = prevSenderList.map(s => s.userId);
          const newSenderIds = sortedSenders.map(s => s.userId);
          
          const hasNewSenders = newSenderIds.some(id => !prevSenderIds.includes(id));
          const orderChanged = JSON.stringify(prevSenderIds) !== JSON.stringify(newSenderIds);
          
          if (hasNewSenders || orderChanged || sortedSenders.length !== prevSenderList.length) {
            // Update notification states when sender list changes
            const newUnreadMessages = new Set<string>();
            const newUnreadCounts = new Map<string, number>();
            
            sortedSenders.forEach(sender => {
              if (sender.hasUnread) {
                newUnreadMessages.add(sender.userId);
                newUnreadCounts.set(sender.userId, sender.unreadCount);
              }
            });
            
            setNewMessages(newUnreadMessages);
            setNewMessageCounts(newUnreadCounts);
            
            return sortedSenders;
          }
          return prevSenderList;
        });
          
      } catch (error) {
        console.error('Error checking for new messages:', error);
      }
    };

    // Start polling every 5 seconds
    const intervalId = setInterval(checkForNewMessages, 5000);

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [currentUserId]);

  useEffect(() => {
    if (selectedUser && currentUserId) {
      setIsLoading(true);
      fetchConversation({ userId: selectedUser.userId, cjId: currentUserId })
        .then((conversation) => {
          setMessages(conversation);
        })
        .catch((error) => {
          console.error('CjChatList - Error fetching messages:', error);
          setMessages([]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [selectedUser, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!selectedUser || !message.trim() || !currentUserId) return;
    try {
      await sendMessageToCj({
        senderId: currentUserId,
        receiverId: selectedUser.userId,
        message: message.trim(),
      });
      setMessage('');
      
      // Clear notifications when CJ sends a message (like Telegram)
      markMessagesAsSeen(selectedUser.userId);
      
      // Move the selected user to the top of the list
      const updatedSenderList = [
        selectedUser,
        ...senderList.filter(s => s.userId !== selectedUser.userId)
      ];
      setSenderList(updatedSenderList);
      
      // Refresh messages for the current conversation
      const updatedConversation = await fetchConversation({ 
        userId: selectedUser.userId, 
        cjId: currentUserId 
      });
      setMessages(updatedConversation);
    } catch (error) {
      console.error('CjChatList - Error sending message:', error);
    }
  }, [selectedUser, message, currentUserId, senderList]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleImageClick = useCallback((imageUrl: string, index: number) => {
    setSelectedImage(imageUrl);
    setSelectedImageIndex(index);
    setImageViewerOpen(true);
  }, []);

  const handleImageViewerClose = useCallback(() => {
    setImageViewerOpen(false);
    setSelectedImage("");
    setSelectedImageIndex(0);
  }, []);

  const handleImageNavigate = useCallback((index: number) => {
    setSelectedImageIndex(index);
  }, []);

  return (
    <ChatModalWrapper routeName={routeInfo.name} onClose={onClose}>
      <button className="close-btn" onClick={onClose}>×</button>
      <div className="messenger-container">
        {/* User List */}
        <div className="messenger-users">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800">Chats</h2>
          </div>
          {senderList.length === 0 && <div className="text-gray-400 text-sm p-4">No users have sent you a message yet.</div>}
          {senderList.map(u => {
            return (
            <div
              key={u.userId}
              className={`messenger-user${selectedUser && selectedUser.userId === u.userId ? ' selected' : ''}`}
              onClick={() => {
                setSelectedUser(u);
                // Clear notifications when user is clicked (like Telegram)
                markMessagesAsSeen(u.userId);
              }}
            >
              <div className="messenger-avatar-container">
                <img src={u.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}`} className="messenger-avatar" alt={u.name} />

              </div>
              <div className="messenger-user-info">
                <div className="messenger-user-name">{u.name}</div>
                <div className="messenger-user-lastmsg">{u.email}</div>
              </div>
            </div>
            );
          })}
        </div>
        {/* Chat Detail */}
        <div className="messenger-detail">
          {selectedUser ? (
            <>
              {/* Header */}
              <div className="messenger-header">
                <img src={selectedUser.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name || 'U')}`} className="messenger-avatar" alt={selectedUser.name} />
                <div className="messenger-user-info">
                  <div className="messenger-user-name">{selectedUser.name}</div>
                  <div className="messenger-user-lastmsg">{selectedUser.email}</div>
                </div>
              </div>
              {/* Messages */}
              <div className="messenger-messages">
                {isLoading && <div className="text-center text-gray-400 py-8">Loading messages...</div>}
                {!isLoading && messages.length === 0 && (
                  <div className="text-center text-gray-400 py-8">No messages yet.</div>
                )}
                <div className="space-y-4 p-4">
                  {messages.map((m: any) => (
                    <div key={m.chatId} className={`flex ${m.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                      <div className={`messenger-bubble ${m.senderId === currentUserId ? 'right' : 'left'}`}>
                        <div className="message-content">
                          {/* Display image if attachmentUrl exists */}
                          {m.attachmentUrl && (
                            <div className="mb-2">
                              <img
                                src={`http://localhost:5057${m.attachmentUrl}`}
                                alt="Attachment"
                                className="rounded-lg max-w-full h-auto cursor-pointer object-cover"
                                onClick={() => handleImageClick(
                                  `http://localhost:5057${m.attachmentUrl}`,
                                  messages.filter(msg => msg.attachmentUrl).findIndex(msg => msg.chatId === m.chatId)
                                )}
                                style={{ maxHeight: '200px' }}
                              />
                            </div>
                          )}
                          {/* Display text message if it exists */}
                          {m.message && <div className="text-sm leading-relaxed">{m.message}</div>}
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-xs messenger-time">{m.sentAt ? new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                            {/* Message status icon (sender only) */}
                            {m.senderId === currentUserId && (
                              m.status === 'read' 
                                ? <CheckCheck size={16} className="text-blue-500 ml-1" /> 
                                : <Check size={16} className="text-gray-400 ml-1" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              {/* Message Bar */}
              <div className="messenger-bar">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type a message..."
                  className="messenger-input"
                  disabled={!selectedUser}
                />
                <button
                  onClick={handleSend}
                  disabled={!selectedUser || !message.trim()}
                  className="messenger-send-btn"
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="messenger-empty">Select a user to view messages</div>
          )}
        </div>
      </div>

      {/* Image Viewer Modal */}
      <ImageViewer
        isOpen={imageViewerOpen}
        onClose={handleImageViewerClose}
        imageUrl={selectedImage}
        alt="Chat image"
        images={messages.filter(m => m.attachmentUrl).map(m => `http://localhost:5057${m.attachmentUrl}`)}
        currentIndex={selectedImageIndex}
        onNavigate={handleImageNavigate}
      />
    </ChatModalWrapper>
  );
};

export default CjChatList;
