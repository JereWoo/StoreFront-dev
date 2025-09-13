// /lib/usePagination.ts
import { useState } from "react";

export function usePagination(initialPage = 1, take = 12) {
  const [page, setPage] = useState(initialPage);
  const skip = (page - 1) * take;

  return { page, setPage, skip, take };
}
