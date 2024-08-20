export type OptionLabel = {
  value: string | number;
  label: string;
  filterKeys?: string[];
}

export type DynamicOptionSpec = OptionLabel & {
  endpoint: string;
}

export type FilterSpec = {
  queryParam: string | [string, string];
  label: string;
  subLabel?: string;
  options: {
    type: 'static';
  } & {values: OptionLabel[] }| {
    type: 'dynamic';
  } & DynamicOptionSpec;
  component: 'radio' | 'autocomplete' | 'dropdown' | 'range' | 'date' | 'month-range';
  alwaysInclude?: boolean;
  range?: number[];
  default?: string | string[] | number | number[];
  format?: 'percent' | 'dollars'
}

export type FilterState = Pick<FilterSpec, 'queryParam' | 'label'> & {
  value: string | string[] | number | number[] | null;
  valueLabels: string | string[] | number | number[] | null;
}
type LoadingStates = 'unloaded' | 'settings-changed' | 'loading' | 'loaded' | 'error' | 'no-data' | 'timeseries-none' | 'timeseries-too-many';
export type State = {
  download: (foramt: string) => void;
  loadingState: LoadingStates;
  alwaysApplyFilters: boolean;
  toggleAlwaysApplyFilters: () => void;
  geography: string;
  mapLayer: string
  view: string;
  setView: (view: string) => void;
  setGeography: (geography: string) => void;
  setMapLayer: (mapLayer: string) => void;

  timeseriesType: string;
  setTimeseriesType: (type: string) => void;
  
  queriedFilters: FilterState[];
  uiFilters: FilterState[];
  filterKeys: string[];
  setFilterKeys: (keys: string[]) => void;
  setFilter: (filter: FilterState) => void;
  
  queryEndpoint: string;
  setQueryEndpoint: (endpoint: string) => void;
  executeQuery: () => void;
  timestamp: number;

  tooltip?: {
    x: any;
    y: any;
    data: any;
  },
  setTooltip: (tooltip: State['tooltip']) => void;
}

