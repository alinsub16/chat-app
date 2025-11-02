import { User } from "../features/auth/types/auth";

export interface Chat {
  _id: string;
  chatName: string;
  members: User[];
  isGroupChat: boolean;
  latestMessage:string;
  groupAdmin:User;
  createdAt: string;
  
}
export interface CreateChatData {
  chatName: string;                // required for GC
  members: string[];           // user IDs of members
}
