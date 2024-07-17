"use client"
import React from "react";
import { FilterSpec } from "../types/state";
import { AutoComplete } from "./Autocomplete";
import { useStore } from "../state/store";
// import { RadioButtonsGroup } from "./Radio";
import { MultipleSelectCheckmarks } from "./Dropdown";
// import { RangeSlider } from "./Range";
import { MonthPicker } from "./MonthRange";

export const FilterControl: React.FC<{spec: FilterSpec}> = ({
  spec
}) => {
  const setFilter = useStore((state) => state.setFilter);
  const filterState = useStore((state) => state.uiFilters.find((f) => f.queryParam === spec.queryParam));

  const handleChange = (value: string | string[] | number | number[] | null,
    valueLabels: string | string[] | number | number[] | null
  ) => {
    setFilter({ label: spec.label, queryParam: spec.queryParam, value, valueLabels });
  }

  switch (spec.component) {
    // case 'radio':
    //   return <RadioButtonsGroup spec={spec} onChange={handleChange} value={filterState?.value as string || ''} />
    case 'autocomplete':
      return <AutoComplete spec={spec} onChange={handleChange} state={filterState} />
    case 'dropdown':
      return <MultipleSelectCheckmarks spec={spec} onChange={handleChange} state={filterState} />
    // case 'date':
    //   return <div>Date</div>;
    // case 'range':
    //   return <RangeSlider spec={spec} onChange={handleChange} state={filterState} />
    case 'month-range':
      return <MonthPicker spec={spec} onChange={handleChange} state={filterState} />
    default:
      throw new Error(`Unknown component type: ${spec.component}`);
  }
}