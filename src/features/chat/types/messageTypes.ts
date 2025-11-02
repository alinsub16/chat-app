import { User } from "@/features/auth/types/auth";

export interface Message {
  _id: string;
  chat: string | null;
  content: string;
  messageType: "text" | "image" | "video" | "file";
  attachments: string[];
  readBy: string[];
  createdAt: string;
  updatedAt: string;
}
export interface SendMessageData {
  chatId: string;
  content: string;
  messageType: "text" | "image" | "video" | "file";
  attachments?: string[];
}

export interface UpdateMessageData {
  conversationid:string | null;
  chatId: string | null;
  content?: string;
}