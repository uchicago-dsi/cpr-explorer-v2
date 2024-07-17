import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FilterSpec, FilterState } from "../types/state";
import dayjs from "dayjs";
import { FilterValue } from "../config/filters";

const pickerLang = {
  months: [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ],
  from: "From",
  to: "To",
};

const zfill = (num: number, size: number) => {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
};

export const MonthPicker: React.FC<{
  spec: FilterSpec;
  onChange: (value: FilterValue, valueLabels: FilterValue) => void;
  state?: FilterState
}> = ({ spec, onChange, state }) => {
  const value = (state?.value || []) as any[];
  // const valueLabels = (state?.valueLabels || []) as any[];

  const innerValue = value as [string, string];

  const handleChange = (
    _newValue: number,
    index: number,
    type: "month" | "year"
  ) => {
    let stateValue = [...innerValue];
    stateValue[index] =
      type === "month"
        ? `${innerValue[index].split("-")[0]}-${zfill(_newValue + 1, 2)}`
        : `${_newValue}-${innerValue[index].split("-")[1]}`;
    onChange(stateValue, stateValue);
  };

  const [max, min] = [
    // @ts-ignore
    dayjs(spec.options.values[0].value),
    // @ts-ignore
    dayjs(spec.options.values[spec.options.values.length - 1].value),
  ];
  const yearRange = Math.abs(max.year() - min.year());
  const yearList = Array.from(
    { length: yearRange + 1 },
    (_, i) => min.year() + i
  );
  const startDate = dayjs(innerValue[0]);
  const endDate = dayjs(innerValue[1]);
  return (
    <Box
      component="section"
      width={"100%"}
      sx={{ display: "flex", flexDirection: "row" }}
    >
      <Box
        component="section"
        sx={{
          width: "min-content",
          pr: 2,
          display: "flex",
          flexDirection: "column",
          flexGrow: 0,
          justifyContent: "space-around",
        }}
      >
        <p>{pickerLang.from}</p>
        <p>{pickerLang.to}</p>
      </Box>

      <Box component="section" width={"100%"} sx={{ flexDirection: "column" }}>
        <Box
          component={"div"}
          width="100%"
          sx={{ display: "flex", flexDirection: "row", mb: 4 }}
        >
          <Box component={"div"} sx={{ mr: 2, flexGrow: 1 }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="start-label">Month</InputLabel>
              <Select
                labelId="start-label"
                id="start-month"
                value={startDate.month()}
                label={"Month"}
                onChange={(e) => handleChange(+e.target.value, 0, "month")}
              >
                {pickerLang.months.map((month, i) => (
                  <MenuItem key={month} value={i}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box component={"div"} sx={{ mr: 2, flexGrow: 1 }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="start-label-year">Year</InputLabel>
              <Select
                labelId="start-label-year"
                id="start-year"
                value={startDate.year()}
                label={"Year"}
                onChange={(e) => handleChange(+e.target.value, 0, "year")}
              >
                {yearList.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box
          component={"div"}
          flex="row"
          sx={{ display: "flex", flexDirection: "row" }}
        >
          <Box component={"div"} sx={{ mr: 2, flexGrow: 1 }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="start-label">Month</InputLabel>
              <Select
                labelId="start-label"
                id="start-month"
                value={endDate.month()}
                label={"Month"}
                onChange={(e) => handleChange(+e.target.value, 1, "month")}
              >
                {pickerLang.months.map((month, i) => (
                  <MenuItem key={month} value={i}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box component={"div"} sx={{ mr: 2, flexGrow: 1 }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="start-label">Year</InputLabel>
              <Select
                labelId="start-label"
                id="start-year"
                value={endDate.year()}
                label={"Year"}
                onChange={(e) => handleChange(+e.target.value, 1, "year")}
              >
                {yearList.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
