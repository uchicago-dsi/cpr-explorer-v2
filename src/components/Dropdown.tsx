import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { FilterSpec } from "../types/state";
import { useOptions } from "../hooks/useOptions";

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

export const MultipleSelectCheckmarks: React.FC<{
  spec: FilterSpec;
  value: (string | number)[];
  onChange: (value: string | string[] | number | number[] | null) => void;
  multiple?: boolean;
}> = ({ spec, value, onChange, multiple=true }) => {
  const options = useOptions(spec);
  const currentOptions = value
  // options.filter((o) => value.includes(o.value));
  const handleChange = (event: SelectChangeEvent<any>) => {
    if (!multiple) {
      onChange(event.target.value);
      return
    }
    
    const valueInSelection = value.includes(event.target.value);
    if (valueInSelection) {
      // @ts-ignore
      onChange(value.filter((v) => v !== event.target.value));
    } else {
      onChange([...(value || []), event.target.value]);
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
