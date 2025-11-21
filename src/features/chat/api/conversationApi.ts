// src/api/conversation.ts
import api from "@/services/axiosInstance";
import { Conversation, CreateConversationData, ConversationsResponse} from "@/features/chat/types/conversationTypes";

export const createConversation = async (
  data: CreateConversationData
): Promise<Conversation> => {
  const res = await api.post<Conversation>("/conversations", data);
  return res.data;
};

export const getConversations = async (): Promise<ConversationsResponse> => {
  const res = await api.get<ConversationsResponse>("/conversations");
  return res.data;
};

export const deleteConversation = async (
  conversationId: string
): Promise<{ success: boolean }> => {
  const res = await api.delete<{ success: boolean }>(
    `/conversations/${conversationId}`
  );
  return res.data;
};
