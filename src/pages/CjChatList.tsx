import React, { useEffect, useState, useRef } from "react";
import { fetchSendersToCj, fetchConversation, sendMessageToCj } from '../apis/chat';
import { useAuth } from '../hooks/useAuth';
import { Send } from 'lucide-react';
import "./CjChatList.css";

const CjChatList: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useAuth();
  const currentUserId = user?.userId;
  const [senderList, setSenderList] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUserId) {
      fetchSendersToCj(currentUserId).then(setSenderList);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (selectedUser && currentUserId) {
      setIsLoading(true);
      fetchConversation({ userId: selectedUser.userId, cjId: currentUserId })
        .then(setMessages)
        .finally(() => setIsLoading(false));
    }
  }, [selectedUser, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!selectedUser || !message.trim() || !currentUserId) return;
    try {
      await sendMessageToCj({
        senderId: currentUserId,
        receiverId: selectedUser.userId,
        message,
      });
      setMessage('');
      fetchConversation({ userId: selectedUser.userId, cjId: currentUserId }).then(setMessages);
    } catch (err) {
      alert('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="messenger-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="messenger-container">
          {/* User List */}
          <div className="messenger-users">
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800">Chats</h2>
            </div>
            {senderList.length === 0 && <div className="text-gray-400 text-sm p-4">No users have sent you a message yet.</div>}
            {senderList.map(u => (
              <div
                key={u.userId}
                className={`messenger-user${selectedUser && selectedUser.userId === u.userId ? ' selected' : ''}`}
                onClick={() => setSelectedUser(u)}
              >
                <img src={u.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}`} className="messenger-avatar" alt={u.name} />
                <div className="messenger-user-info">
                  <div className="messenger-user-name">{u.name}</div>
                  <div className="messenger-user-lastmsg">{u.email}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Chat Detail */}
          <div className="messenger-detail">
            {selectedUser ? (
              <>
                {/* Header */}
                <div className="messenger-header">
                  <img src={selectedUser.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name || 'U')}`} className="messenger-avatar" alt={selectedUser.name} />
                  <div className="messenger-header-info">
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
                          <div className="text-sm leading-relaxed">{m.message}</div>
                          <div className="text-xs messenger-time">{m.sentAt ? new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
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
      </div>
    </div>
  );
};

export default CjChatList;
