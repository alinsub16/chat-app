import { User } from "@/features/auth/types/auth";

export interface Sender {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Message {
  _id: string;
  content: string;
  sender: User; 
  conversationId: string;
  chatId?: string | null;
  messageType: string;
  attachments: any[];
  readBy: any[];
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageData {
  conversationId: string;
  content: string;
  messageType: string;
  attachments: any[];
}

export interface UpdateMessageData {
  content?: string;
  messageType?: string;
  attachments?: any[];
}
