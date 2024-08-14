import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { FilterSpec } from "../types/state";
import { Button, Typography } from "@mui/material";

function valuetext(value: number) {
  return `${value}`;
}

export const RangeSlider: React.FC<{
  spec: FilterSpec;
  onChange: (value: string | string[] | number | number[] | null) => void;
  state: string | string[] | number | number[] | null;
}> = ({ spec, onChange, state }) => {
  // const [active, setActive] = React.useState(false);  

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
  const handleReset = () => {
    onChange(undefined as any);
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
            min={min}
            max={max}
            step={step}
            onChange={handleChange}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
          />
        </Box>
        <Box flex={0} width={48}>
          <Button onClick={handleReset} variant={"text"}>
            &times;
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
