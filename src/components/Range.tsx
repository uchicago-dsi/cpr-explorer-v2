import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { FilterSpec } from "../types/state";
import { Switch, Typography } from "@mui/material";

function valuetext(value: number) {
  return `${value}`;
}

export const RangeSlider: React.FC<{
  spec: FilterSpec;
  onChange: (value: string | string[] | number | number[] | null) => void;
  state: string | string[] | number | number[] | null;
}> = ({ spec, onChange, state }) => {
  const [cachedValue, setCachedValue] = React.useState<string | string[] | number | number[] | null>(state); 
  const active  = (state as any)?.value !== undefined
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
    setCachedValue(newValue as number[]);
  };
  const handleToggle = () => {
    if (active) {
      onChange(undefined as any);
    } else {
      onChange(cachedValue);
    }
  }

  return (
    <Box sx={{ width: 300 }}>
      <Typography component={"p"}>
        {spec.label}
        <br />
        <i>{spec.subLabel}</i>
      </Typography>
      <Box
        component={"div"}
        display={"flex"}
        gap={2}
        pl={".5rem"}
        flexDirection={"row"}
        width={"calc(100% - .5rem)"}
      >
        <Box flex={1}>
          <Slider
            getAriaLabel={() => spec.label}
            value={state as number[]}
            // @ts-ignore
            color={active ? "primary" : "default"}
            min={min}
            max={max}
            step={step}
            onChange={handleChange}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
          />
        </Box>
        <Box flex={0} width={48}>
          <Switch
            checked={active}
            onClick={handleToggle}
            size="small"
            aria-label={"Toggle on off for " + spec.label}
          />
        </Box>
      </Box>
    </Box>
  );
};
