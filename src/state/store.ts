import { create } from "zustand";
import { FilterState, State } from "../types/state";
import { allFilterSections, timeseriesFiltersNotDateRange, timeseriesViews } from "../config/filters";
import { mapConfig } from "../config/map";
import { unpack } from "msgpackr/unpack";
import { devtools } from "zustand/middleware";
import { exportData } from "../utils/packageAndZipData";

export let staticData: any = [];

const getDateRangeStrings = (dateRange: string[]) => {
  // YYYY-MM
  const [start, end] = dateRange;
  let current = start;
  const dates = [];
  const maxIters = 1000;
  let i = 0;

  while (current <= end) {
    i++;

    if (i > maxIters) {
      break;
    }
    dates.push(current);
    const [year, month] = current.split("-").map((v) => parseInt(v));
    const nextMonth = (month % 12) + 1;
    const nextMonthString = nextMonth.toString().padStart(2, "0");
    let yearString = year.toString();
    if (nextMonth === 1) {
      yearString = (year + 1).toString();
    }
    current = `${yearString}-${nextMonthString}`;
  }
  return dates;
};

const infillTimeseries = (
  data: Record<string, any>[],
  config: any,
  dateRange: string[]
) => {
  const { keyCol, dataCol, dateCol } = config;
  const uniqueKeys = data
    .map((record) => record[keyCol])
    .filter((value, index, self) => self.indexOf(value) === index);
  const dates = getDateRangeStrings(dateRange);

  let dateIndex = 0;
  let entriesInYear: string[] = [];

  const cleanedData = [];
  const columns = data?.length
    ? Object.keys(data[0])
    : [keyCol, dataCol, dateCol];

  for (let i = 0; i < data.length; i++) {
    const record = data[i];
    const key = record[keyCol];
    const date = record[dateCol];
    const rowDateIndex = dates.indexOf(date);

    if (rowDateIndex !== dateIndex) {
      const missingDates = dates.slice(dateIndex, rowDateIndex);
      for (const missingDate of missingDates) {
        const missingEntries = uniqueKeys.filter(
          (key) => !entriesInYear.includes(key)
        );
        entriesInYear = [];
        for (const missingEntry of missingEntries) {
          const newRecord: any = {};
          columns.forEach((col) => {
            if (col === keyCol) {
              newRecord[col] = missingEntry;
            } else if (col === dataCol) {
              newRecord[col] = 0;
            } else if (col === dateCol) {
              newRecord[col] = missingDate
            } else {
              newRecord[col] = null;
            }
          });
          cleanedData.push(newRecord);
        }
      }
    }

    dateIndex = rowDateIndex;
    entriesInYear.push(key);
    cleanedData.push(record);
  }

  return cleanedData;
};

const constructQuery = (
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

const deepCloneRecords = (records: Array<Record<string, unknown>>) => {
  const cloned: any[] = [];
  records.forEach((record) => {
    const recordClone: Record<string, unknown> = {};
    for (const key in record) {
      recordClone[key] = record[key];
    }
    cloned.push(recordClone);
  });
  return cloned;
};

const findExistingFilter = (
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
type WrapperFn = <T extends any>(fn: T) => T;
const wrapper: WrapperFn =
  process.env.NODE_ENV === "development"
    ? (devtools as WrapperFn)
    : (fn: any) => fn;

export const useStore = create<State>(
  wrapper((set, get) => ({
    download: (format: string) => {
      const view = get().view;

      const info: any = {
        map: {
          Geography: get().geography,
        },
        timeseries: {
          "Time Series Grouping": get().timeseriesType,
        },
      };
      const filterKeys = get().filterKeys 
      const filters = get().queriedFilters.filter((f) => filterKeys.includes(f.label))

      exportData(
        format,
        get().view,
        filters,
        staticData,
        view in info ? info[view] : undefined
      );
    },
    timestamp: 0,
    alwaysApplyFilters: localStorage.getItem("alwaysApplyFilters") === "true",
    toggleAlwaysApplyFilters: () => {
      set((state) => {
        const newValue = !state.alwaysApplyFilters;
        localStorage.setItem("alwaysApplyFilters", newValue.toString());
        return { alwaysApplyFilters: newValue };
      });
    },
    loadingState: "unloaded" as State["loadingState"],
    geography: mapConfig[0].layer!,
    queryEndpoint: mapConfig[0].endpoint,
    mapLayer: "pesticide-use",
    view: "map",
    setView: (view: string) => {
      let timeseriesConfig = view === "timeseries" ? timeseriesViews[0] : {} as any;
      const uiFilters = get().uiFilters
      if (view === "timeseries") {
        const existingFilter = uiFilters.find(f => timeseriesFiltersNotDateRange.includes(f.label))
        const existingLabel = existingFilter?.label as string
        if (existingLabel) {
          timeseriesConfig = timeseriesViews.find(
            (view) => view.filterKeys.includes(existingLabel as any)
          );
        }
      }
      const geography = get().geography;
      const mapViewConfig =
        view === "map"
          ? mapConfig.find((f) => f.layer == geography) || mapConfig[0]
          : ({} as any);
          
      const filterKeys = timeseriesConfig.filterKeys || [];
      const timeseriesType = timeseriesConfig.label || get().timeseriesType;
      const queryEndpoint = timeseriesConfig.endpoint || mapViewConfig.endpoint || get().queryEndpoint;

      set({
        view,
        loadingState: "settings-changed",
        queryEndpoint,
        geography,
        // @ts-ignore
        filterKeys,
        timeseriesType
      })
    },
    timeseriesType: "AI Class",
    setTimeseriesType: (type: string) => {
      const timeseriesConfig = timeseriesViews.find(
        (view) => view.label === type
      );
      if (timeseriesConfig) {
        const filterKeys = (timeseriesConfig.filterKeys || []) as unknown as string[]
        set({
          timeseriesType: type,
          filterKeys,
          queryEndpoint: timeseriesConfig?.endpoint || "",
          uiFilters: get().uiFilters.filter((f) => filterKeys.includes(f.label)),
          loadingState: "settings-changed",
        });
      }
    },
    queriedFilters: [],
    uiFilters: allFilterSections.flatMap((section) =>
      section.filters
        .filter((f) => f.alwaysInclude)
        .map((filter) => ({
          queryParam: filter.queryParam,
          value: filter.default || null,
          label: filter.label,
          valueLabels: filter.default || null,
        }))
    ),
    filterKeys: mapConfig[0].filterKeys || [],
    setFilterKeys: (keys) => set({ filterKeys: keys }),
    tooltip: undefined,
    setTooltip: (tooltip) => set({ tooltip }),
    setFilter: (filter: FilterState & { index?: number }) =>
      set((state) => {
        const filterKey = filter.queryParam;
        const existingFilterByKey = findExistingFilter(
          state.uiFilters,
          filterKey
        );
        if (existingFilterByKey) {
          return {
            loadingState: "settings-changed",
            uiFilters: state.uiFilters.map((f) =>
              f.queryParam === filterKey ? filter : f
            ),
          };
        } else {
          return {
            loadingState: "settings-changed",
            uiFilters: [...state.uiFilters, filter],
          };
        }
      }),
    setQueryEndpoint: (endpoint) => set({ queryEndpoint: endpoint }),
    executeQuery: async () => {
      set({ loadingState: "loading" });
      const queryEndpoint = get().queryEndpoint;
      const uiFilters = get().uiFilters;
      const filterKeys = get().filterKeys;
      const view = get().view;
      // if is timeseries and filters that are not date ragen is empty or greater than 10
      // error
      if (view === "timeseries") {
        const nonDateKey = filterKeys.filter((f) => f !== "Date Range");
        for (const key of nonDateKey) {
          const filterState = uiFilters.find((filter) => filter.label === key);
          const filterExists = Array.isArray(filterState?.value)
            ? filterState?.value.length > 0
            : filterState?.value !== null;

          if (!filterExists || !filterState) {
            set({
              loadingState: "timeseries-none",
            });
            return;
          }
          const filterGoodLength = Array.isArray(filterState?.value)
            ? filterState?.value.length < 10
            : true;
          if (!filterGoodLength) {
            set({
              loadingState: "timeseries-too-many",
            });
            return;
          }
        }
      }
      const url = constructQuery(
        `${import.meta.env.VITE_DATA_ENDPOINT}${queryEndpoint}`,
        uiFilters,
        filterKeys
      );
      const response = await fetch(url);

      const timestamp = performance.now();
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        staticData = unpack(buffer as Buffer);
        if (get().view === "timeseries") {
          const config = timeseriesViews.find(
            (view) => view.label === get().timeseriesType
          );
          const dateRange = get().uiFilters.find(
            (filter) => filter.label === "Date Range"
          );
          staticData = infillTimeseries(
            staticData,
            config,
            dateRange?.value as string[]
          );
        }
        // @ts-ignore
        window.staticData = staticData;
        if (staticData.length === 0) {
          set({
            loadingState: "no-data",
            queriedFilters: deepCloneRecords(uiFilters),
            timestamp,
          });
        } else {
          set({
            loadingState: "loaded",
            queriedFilters: deepCloneRecords(uiFilters),
            timestamp,
          });
        }
      } else {
        set({ loadingState: "error", timestamp });
      }
    },
    setGeography: (geography) => {
      const geoData = mapConfig.find((config) => config.layer === geography);
      if (geoData) {
        set({
          geography,
          queryEndpoint: geoData.endpoint,
          loadingState: "settings-changed",
          filterKeys: geoData.filterKeys || [],
        });
      }
    },
    setMapLayer: (mapLayer) => set({ mapLayer }),
  }))
);

const timeoutDuration = 500;
let timeoutFn: any = null;

useStore.subscribe((state, prev) => {
  const somethingChanged =
    state.uiFilters !== prev.uiFilters ||
    state.alwaysApplyFilters !== prev.alwaysApplyFilters ||
    state.geography !== prev.geography;
  if (state.alwaysApplyFilters && somethingChanged) {
    if (timeoutFn) {
      clearTimeout(timeoutFn);
    }
    timeoutFn = setTimeout(() => {
      state.executeQuery();
    }, timeoutDuration);
  }
});
