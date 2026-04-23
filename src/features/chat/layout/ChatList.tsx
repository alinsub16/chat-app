import { useState, useRef } from "react";
import ChatListItem from "@/features/chat/components/ChatListItem";
import { useConversation } from "@/features/chat/hooks/useConversation";
import { useProfile } from "@/features/userProfile/hooks/useProfile";
import { useMessages } from "@features/chat/hooks/useMessage";
import { useProfileView } from "@/features/userProfile/hooks/useProfileView";
import ConversationListSkeleton from "@/features/chat/components/ConversationListSkeleton";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useSocket } from '@features/chat/hooks/useSocket';

const ChatList = () => {
  const { conversations, loading, removeConversation } = useConversation();
  const { fetchMessages } = useMessages();
  const { user} = useProfile(); 
  const { getUserProfile } = useProfileView();
  const { onlineUsers } = useSocket();

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  

  const containerRef = useRef<HTMLDivElement>(null);

  // When clicking outside it will outomatically close the toggleMenu
  useOnClickOutside(containerRef, () => { setOpenMenuId(null); });

  const handleMenuToggle = (chatId: string, open: boolean) => {
    setOpenMenuId(open ? chatId : null);
  };

  const handleViewProfile = async (userId: string) => {
    await getUserProfile(userId);
    
  };

  const handleDeleteConversation = (id: string) => {
  removeConversation(id);
  };

  if (loading) { return <ConversationListSkeleton /> }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="text-gray-400 text-center mt-6">
        No conversations yet
      </div>
    );
  }

  

  return (
    <div ref={containerRef} className="w-full max-w-[330px] bg-[#0d1117] text-white overflow-y-auto p-2">
    
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

    //ONLINE CHECK (this is the key part)
    const isOnline = onlineUsers?.some( (id: string) => String(id) === String(otherUser?._id) );

      return (
        
        <ChatListItem
          key={conv._id}
          avatar={profilePicture}
          initialName={firstCharName}
          alt={fullName}
          name={conv.chatName || fullName || "null"}
          message={conv.latestMessage?.content ?? "No messages yet"}
          time={conv.latestMessage ? new Date(conv.latestMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "" }
          isOpen={openMenuId === conv._id}
          onMenuToggle={(open) => handleMenuToggle(conv._id, open)}
          isActive={activeConversationId === conv._id}
          onClick={() => { 
            setOpenMenuId(null);
            setActiveConversationId(conv._id);
            fetchMessages(conv._id);
          }}
          isOnline={isOnline}
          onDeleteClick={() => handleDeleteConversation(conv._id)} 
          onViewProfile={() => { 
            if (!otherUser?._id) 
            return; handleViewProfile(otherUser._id);
           }} 
        />
      );
    })}
    
    </div>
  );
};

export default ChatList;
