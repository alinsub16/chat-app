import { User } from "@/features/auth/types/auth";
import {Message} from "@features/chat/types/messageTypes"
 
export interface Conversation {
  _id: string;
  participants: User[];
  latestMessage: Message | string;
  chatName: string | null;
  createdAt: string;
  updatedAt: string;
  unreadCount:number;
  conversations:string[] | null;
  groupChats:string[] | null;
}
export interface ConversationsResponse {
  chats: Conversation[];
}
   
export interface CreateConversationData {
  receiverId: string;
}

export interface ChatListItemProps {
  avatar: string;
  alt?: string | null;
  initialName?: string | null;
  name: string;
  message: any;
  time: string;
  unread?: boolean | string;

  onClick?: () => void;
  onDeleteClick?: () => void;
  onMenuToggle?: (open: boolean) => void;
}