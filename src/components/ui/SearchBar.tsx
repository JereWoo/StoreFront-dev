// src/components/ui/SearchBar.tsx
import { Input } from "@/components/ui/input";
import { IconSearch } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

type SearchBarProps = {
  placeholder?: string;
};

export function SearchBar({ placeholder }: SearchBarProps) {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      navigate({ to: "/products", search: { query: value.trim() } });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-lg">
      <IconSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600 pointer-events-none z-10" />
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder ?? "Search..."}
        className="rounded-full pl-10 pr-5 py-2"
      />
    </form>
  );
}
