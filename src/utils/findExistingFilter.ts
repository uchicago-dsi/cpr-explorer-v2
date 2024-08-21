import { FilterState } from "../types/state";

export const findExistingFilter = (
  filters: FilterState[],
  filterKey: string | string[]
) => {
  const search = Array.isArray(filterKey)
    ? (row: any) =>
        Array.isArray(row.queryParam) &&
        row.queryParam.every((p: any, i: number) => p === filterKey[i])
    : (row: any) => row.queryParam === filterKey;
  return filters.find(search);
};