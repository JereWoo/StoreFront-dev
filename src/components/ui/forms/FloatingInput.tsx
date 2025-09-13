import * as React from "react";
import { cn } from "@/lib/utils.ts"; // adjust if you don’t have cn()

export interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export const FloatingInput = React.forwardRef<
  HTMLInputElement,
  FloatingInputProps
>(({ id, label, className, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <input
        id={id}
        ref={ref}
        placeholder=" "
        className={cn(
          "peer block w-full rounded-md border border-input bg-background px-3 pt-5 pb-2 text-sm text-foreground",
          "focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(
          "absolute left-3 top-2 text-muted-foreground text-sm transition-all",
          "peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm",
          "peer-focus:top-2 peer-focus:text-xs peer-focus:text-ring",
        )}
      >
        {label}
      </label>
    </div>
  );
});

FloatingInput.displayName = "FloatingInput";
