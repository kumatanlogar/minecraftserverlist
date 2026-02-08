import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export const SearchBar = ({ value, onChange, onSearch }: SearchBarProps) => {
  return (
    <div className="flex gap-2 w-full max-w-2xl">
      <Input
        type="text"
        placeholder="Search servers by name, IP, or tags..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        className="flex-1 bg-card border-border"
      />
      <Button onClick={onSearch} className="bg-gradient-primary hover:opacity-90">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  );
};
