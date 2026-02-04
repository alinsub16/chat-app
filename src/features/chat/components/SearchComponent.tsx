import { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface SearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

const SearchComponent: React.FC<SearchProps> = ({ placeholder = "Search...", onSearch, }) => {
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
      className="flex w-full max-w-md items-center p-1 gap-2 rounded-xl border border-gray-600 focus-within:ring-1 focus-within:ring-gray-600"
    >
      <Input 
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          variant="search_input"
      />
      <Button
       type="submit"
       text="Search"
        className="rounded-lg bg-primary px-4 py-2 text-sm text-gray-400 font-small transition hover:bg-primary-light "
      />
    </form>
  );
};

export default SearchComponent;
