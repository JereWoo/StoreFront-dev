import { useState } from "react";
import { Button } from "@/components/ui/9ui/button";
import { Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/9ui/dialog";
import { FacetMenu } from "@/components/ui/composites/facetmenu";

type FilterModalProps = {
  onApply: (ids: string[]) => void; // ⬅️ NEW prop to send selected IDs up
};

export function FilterModal({ onApply }: FilterModalProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]); // ⬅️ track facetValueIds locally

  return (
    <div className="mb-4">
      {/* pill button */}
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="flex items-center gap-2 rounded-full px-5 py-2"
      >
        <Filter className="h-4 w-4" />
        Filters
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Filter Products</DialogTitle>
          </DialogHeader>

          {/* facets now accept selection state */}
          <FacetMenu selected={selected} onChange={setSelected} />

          <div className="flex justify-end gap-2 mt-6">
            <Button
              onClick={() => {
                onApply(selected); // ⬅️ send selected IDs up
                setOpen(false);
              }}
            >
              Apply
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSelected([]); // ⬅️ clear local state
                onApply([]); // ⬅️ clear filters upstream
                setOpen(false);
              }}
              className="rounded-full"
            >
              Clear
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
