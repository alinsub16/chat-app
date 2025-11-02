// src/api/chat.ts
import api from "@/services/axiosInstance";
import { Chat, CreateChatData } from "@/types/chat";

// Fetch all group chats for the logged-in user
export const getGroupChats = async (): Promise<Chat[]> => {
  const res = await api.get<Chat[]>("/chats");
  return res.data;
};

// Create a new group chat
export const createGroupChat = async (data: CreateChatData): Promise<Chat> => {
  const res = await api.post<Chat>("/chats", data);
  return res.data;
};

// Get details of a specific group chat
export const getGroupChatById = async (chatId: string): Promise<Chat> => {
  const res = await api.get<Chat>(`/chats/${chatId}`);
  return res.data;
};

// Add members to a group chat
export const addMembersToGroup = async (
  chatId: string,
  userId: string
): Promise<Chat> => {
  const res = await api.post<Chat>(`/chats/${chatId}/members`, { userId });
  return res.data;
};

// Remove a member from a group chat
export const removeMemberFromGroup = async (
  chatId: string,
  memberId: string
): Promise<Chat> => {
  const res = await api.delete<Chat>(`/chats/${chatId}/members/${memberId}`);
  return res.data;
};
