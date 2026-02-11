import React from "react";
import ChatListItem from "@/features/chat/components/ChatListItem";
import { useConversation } from "@/features/chat/hooks/useConversation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useMessages } from "@features/chat/hooks/useMessage";
import { Atom } from "react-loading-indicators";

const ChatList = () => {
  const { conversations, loading, removeConversation } = useConversation();
  const { fetchMessages } = useMessages();
  const { user} = useAuth(); 

 const handleDeleteConversation = (id: string) => {
  removeConversation(id);
};

  if (loading) {
    return <div className="text-gray-400 p-4"><Atom color="#c6ddc6" size="small" textColor="#643c3c" /></div>;
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="text-gray-400 text-center mt-6">
        No conversations yet
      </div>
    );
  }

  return (
    <div className="w-full max-w-[330px] bg-black text-white overflow-y-auto p-2">
    
    {conversations.map((conv) => {   
    const participants = conv.participants || [];
    // Get the user that is NOT you
    const otherUser = participants.find( (p) => String(p?._id) !== String(user?._id) );
    // Full name
    const fullName = otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "Unknown User";
    // Initials (F and L)
    const firstCharName = otherUser ? `${otherUser.firstName?.charAt(0) || ""}${otherUser.lastName?.charAt(0) || ""}`.toUpperCase() : "?";
    // Profile Picture
    const profilePicture = otherUser?.profilePicture || null;
    
      return (
        <ChatListItem
          key={conv._id}
          avatar={profilePicture || "/default-avatar.png"}
          initialName={firstCharName}
          alt={fullName}
          name={conv.chatName || fullName || "null"}
          message={conv.latestMessage?.content || "No messages yet"}
          time={ conv.latestMessage ? new Date(conv.latestMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "" }
          onClick={()=> { fetchMessages(conv._id) }}
          onDeleteClick={() => handleDeleteConversation(conv._id)} 

        />
      );
    })}
    </div>
  );
};

export default ChatList;
