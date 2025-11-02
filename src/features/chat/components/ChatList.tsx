import React, { useEffect } from "react";
import ChatListItem from "./ChatListItem";
import { useConversation } from "../hooks/useConversation";
import { useAuth } from "@/features/auth/hooks/useAuth";

const ChatList = () => {
  const { conversations, loading, refreshConversations } = useConversation();
  const { user } = useAuth(); // current logged-in user

  if (loading) return <div className="text-gray-400 p-4">Loading chats...</div>;

  return (
    <div className="w-[320px] h-screen bg-black text-white overflow-y-auto p-2">
      {conversations.length === 0 ? (
        <div className="text-gray-400 text-center mt-6">No conversations yet</div>
      ) : (
        conversations.map((conv) => {
          // Identify the other participant (not the logged-in user)
          const otherUser = conv.participants.find(
            (participant) => participant._id !== user?._id
          );

          const fullName = otherUser
            ? `${otherUser.firstName} ${otherUser.lastName}`
            : "Unknown User";

          return (
            <ChatListItem
              key={conv._id}
              avatar={otherUser?.profilePicture || "/default-avatar.png"}
              alt = {user.lastName}
              name={fullName}
              message={conv.latestMessage || "No messages yet"}
              time={
                conv.latestMessage
                  ? new Date(conv.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""
              }
              unread={
                conv.latestMessage &&
                !conv.latestMessage?.includes(user?._id || "")
              }
            />
          );
        })
      )}
    </div>
  );
};

export default ChatList;
