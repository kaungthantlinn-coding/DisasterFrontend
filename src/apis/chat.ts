import { apiClient } from './client';

export const sendMessageToCj = async ({ senderId, receiverId, message }: { senderId: string; receiverId: string; message: string; }) => {
  const formData = new FormData();
  formData.append('SenderId', senderId);
  formData.append('ReceiverId', receiverId);
  formData.append('Message', message);
  const res = await apiClient.post('/chat/send', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const fetchConversation = async ({ userId, cjId }: { userId: string; cjId: string; }) => {
  const res = await apiClient.get(`/chat/conversation?userId=${userId}&cjId=${cjId}`);
  return res.data;
};

export const fetchSendersToCj = async (cjId: string) => {
  const res = await apiClient.get(`/chat/senders/${cjId}`);
  return res.data;
}; 