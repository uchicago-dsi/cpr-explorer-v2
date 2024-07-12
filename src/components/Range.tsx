import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { FilterSpec } from "../types/state";

function valuetext(value: number) {
  return `${value}`;
}

export const RangeSlider: React.FC<{
  spec: FilterSpec;
  onChange: (value: string | string[] | number | number[] | null) => void;
  value: string | string[] | number | number[] | null;
}> = ({ spec, onChange, value }) => {
  const [min, max] =
    spec.options.type === "static"
      ? [
          +spec.options.values[0].value,
          +spec.options.values[spec.options.values.length - 1].value,
        ]
      : [0, 1];

  const step = Math.abs(max - min) / 100;
  const handleChange = (_: Event, newValue: number | number[]) => {
    onChange(newValue as number[]);
  };

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        getAriaLabel={() => spec.label}
        value={value as number[]}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
      />
    </Box>
  );
};
