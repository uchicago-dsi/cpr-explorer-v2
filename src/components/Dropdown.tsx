import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { FilterSpec, FilterState } from "../types/state";
import { useOptions } from "../hooks/useOptions";
import { FilterValue } from "../config/filters";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const recursivelyFlattenArray = (arr: any[]): any[] => {
  return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(recursivelyFlattenArray(val)) : acc.concat(val), []);
}
// const filterUnique = (arr: any[]) => {
//   return arr.filter((value, index) => arr.indexOf(value) === index);
// }

export const MultipleSelectCheckmarks: React.FC<{
  spec: FilterSpec;
  state?: FilterState;
  onChange: (value: FilterValue, valueLabels: FilterValue) => void;
  multiple?: boolean;
}> = ({ spec, state, onChange, multiple=false }) => {
  const options = useOptions(spec);
  const value = (state?.value || []) as any[];
  const valueLabels = (state?.valueLabels || []) as any[];
  const currentOptions = value

  const handleChange = (_event: SelectChangeEvent<any>, _e: any) => {
    const newValue = _e.props.value
    const newLabel = _e.props.label || options.find((o) => o.value === newValue)?.label || newValue
    if (!multiple) {
      onChange(newValue, newLabel);
      return
    }
    const valueInSelection = value.includes(newValue);
    if (valueInSelection) {
      // @ts-ignore
      const indexOfValue = value.indexOf(newValue);
      const newValueList = value.slice(0, indexOfValue).concat(value.slice(indexOfValue + 1));
      const newLabelList = valueLabels.slice(0, indexOfValue).concat(valueLabels.slice(indexOfValue + 1));
      // @ts-ignore
      onChange(newValueList, newLabelList);
    } else {
      onChange(
        [...(value || []), newValue],
        [...(valueLabels || []), newLabel]
      );
    }
  };
  
  return (
    <div>
      <FormControl sx={{ my: 1, width: '100%' }}>
        <InputLabel id="demo-multiple-checkbox-label">{spec.label}</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple={multiple}
          value={currentOptions}
          onChange={handleChange}
          input={<OutlinedInput label={spec.label} />}
          renderValue={(selected) => multiple ? selected.join(", ") : selected}
          MenuProps={MenuProps}
        >
          {options.map((option, i) => (
            <MenuItem key={i} value={option.value}>
              {multiple && <Checkbox checked={value.indexOf(option.value) > -1} />}
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
