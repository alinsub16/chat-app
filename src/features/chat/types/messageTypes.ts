export interface Sender {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Message {
  _id: string;
  content: string;
  sender: Sender; 
  conversationId: string | null;
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
  senderId: string;
}

export interface UpdateMessageData {
  content?: string;
  messageType?: string;
  attachments?: any[];
}
