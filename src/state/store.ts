import { create } from "zustand";
import { FilterState, State } from "../types/state";
import { allFilterSections, timeseriesFiltersNotDateRange, timeseriesViews } from "../config/filters";
import { mapConfig } from "../config/map";
import { unpack } from "msgpackr/unpack";
import { exportData } from "../utils/packageAndZipData";
import { infillTimeseries } from "../utils/timeseries";
import { wrapper } from "../utils/stateUtils";
import { findExistingFilter } from "../utils/findExistingFilter";
import { constructQuery } from "../utils/constructQuery";
import { deepCloneRecords } from "../utils/deepCloneRecords";

export let staticData: any = [];
const timeoutDuration = 500;
let timeoutFn: any = null;

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
        view === "map" || view === 'mapDualView'
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
    setLoadingState: (loadingState) => set({ loadingState }),
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
            ? filterState?.value.length <= 10
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


useStore.subscribe((state, prev) => {
  const somethingChanged =
    state.uiFilters !== prev.uiFilters ||
    state.alwaysApplyFilters !== prev.alwaysApplyFilters ||
    state.geography !== prev.geography ||
    state.view !== prev.view;
  if (state.alwaysApplyFilters && somethingChanged) {
    if (timeoutFn) {
      clearTimeout(timeoutFn);
    }
    timeoutFn = setTimeout(() => {
      state.executeQuery();
    }, timeoutDuration);
  }
});
