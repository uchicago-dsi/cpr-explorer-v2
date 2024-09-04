import { create } from "zustand";
import { FilterState, State } from "../types/state";
import {
  allFilterSections,
  timeseriesFiltersNotDateRange,
  timeseriesViews,
} from "../config/filters";
import { mapConfig } from "../config/map";
import { unpack } from "msgpackr/unpack";
import { exportData } from "../utils/packageAndZipData";
import { infillTimeseries } from "../utils/timeseries";
import { wrapper } from "../utils/stateUtils";
import { findExistingFilter } from "../utils/findExistingFilter";
import { constructQuery } from "../utils/constructQuery";
import { deepCloneRecords } from "../utils/deepCloneRecords";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

export let staticData: any = [];
const timeoutDuration = 500;
let timeoutFn: any = null;

export const useStore = create<State>(
  wrapper((set, get) => ({
    download: (format, indices, sortKeys) => {
      const view = get().view;

      const info: any = {
        map: {
          Geography: get().geography,
        },
        timeseries: {
          "Time Series Grouping": get().timeseriesType,
        },
      };
      const filterKeys = get().filterKeys;
      const filters = get().queriedFilters.filter((f) =>
        filterKeys.includes(f.label)
      );
      const uiFilters = get().uiFilters;
      const availableFiltersNotUsed = filterKeys.filter(
        (f) => !filters.find((u) => u.label === f)
      ).map(f => ({
        ...(uiFilters.find((u) => u.queryParam === f) || {}),
        value: "Not Used"
      }))

      const allFilters = [
        ...filters,
        ...availableFiltersNotUsed
      ]

      const outputData = indices
        ? indices.map((i) => staticData[i])
        : staticData;

      const sortFn = !sortKeys ? null : Array.isArray(sortKeys) 
        ? (a: any, b: any) => {
          const aKey = sortKeys.map((key) => a[key]).join("");
          const bKey = sortKeys.map((key) => b[key]).join("");
          return aKey.localeCompare(bKey);
        } 
        : (a: any, b: any) => a[sortKeys].localeCompare(b[sortKeys])

        const sortedOutputData = sortFn 
          ? outputData.sort(sortFn)
          : outputData
        
      exportData(
        format,
        get().view,
        allFilters,
        sortedOutputData,
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
      let timeseriesConfig =
        view === "timeseries" ? timeseriesViews[0] : ({} as any);
      let uiFilters = get().uiFilters;

      const geography = get().geography;
      const mapViewConfig =
        view === "map" || view === "mapDualView"
          ? mapConfig.find((f) => f.layer == geography) || mapConfig[0]
          : ({} as any);

      let filterKeys = timeseriesConfig.filterKeys || [];
      if (view === "timeseries") {
        const existingFilter = uiFilters.find(
          (f) =>
            timeseriesFiltersNotDateRange.includes(f.label) &&
            (((Array.isArray(f.value || f.valueLabels) ||
              typeof (f.value || f.valueLabels) === "string") &&
              ((f.value as any[])?.length ||
                (f.valueLabels as any[])?.length)) ||
              typeof f.value === "number")
        );
        const existingLabel = existingFilter?.label as string;
        if (existingLabel) {
          timeseriesConfig = timeseriesViews.find((view) =>
            view.filterKeys.includes(existingLabel as any)
          );
        } else {
          const newFilters: FilterState[] =
            timeseriesConfig?.defaultFilterOptions || [];
          uiFilters = uiFilters.filter((f) =>
            newFilters.every((nf) => nf.queryParam !== f.queryParam)
          );

          uiFilters = [...uiFilters, ...newFilters];
        }
      } else if (view.toLowerCase().includes("map")) {
        filterKeys = mapViewConfig.filterKeys || [];
      }

      const timeseriesType = timeseriesConfig.label || get().timeseriesType;
      const queryEndpoint =
        timeseriesConfig.endpoint ||
        mapViewConfig.endpoint ||
        get().queryEndpoint;

      set({
        view,
        loadingState: "settings-changed",
        queryEndpoint,
        geography,
        uiFilters,
        // @ts-ignore
        filterKeys,
        timeseriesType,
      });

      get().executeQuery();
    },
    timeseriesType: timeseriesViews[0].label,
    setTimeseriesType: (type: string) => {
      const timeseriesConfig = timeseriesViews.find(
        (view) => view.label === type
      );
      if (timeseriesConfig) {
        const filterKeys = (timeseriesConfig.filterKeys ||
          []) as unknown as string[];
        set({
          timeseriesType: type,
          filterKeys,
          queryEndpoint: timeseriesConfig?.endpoint || "",
          uiFilters: get().uiFilters.filter((f) =>
            filterKeys.includes(f.label)
          ),
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
          valueLabels: filter.defaultLabel || filter.default || null,
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

      const timestamp = performance.now();
      const agFilter = uiFilters.find((f) => f.queryParam === "usetype")?.value === 'NON-AG';

      if (get().view.toLowerCase().includes("map") && get().geography !== "Counties" && agFilter) {
        set({
          loadingState: "ag-on-not-counties",
          queriedFilters: deepCloneRecords(uiFilters),
          timestamp,
        });
        return
      }

      const response = await fetch(url);

      if (response.ok) {
        const buffer = await response.arrayBuffer();
        staticData = unpack(buffer as Buffer);
        if (get().view === "timeseries") {
          const config = timeseriesViews.find(
            (view) => view.label === get().timeseriesType
          );
          const filters = get().uiFilters
          const dateRange = filters.find(
            (filter) => filter.label === "Date Range"
          );
          staticData = infillTimeseries(
            staticData,
            config,
            dateRange?.value as string[],
            filters
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
    setSaveMessage: (message) => set({ saveMessage: message }),
    saveMessage: undefined,
    saveQueries: (title, format) => {
      const output = {
        uiFilters: get().uiFilters,
        view: get().view,
        geography: get().geography,
        timeseriesType: get().timeseriesType,
        mapLayer: get().mapLayer,
      };

      const date = new Date().toISOString();
      const cleanTitle = title?.length
        ? title
        : `Pesticide Explorer Query ${date}`;
      const compressed = compressToEncodedURIComponent(JSON.stringify(output));
      switch (format) {
        case "download":
          const blob = new Blob([JSON.stringify(output)], {
            type: "application/json",
          });
          const saveUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = saveUrl;
          a.download = `${cleanTitle}.json`;
          a.click();
          set({ saveMessage: "Query JSON downloaded" });
          break;
        case "url":
          const url = new URL(window.location.href);
          url.searchParams.set("query", compressed);
          window.history.pushState({}, "", url.toString());
          // copy to clipboard
          navigator.clipboard.writeText(url.toString());
          set({
            saveMessage: `Use this URL to share your data filter selections with others:\n\n ${url}\n\n(The URL has been copied to your clipboard)`,
          });
          break;
        case "localStorage":
          let prev = JSON.parse(localStorage.getItem("saved-queries") || "[]");
          const titleInUse = prev?.find((f: any) => f.title === cleanTitle);
          if (titleInUse) {
            prev = prev.filter((f: any) => f.title !== cleanTitle);
          }
          prev = [
            ...prev,
            {
              title,
              date: new Date().toISOString(),
              data: compressed,
            },
          ];
          localStorage.setItem("saved-queries", JSON.stringify(prev));
          set({ saveMessage: "Queried saved to your browser" });
          break;
      }
    },
    loadQueries: (title, format, _args) => {
      let args = {
        ...(_args || {}),
      };
      switch (format) {
        case "url":
          const url = new URL(window.location.href);
          const urlQuery = url.searchParams.get("query");
          if (urlQuery) {
            args = JSON.parse(decompressFromEncodedURIComponent(urlQuery));
          }
          break;
        case "download":
          break;
        case "localStorage":
          const prev = JSON.parse(
            localStorage.getItem("saved-queries") || "[]"
          );
          const localStorageQuery = prev.find((f: any) => f.title === title);
          if (localStorageQuery) {
            args = JSON.parse(
              decompressFromEncodedURIComponent(localStorageQuery.data)
            );
          }
          break;
      }
      switch (args.view) {
        case "timeseries":
          const timeseriesType = timeseriesViews.find(
            (view) => view.label === args.timeseriesType
          );
          if (timeseriesType) {
            args = {
              ...args,
              // @ts-ignore
              filterKeys: timeseriesType.filterKeys || [],
              queryEndpoint: timeseriesType.endpoint,
            };
          }
          break;
        case "mapDualView":
        case "map":
          const geoData = mapConfig.find(
            (config) => config.layer === args.geography
          );
          if (geoData) {
            args = {
              ...args,
              queryEndpoint: geoData.endpoint,
              filterKeys: geoData.filterKeys || [],
            };
            break;
          }
      }
      set({
        ...args,
        loadingState: "settings-changed",
      });
    },
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
