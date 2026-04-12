import { User } from "@/features/auth/types/auth";
import {Message} from "@features/chat/types/messageTypes"
 
export interface Conversation {
  _id: string;
  participants: User[];
  latestMessage: Message | null;
  chatName: string | null;
  createdAt: string;
  updatedAt: string;
  unreadCount:number;
  conversations:string[] | null;
  groupChats?:string[] | null;
}
export interface ConversationsResponse {
  chats: Conversation[];
}
   
export interface CreateConversationData {
  receiverId: string;
}

export interface ChatListItemProps {
  avatar: string | null;
  alt?: string | null;
  initialName?: string | null;
  name: string;
  message: any;
  time: string;
  unread?: boolean | string;
  isOpen: boolean;
  isActive?: boolean,
  onClick?: () => void;
  onDeleteClick?: () => void;
  onViewProfile?: () => void;
  onMenuToggle?: (open: boolean) => void;
}