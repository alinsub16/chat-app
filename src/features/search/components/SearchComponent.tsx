import { useState } from "react";
import { useSearchUsers } from "@/features/search/hooks/useSearchUsers";
import { Input } from "@/components/ui/Input";
import { Atom } from "react-loading-indicators";
import { useConversation } from "@/features/chat/hooks/useConversation";
import { useProfile } from "@/features/userProfile/hooks/useProfile";
import { useMessages } from "@features/chat/hooks/useMessage";
import Avatar from "@/components/ui/Avatar";

const UserSearch = () => {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const { users, loading, error, searchUsers } = useSearchUsers(300);
  const { conversations, createNewConversation, setActiveConversation } = useConversation();
  const { user } = useProfile();
  const { fetchMessages } = useMessages();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setHasSearched(false); // reset if input cleared
    } else {
      searchUsers(value);
      setHasSearched(true); // mark that a search has been performed
    }
  };

  const handleUserClick = async (userId: string) => {
    if (userId === user?._id) return;

    try {
      const existing = conversations.find(
        (conv) => conv.participants?.some((member) => member._id === userId)
      );

      if (existing) {
        fetchMessages(existing._id);
        setActiveConversation(existing);
      } else {
        const newConv = await createNewConversation({ receiverId: userId });
        setActiveConversation(newConv);
      }

      setQuery("");
      setHasSearched(false); // reset after click
    } catch (err) {
      console.error(err);
    }
  };

  const showNoUsers = hasSearched && !loading && users.length === 0;

  return (
    <div className="sm:max-w-md max-w-[190px] mx-auto relative">
      <Input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search users..."
        className=""
        variant="search_input"
      />

      {loading && (
        <span className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10">
          <Atom color="#c6ddc6" size="small" textColor="#643c3c" />
        </span>
      )}
      {error && <p className="text-red-500">{error}</p>}

      {query.trim() !== "" && (
        <div className="absolute z-10 bg-gray-700 w-full max-w-lg shadow-lg rounded mt-1">
          <ul className="mt-2 max-h-60 overflow-y-auto">
            {users.length > 0 ? (
              users.map((u) => {
                const isCurrentUser = u._id === user?._id;
                const fullName = `${u.firstName}, ${u.lastName}`
                return (
                  <li
                    key={u._id}
                    className={`flex items-center gap-2 p-2 border-b cursor-pointer hover:bg-gray-800 text-white text-sm md:text-md ${ isCurrentUser ? "cursor-not-allowed opacity-50" : "" }`}
                    onClick={() => handleUserClick(u._id)}
                  >
                    <Avatar avatar={u.profilePicture || null} name={fullName} className="sm:w-10 sm:h-10 w-7 h-7"/>
                    {u.firstName} {u.lastName} {isCurrentUser && "(Me)"}
                  </li>
                );
              })
            ) : showNoUsers ? (
              <li className="p-2 text-gray-500">No users found</li>
            ) : null}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserSearch;