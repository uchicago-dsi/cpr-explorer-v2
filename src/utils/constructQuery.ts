import { FilterState } from "../types/state";

export const constructQuery = (
  endpoint: string,
  filters: FilterState[],
  filterKeys: string[] = [],
  useMsgpack: boolean = true
) => {
  const url = new URL(endpoint);
  if (useMsgpack) {
    url.searchParams.set("format", "msgpack");
  }
  filters.forEach((filter) => {
    if (filterKeys.length > 0 && !filterKeys.includes(filter.label as string)) {
      return;
    }
    const queryIsCompound = Array.isArray(filter.queryParam);
    const valueIsCompound = Array.isArray(filter.value);
    const valueIsGood =
      (Array.isArray(filter.value) && filter.value.length > 0) ||
      (typeof filter.value === "string" && filter.value.length > 0) ||
      (typeof filter.value === "number" &&
        filter.value !== null &&
        filter.value !== undefined);
    if (!valueIsGood) {
      return;
    }
    const value =
      valueIsCompound && !queryIsCompound
        ? (filter.value as any[]).join(",")
        : filter.value;
    if (queryIsCompound && valueIsCompound) {
      const val = filter.value as string[];
      url.searchParams.set(filter.queryParam[0], val[0]);
      url.searchParams.set(filter.queryParam[1], val[1]);
    } else {
      url.searchParams.set(filter.queryParam as string, value as string);
    }
  });
  return url.toString();
};