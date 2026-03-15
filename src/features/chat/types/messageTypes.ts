import { User } from "@/features/auth/types/auth";

export type MessageType =
  | "text"
  | "image"
  | "video"
  | "file"
  | "system";

export interface Attachment {
  url: string;
  fileName?:string;
  fileType: "image" | "video" | "file" | "pdf";
  public_id: string;
}

export interface Message {
  _id: string;
  content: string;
  sender: User;
  conversationId: string;
  messageType: MessageType;
  attachments: Attachment[];
  reactions?: Reaction[];
  readBy: string[];
  createdAt: string;
  updatedAt: string;

}

export interface SendMessageData {
  sender:User;
  conversationId: string;
  content: string;
  messageType: MessageType;
  attachments: Attachment[];
}

export interface UploadAttachmentsResponse {
  attachments: Attachment[];
}

export interface UpdateMessageData {
  content?: string;
  messageType?: MessageType;
  attachments?: Attachment[];
}

export interface UIMessage extends Message {
  status?: "sending" | "sent" | "failed";
}
export interface SendMessagePayload {
  sender: UIMessage["sender"];
  conversationId: string;
  content: string;
  messageType?: string;
  files?: File[];
}

export interface Reaction {
  user: User;
  emoji: string;
}
