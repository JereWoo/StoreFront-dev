// src/components/ui/SearchBar.tsx
import { Input } from "@/components/ui/9ui/input";
import { IconSearch } from "@tabler/icons-react";

type SearchBarProps = {
  value: string;
  onChange: (val: string) => void;
  onSubmit?: (val: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder,
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && onSubmit) {
      onSubmit(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-lg">
      <IconSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600 pointer-events-none z-10" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search..."}
        className="rounded-full pl-10 pr-5 py-2"
      />
    </form>
  );
}
