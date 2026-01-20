import { useState, ChangeEvent, FormEvent } from "react";

interface SearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

const SearchComponent: React.FC<SearchProps> = ({
  placeholder = "Search...",
  onSearch,
}) => {
  const [query, setQuery] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md items-center gap-2 rounded-xl border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-gray-500"
    >
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 rounded-lg px-3 text-sm outline-none"
      />
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
};

export default SearchComponent;
