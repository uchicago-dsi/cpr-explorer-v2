import { create } from "zustand";
import { FilterState, State } from "../types/state";
import { allFilterSections, timeseriesViews } from "../config/filters";
import { mapConfig } from "../config/map";
import { unpack } from "msgpackr/unpack";
import { devtools } from "zustand/middleware";
import { exportData } from "../utils/packageAndZipData";

export let staticData: any = [];

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

      exportData(
        format,
        get().view,
        get().queriedFilters,
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
    setView: (view: string) =>
      set({
        view,
        loadingState: "settings-changed",
        // @ts-ignore
        filterKeys: view === "timeseries" ? timeseriesViews[0].filterKeys : [],
        timeseriesType:
          view === "timeseries" ? timeseriesViews[0].label : "AI Class",
      }),
    timeseriesType: "AI Class",
    setTimeseriesType: (type: string) => {
      const spec = timeseriesViews.find((view) => view.label === type);
      if (spec) {
        set({
          timeseriesType: type,
          // @ts-ignore
          filterKeys: spec?.filterKeys || [],
          queryEndpoint: spec?.endpoint || "",
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
