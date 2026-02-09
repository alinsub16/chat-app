import { useState } from "react";
import { useSearchUsers } from "@/features/search/hooks/useSearchUsers";
import { Input } from "@/components/ui/Input";
import { Atom } from "react-loading-indicators";

const UserSearch = () => {
  const [query, setQuery] = useState("");
  const { users, loading, error, searchUsers } = useSearchUsers(300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    searchUsers(value); // automatically debounced
  };

  const showNoUsers = query.trim() !== "" && !loading && users.length === 0;

  return (
    <div className="max-w-md mx-auto relative">
      <Input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search users..."
        className="w-full border py-1 px-4 rounded-3xl "
        variant="search_input"
      />


      {loading && <span className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10" ><Atom color="#c6ddc6" size="small" textColor="#643c3c" /></span>}
      {error && <p className="text-red-500">{error}</p>}

      {(query.trim() !== "") && (
        <div className="absolute z-10 bg-gray-700 w-full shadow-lg rounded mt-1">
          <ul className="mt-2 max-h-60 overflow-y-auto">
            {users.length > 0 ? (
              users.map((user) => (
                <li
                  key={user._id}
                  className="p-2 border-b hover:bg-gray-800 cursor-pointer"
                  onClick={()=> console.log('User ID:',user._id)}
                >
                  {user.firstName} {user.lastName}
                </li>
              ))
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
