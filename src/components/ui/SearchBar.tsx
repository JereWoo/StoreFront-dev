// src/components/ui/SearchBar.tsx
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-lg">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600 pointer-events-none z-10" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search..."}
        className="rounded-full pl-10 pr-5 py-2"
      />
    </div>
  );
}
