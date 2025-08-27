import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Headphones, Minimize2, X, Send, ImagePlus } from "lucide-react";
import { fetchCjUsers } from '../../apis/userManagement';
import { useAuth } from '../../hooks/useAuth';
import { sendMessageToCj, fetchConversation, fetchSendersToCj } from '../../apis/chat';
import ImageViewer from "../Common/ImageViewer";
import "../../pages/CjChatList.css";

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

interface ChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left' | 'center';
  currentUserId: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  position = 'bottom-right',
  currentUserId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedCj, setSelectedCj] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCjIds, setUnreadCjIds] = useState<string[]>([]);
  const [cjUsers, setCjUsers] = useState<any[]>([]);
  const [senderList, setSenderList] = useState<any[]>([]);
  const [isCjRole, setIsCjRole] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { isAuthenticated } = useAuth();

  // Fetch CJ users on component mount - only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCjUsers().then(setCjUsers).catch(() => setCjUsers([]));
    }
  }, [isAuthenticated]);

  // Determine if current user is CJ role
  useEffect(() => {
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

  // Fetch senders for CJ role
  useEffect(() => {
    if (isCjRole && currentUserId) {
      fetchSendersToCj(currentUserId).then(setSenderList).catch(() => setSenderList([]));
    }
  }, [isCjRole, currentUserId]);

  // Fetch conversation when selectedCj changes
  useEffect(() => {
    if (selectedCj) {
      setIsLoading(true);
      fetchConversation({ userId: currentUserId, cjId: selectedCj.userId })
        .then((messages) => {
          console.log('Fetched messages:', messages);
          console.log('Messages with attachments:', messages.filter((m: any) => m.attachmentUrl));
          setMessages(messages);
        })
        .catch((error) => {
          console.error('Error fetching messages:', error);
          setMessages([]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [selectedCj, currentUserId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleOpenChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    clearUnreadChatCount(); // Clear unread count when opening chat
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    try {
      if (!selectedCj || (!message.trim() && !imageFile)) return;
      
      const messageToSend = message.trim();
      
      console.log('Sending message with image:', {
        senderId: currentUserId,
        receiverId: selectedCj.userId,
        message: messageToSend,
        imageFile: imageFile ? `${imageFile.name} (${imageFile.size} bytes)` : 'none'
      });
      
      const response = await sendMessageToCj({
        senderId: currentUserId,
        receiverId: selectedCj.userId,
        message: messageToSend,
        image: imageFile || undefined,
      });
      
      console.log('Message sent successfully:', response);
      
      setMessage("");
      setImageFile(null);
      setImagePreview("");
      
      // Move the selected CJ to the top of the list
      const updatedCjUsers = [
        selectedCj,
        ...cjUsers.filter(cj => cj.userId !== selectedCj.userId)
      ];
      setCjUsers(updatedCjUsers);
      
      fetchConversation({ userId: currentUserId, cjId: selectedCj.userId }).then(setMessages).catch(() => setMessages([]));
      // Increment unread count in localStorage for CJ
      incrementUnreadChatCount();
      if (!isCjRole) {
        addUnreadCjId(selectedCj.userId);
        setUnreadCjIds(getUnreadCjIds());
      }
    } catch (err) {
      const errorMsg = typeof err === 'object' && err && 'message' in err ? (err as any).message : String(err);
      alert('Failed to send message: ' + (errorMsg || 'Unknown error'));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleImageClick = (imageUrl: string, index: number) => {
    setSelectedImage(imageUrl);
    setSelectedImageIndex(index);
    setImageViewerOpen(true);
  };

  const handleImageViewerClose = () => {
    setImageViewerOpen(false);
    setSelectedImage("");
    setSelectedImageIndex(0);
  };

  const handleImageNavigate = (index: number) => {
    setSelectedImageIndex(index);
  };

  try {
    return (
      <>
        {/* Floating chat icon in corner */}
        {!isCjRole && !isOpen && (
          <div className="fixed bottom-6 right-6 z-50">
            <div className="relative">
              <button
                onClick={handleOpenChat}
                className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                aria-label="Open chat"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-ping opacity-20"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse opacity-30"></div>
                <MessageCircle size={28} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>
          </div>
        )}
                 {/* Chat widget in center when open */}
         {isOpen && (
           <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
             <div
               className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 transition-all duration-500 h-[700px] w-[600px] relative overflow-hidden"
             >
               {/* Animated background elements */}
               <div className="absolute inset-0 overflow-hidden">
                 <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                 <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
               </div>
               
               {/* Header with enhanced design */}
               <div className="relative z-10 flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-t-3xl relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
                 <div className="absolute inset-0">
                   <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
                   <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12 animate-pulse delay-1000"></div>
                 </div>
                 <div className="flex items-center space-x-4 relative z-10">
                   <div className="relative">
                     <div className="w-14 h-14 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                       <Headphones size={24} className="text-white drop-shadow-lg" />
                     </div>
                     <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                     <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-ping"></div>
                   </div>
                   <div>
                     <h3 className="font-bold text-xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-lg">CJ Chat</h3>
                     <div className="flex items-center space-x-2 text-sm text-blue-100">
                       <div className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                       <span className="font-medium">Online & Ready</span>
                     </div>
                   </div>
                 </div>
                 <div className="flex items-center space-x-2 relative z-10">
                   <button
                     onClick={() => setIsOpen(false)}
                     className="p-3 hover:bg-white/20 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-90 bg-white/10 backdrop-blur-sm border border-white/20"
                     aria-label="Close chat"
                   >
                     <X size={20} className="text-white drop-shadow-lg" />
                   </button>
                 </div>
               </div>
               
               {/* Content area with enhanced styling */}
               <div className="flex-1 flex flex-col h-[calc(700px-120px)] relative z-10">
                                     {/* CJ role user: sender list */}
                   {isCjRole && !selectedCj && (
                     <div className="px-6 py-4">
                       <label className="block text-sm font-semibold mb-4 text-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Chat Users</label>
                       <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                         {senderList.length === 0 && (
                           <div className="text-center py-8">
                             <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                               <MessageCircle size={24} className="text-gray-400" />
                             </div>
                             <div className="text-gray-400 text-sm">No users have sent you a message yet.</div>
                           </div>
                         )}
                         {senderList.map((u) => (
                           <button
                             key={u.userId}
                             onClick={() => setSelectedCj(u)}
                             className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-200/50 hover:border-blue-300/50 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 group shadow-sm hover:shadow-md"
                           >
                             <div className="relative">
                               {u.photoUrl ? (
                                 <img src={u.photoUrl} alt={u.name} className="w-12 h-12 rounded-full border-2 border-white shadow-lg group-hover:border-blue-200 transition-all duration-300" />
                               ) : (
                                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                                   {u.name?.charAt(0)?.toUpperCase()}
                                 </div>
                               )}
                               <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                             </div>
                             <div className="flex-1 text-left">
                               <div className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">{u.name}</div>
                               <div className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">{u.email}</div>
                             </div>
                             <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                               <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                             </div>
                           </button>
                         ))}
                       </div>
                     </div>
                   )}
                   {/* User role: CJ user list */}
                   {!isCjRole && !selectedCj && (
                     <div className="px-6 py-4">
                       <label className="block text-sm font-semibold mb-4 text-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CJ User များ</label>
                       <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                         {cjUsers.map((u) => (
                           <button
                             key={u.userId}
                             onClick={() => {
                               setSelectedCj(u);
                               clearUnreadCjId(u.userId);
                               setUnreadCjIds(getUnreadCjIds());
                             }}
                             className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-200/50 hover:border-blue-300/50 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 group shadow-sm hover:shadow-md relative"
                           >
                             <div className="relative">
                               {u.photoUrl ? (
                                 <img src={u.photoUrl} alt={u.name} className="w-12 h-12 rounded-full border-2 border-white shadow-lg group-hover:border-blue-200 transition-all duration-300" />
                               ) : (
                                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                                   {u.name?.charAt(0)?.toUpperCase()}
                                 </div>
                               )}
                               <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                             </div>
                             <div className="flex-1 text-left">
                               <div className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300 flex items-center">
                                 {u.name}
                                 {unreadCjIds.includes(u.userId) && (
                                   <span className="ml-3 inline-flex items-center justify-center w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-lg">
                                     <span className="text-white text-xs font-bold">!</span>
                                   </span>
                                 )}
                               </div>
                               <div className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">{u.email}</div>
                             </div>
                             <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                               <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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
                       <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/30 to-purple-50/30">
                         <button
                           onClick={() => setSelectedCj(null)}
                           className="p-2 hover:bg-white/50 rounded-xl transition-all duration-300 text-blue-600 hover:text-blue-700"
                         >
                           <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">←</div>
                         </button>
                         <div className="relative">
                           {selectedCj.photoUrl ? (
                             <img src={selectedCj.photoUrl} alt={selectedCj.name} className="w-12 h-12 rounded-full border-2 border-white shadow-lg" />
                           ) : (
                             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                               {selectedCj.name?.charAt(0)?.toUpperCase()}
                             </div>
                           )}
                           <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                         </div>
                         <div>
                           <div className="font-semibold text-gray-800">{selectedCj.name}</div>
                           <div className="text-xs text-gray-500 flex items-center">
                             <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                             Active now
                           </div>
                         </div>
                       </div>
                       
                                               {/* Messages area */}
                        <div className="flex-1 px-6 py-4 overflow-y-auto bg-gradient-to-b from-gray-50/30 to-white/30 backdrop-blur-sm">

                         {isLoading && (
                           <div className="text-center py-8">
                             <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center animate-pulse">
                               <MessageCircle size={24} className="text-gray-400" />
                             </div>
                             <div className="text-gray-400 text-sm">Loading messages...</div>
                           </div>
                         )}
                         {!isLoading && messages.length === 0 && (
                           <div className="text-center py-8">
                             <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                               <MessageCircle size={24} className="text-gray-400" />
                             </div>
                             <div className="text-gray-400 text-sm">No messages yet. Start the conversation!</div>
                           </div>
                         )}
                         <div className="space-y-4">
                           {messages.map((m, index) => {
                             // DEBUG: Log the first message object to inspect its structure
                             if (index === 0) {
                               console.log("Inspecting message object:", m);
                             }
                             return (
                               <div
                                 key={m.id}
                                 className={`flex ${m.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                               >
                                 <div
                                   className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl shadow-md transition-all duration-300 ${
                                     m.senderId === currentUserId
                                       ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-lg"
                                       : "bg-white text-gray-800 rounded-bl-lg"
                                   }`}
                                 >
                                   {/* Display text message if it exists */}
                                   {m.message && <p className="text-sm break-words">{m.message}</p>}

                                   {/* Display image if AttachmentUrl exists */}
                                   {m.attachmentUrl && (
                                     <div className={`mt-2 ${m.message ? 'mt-2' : ''}`}>
                                       <img
                                         src={`http://localhost:5057${m.attachmentUrl}`}
                                         alt="Attachment"
                                         className="rounded-lg max-w-full h-auto cursor-pointer object-cover"
                                         onClick={() => handleImageClick(
                                           `http://localhost:5057${m.attachmentUrl}`,
                                           messages.filter(msg => msg.attachmentUrl).findIndex(msg => msg.id === m.id)
                                         )}
                                         style={{ maxHeight: '200px' }} // Constrain image height
                                       />
                                     </div>
                                   )}

                                   {/* Timestamp */}
                                   <div
                                     className={`text-xs mt-1.5 ${m.senderId === currentUserId ? 'text-blue-200' : 'text-gray-500'}`}
                                   >
                                     {m.sentAt
                                       ? new Date(m.sentAt).toLocaleTimeString([], {
                                           hour: "2-digit",
                                           minute: "2-digit",
                                         })
                                       : ""}
                                   </div>
                                 </div>
                               </div>
                             );
                           })}
                           <div ref={messagesEndRef} />
                         </div>
                       </div>
                       
                                               {/* Input area */}
                        <div className="p-4 bg-white/70 backdrop-blur-sm border-t border-gray-200/80">
                          {imagePreview && (
                            <div className="mb-3">
                              <div className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-lg border border-blue-200/50">
                                <div className="flex items-center gap-2">
                                  <ImagePlus size={14} className="text-blue-600" />
                                  <div className="text-xs text-blue-600 font-medium">Image Preview</div>
                                </div>
                                <button
                                  onClick={handleRemoveImage}
                                  className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
                                  aria-label="Remove image"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                              <div className="mt-2 relative group">
                                <img 
                                  src={imagePreview} 
                                  alt="Preview" 
                                  className="w-20 h-20 object-cover rounded-xl shadow-md border-2 border-white"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <ImagePlus size={16} className="text-white drop-shadow-lg" />
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="messenger-bar">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageSelect}
                              className="hidden"
                              id="image-input"
                              ref={imageInputRef}
                            />
                            <button 
                              onClick={() => imageInputRef.current?.click()}
                              className="messenger-attach-btn"
                              aria-label="Attach image"
                            >
                              <ImagePlus size={20} />
                            </button>
                            <input
                              type="text"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              onKeyDown={handleKeyPress}
                              placeholder="Type your message..."
                              className="messenger-input"
                              disabled={!selectedCj}
                            />
                            <button
                              onClick={handleSend}
                              disabled={!selectedCj || (!message.trim() && !imageFile)}
                              className="messenger-send-btn"
                              aria-label="Send message"
                            >
                              <Send size={20} />
                            </button>
                          </div>
                        </div>
                     </>
                   )}
                </div>
              </div>
            </div>
          )}

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
        </>
      );
    } catch (err) {
      return <div className="p-4 text-red-500">ChatWidget error: {String(err)}</div>;
    }
  };

  export default ChatWidget;
