import { User } from "@/features/auth/types/auth";

export interface Conversation {
  _id: string;
  participants: User[];
  latestMessage: string;
  createdAt: string;
  updatedAt: string;
  unreadCount:number;
}
   
export interface CreateConversationData {
  receiverId: string;
}