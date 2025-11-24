import React from "react";
import ChatListItem from "@/features/chat/components/ChatListItem";
import { useConversation } from "@/features/chat/hooks/useConversation";
import { useAuth } from "@/features/auth/hooks/useAuth";

const ChatList = () => {
  const { conversations, loading } = useConversation();
  const { user } = useAuth(); // current logged-in user

  if (loading) {
    return <div className="text-gray-400 p-4">Loading chats...</div>;
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="text-gray-400 text-center mt-6">
        No conversations yet
      </div>
    );
  }

  return (
    <div className="w-[320px] h-screen bg-black text-white overflow-y-auto p-2">
    
      {conversations.map((conv) => {
      const participants = conv.participants || [];
    // Get the user that is NOT you
    const otherUser = participants.find(
  (p) => String(p?._id) !== String(user?._id)
);
    // console.log("participant ids:", participants.map(p => p._id));
console.log("user id:", user?._id);
// console.log("types:", participants.map(p => typeof p._id), typeof user?._id);
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
        />
      );
    })}
    </div>
  );
};

export default ChatList;
