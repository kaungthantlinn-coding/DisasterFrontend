import React, { useEffect, useState, useRef } from 'react';
import { fetchSendersToCj, fetchConversation } from '../../apis/chat';
import { useAuth } from '../../hooks/useAuth';
import { Send } from 'lucide-react';

const ChatList: React.FC = () => {
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

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">User Chat List</h2>
      {!selectedUser ? (
        <div className="space-y-2">
          {senderList.length === 0 && <div className="text-gray-400 text-sm">No users have sent you a message yet.</div>}
          {senderList.map(u => (
            <button
              key={u.userId}
              onClick={() => setSelectedUser(u)}
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
      ) : (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setSelectedUser(null)} className="text-blue-500 hover:underline text-xs mr-2">← User List</button>
            {selectedUser.photoUrl && (
              <img src={selectedUser.photoUrl} alt={selectedUser.name} className="w-10 h-10 rounded-full border" />
            )}
            <div>
              <div className="font-semibold text-gray-800">{selectedUser.name}</div>
              <div className="text-xs text-gray-500">{selectedUser.email}</div>
            </div>
          </div>
          <div className="h-64 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white/50 backdrop-blur-sm rounded-lg p-4 mb-4">
            {isLoading && <div className="text-center text-gray-400 py-8">Loading messages...</div>}
            {!isLoading && messages.length === 0 && (
              <div className="text-center text-gray-400 py-8">No messages yet.</div>
            )}
            <div className="space-y-4">
              {messages.map((m: any) => (
                <div key={m.chatId} className={`flex ${m.senderId === selectedUser.userId ? 'justify-start' : 'justify-end'}`}>
                  <div className={m.senderId === selectedUser.userId
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 text-gray-800 rounded-2xl rounded-tl-md p-3 shadow-lg max-w-xs'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-tr-md p-3 shadow-lg max-w-xs'}>
                    {m.AttachmentUrl && (
                      <img src={m.AttachmentUrl} alt="chat-img" className="max-w-[220px] max-h-[180px] rounded-lg mb-2" />
                    )}
                    <div className="text-sm leading-relaxed">{m.message}</div>
                    <div className="text-xs text-gray-500 mt-1 text-right">{m.sentAt ? new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatList; 