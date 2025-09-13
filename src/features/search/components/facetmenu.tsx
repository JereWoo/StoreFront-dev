import { cn } from "@/lib/utils.ts";
import { useState } from "react";
import { useGetFacetsQuery } from "@/generated/hooks.ts";
import { GetFacetsQuery } from "@/generated/graphql.ts";

type FacetMenuProps = {
  selected: string[];
  onChange: (ids: string[]) => void;
};

export function FacetMenu({ selected, onChange }: FacetMenuProps) {
  const { data, isLoading, error } = useGetFacetsQuery();
  const [active, setActive] = useState<string | null>(null);

  if (isLoading) return <p>Loading facets…</p>;
  if (error) return <p>Failed to load facets</p>;

  const facets: GetFacetsQuery["facets"]["items"] = data?.facets.items ?? [];

  const toggleValue = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((v) => v !== id)
        : [...selected, id],
    );
  };

  return (
    <div className="flex h-[500px]">
      {/* Left: categories */}
      <div className="w-48 border-r pr-2">
        <ul className="space-y-2">
          {facets.map((facet) => (
            <li
              key={facet.id}
              onClick={() => setActive(facet.id)}
              className={cn(
                "cursor-pointer px-2 py-1 rounded",
                active === facet.id
                  ? "bg-emerald-100 text-emerald-800"
                  : "hover:bg-gray-100",
              )}
            >
              {facet.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Right: facet values */}
      <div className="flex-1 pl-4">
        {active && (
          <div className="space-y-2">
            {facets
              .find((f) => f.id === active)
              ?.values.map((val) => (
                <label key={val.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(val.id)}
                    onChange={() => toggleValue(val.id)}
                  />
                  {val.name}
                </label>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
