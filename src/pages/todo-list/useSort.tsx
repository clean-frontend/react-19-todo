import { useState } from "react";

export function useSort(defaultSort: string, onSort: (sort: string) => void) {
  const [sort, setSort] = useState(defaultSort);
  const handleChangeSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    onSort(e.target.value);
  };
  return { sort, handleChangeSort };
}
