import { useState, useMemo } from "react";

export function usePagination(totalItems: number, take: number = 12) {
  const [page, setPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / take)),
    [totalItems, take],
  );

  const skip = (page - 1) * take;

  return { page, setPage, skip, take, totalPages };
}
