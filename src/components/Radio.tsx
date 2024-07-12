import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useOptions } from "../hooks/useOptions";

export const RadioButtonsGroup: React.FC<{
  spec: any;
  onChange: (value: string | string[] | number | number[] | null) => void;
  value: string | string[] | number | number[] | null;
}> = ({ spec, onChange, value }) => {
  const options = useOptions(spec);
  return (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">{spec.label}</FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option: any) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
