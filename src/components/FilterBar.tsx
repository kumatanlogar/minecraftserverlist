import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  category: string;
  version: string;
  country: string;
  sortBy: string;
  onCategoryChange: (value: string) => void;
  onVersionChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onReset: () => void;
}

export const FilterBar = ({
  category,
  version,
  country,
  sortBy,
  onCategoryChange,
  onVersionChange,
  onCountryChange,
  onSortByChange,
  onReset,
}: FilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-3 p-4 bg-card rounded-lg border border-border">
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="survival">Survival</SelectItem>
          <SelectItem value="pvp">PvP</SelectItem>
          <SelectItem value="creative">Creative</SelectItem>
          <SelectItem value="skyblock">Skyblock</SelectItem>
          <SelectItem value="minigames">Minigames</SelectItem>
          <SelectItem value="roleplay">Roleplay</SelectItem>
        </SelectContent>
      </Select>

      <Select value={version} onValueChange={onVersionChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Version" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Versions</SelectItem>
          <SelectItem value="1.20">1.20.x</SelectItem>
          <SelectItem value="1.19">1.19.x</SelectItem>
          <SelectItem value="1.18">1.18.x</SelectItem>
          <SelectItem value="1.17">1.17.x</SelectItem>
          <SelectItem value="1.16">1.16.x</SelectItem>
        </SelectContent>
      </Select>

      <Select value={country} onValueChange={onCountryChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Countries</SelectItem>
          <SelectItem value="US">United States</SelectItem>
          <SelectItem value="GB">United Kingdom</SelectItem>
          <SelectItem value="DE">Germany</SelectItem>
          <SelectItem value="FR">France</SelectItem>
          <SelectItem value="CA">Canada</SelectItem>
          <SelectItem value="AU">Australia</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="votes">Most Votes</SelectItem>
          <SelectItem value="players">Most Players</SelectItem>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="name">Name A-Z</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={onReset}>
        Reset Filters
      </Button>
    </div>
  );
};
