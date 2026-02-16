import api from "@/services/axiosInstance";
import { Message, SendMessageData, UpdateMessageData } from "@/features/chat/types/messageTypes";

// Send a new message
export const sendMessage = async (data: SendMessageData): Promise<Message> => {
  const res = await api.post<Message>("/messages", data);
  return res.data;
};

// Get all messages in a chat
export const getChatMessages = async (conversationId: string): Promise<Message[]> => {
  const res = await api.get(`/messages/${conversationId}`);
  return Array.isArray(res.data) ? res.data : [res.data];
  
};

// Delete all messages in a chat
export const deleteChatMessage = async (
  chatId: string
): Promise<{ success: boolean }> => {
  const res = await api.delete<{ success: boolean }>(`/messages/${chatId}`);
  return res.data;
};

// Update a message (for editing content or marking as read)
export const updateChatMessage = async (
  chatId: string,
  data: UpdateMessageData
): Promise<Message> => {
  const res = await api.put<Message>(`/messages/${chatId}`, data);
  return res.data;
};
