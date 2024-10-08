import React from "react";
import { FilterSpec } from "../types/state";
import { AutoComplete } from "./Autocomplete";
import { useStore } from "../state/store";
// import { RadioButtonsGroup } from "./Radio";
import { MultipleSelectCheckmarks } from "./Dropdown";
import { RangeSlider } from "./Range";
import { MonthPicker } from "./MonthRange";
import { timeseriesViews } from "../config/filters";

export const FilterControl: React.FC<{spec: FilterSpec}> = ({
  spec
}) => {
  const setFilter = useStore((state) => state.setFilter);
  const filterFn = Array.isArray(spec.queryParam)
    ? (f: any) => {
        return (spec.queryParam as string[]).every(
          (q, i) => f.queryParam[i] === q
        );
      }
    : (f: any) => f.queryParam === spec.queryParam;
  const filterState = useStore((state) => state.uiFilters.find(filterFn));
  const loadingState = useStore((state) => state.loadingState);
  const timeseriesType = useStore(state => state.timeseriesType)
  const config = timeseriesViews.find(f => f.label === timeseriesType)
  const isMainTimeseries = config?.mainFilterKey === spec.label
  const stateIsTimeseriesError = loadingState.includes('timeseries') && isMainTimeseries

  const handleChange = (value: string | string[] | number | number[] | null,
    valueLabels: string | string[] | number | number[] | null
  ) => {
    setFilter({ label: spec.label, queryParam: spec.queryParam, value, valueLabels });
  } 

  switch (spec.component) {
    // case 'radio':
    //   return <RadioButtonsGroup spec={spec} onChange={handleChange} value={filterState?.value as string || ''} />
    case 'autocomplete':
      return <AutoComplete spec={spec} onChange={handleChange} state={filterState} focused={stateIsTimeseriesError} />
    case 'autocomplete-no-list':
      return <AutoComplete spec={spec} onChange={handleChange} state={filterState} focused={stateIsTimeseriesError} showList={false}/>
    case 'dropdown':
      return <MultipleSelectCheckmarks spec={spec} onChange={handleChange} state={filterState} />
    // case 'date':
    //   return <div>Date</div>;
    case 'range':
      return <RangeSlider spec={spec} onChange={handleChange as any} state={filterState as any} />
    case 'month-range':
      return <MonthPicker spec={spec} onChange={handleChange} state={filterState} />
    default:
      throw new Error(`Unknown component type: ${spec.component}`);
  }
}