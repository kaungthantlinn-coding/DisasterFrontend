import { apiClient } from './client';

export const sendMessageToCj = async ({ senderId, receiverId, message, image }: { senderId: string; receiverId: string; message: string; image?: File }) => {
  const formData = new FormData();
  formData.append('SenderId', senderId);
  formData.append('ReceiverId', receiverId);
  formData.append('Message', message);
  if (image) {
    formData.append('Attachment', image);
  }
  const res = await apiClient.post('/chat/send', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  console.log('API Response - sendMessageToCj:', res.data);
  return res.data;
};

export const fetchConversation = async ({ userId, cjId }: { userId: string; cjId: string; }) => {
  const res = await apiClient.get(`/chat/conversation?userId=${userId}&cjId=${cjId}`);
  console.log('API Response - fetchConversation:', res.data);
  console.log('Messages with attachments:', res.data.filter((m: any) => m.AttachmentUrl));
  return res.data;
};

export const fetchSendersToCj = async (cjId: string) => {
  const res = await apiClient.get(`/chat/senders/${cjId}`);
  return res.data;
}; 