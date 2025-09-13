import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalizeString = (val: string) => {
  return `${val.slice(0, 1).toUpperCase()}${val.slice(1)}`;
};
