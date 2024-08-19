"use client";
import "mapbox-gl/dist/mapbox-gl.css";
import Box from "@mui/material/Box";
import React from "react";
import * as d3 from "d3";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// import { styled } from "@mui/material";

export const compactFormatter = d3.format(".2s");
export const percentFormatter = d3.format(".1%");

// const StyledDropdown = styled(FormControl)``;

export const Legend: React.FC<{
  title: string;
  colors: string[] | readonly string[];
  breaks: number[];
  onChange?: (value: string) => void;
  options?: string[];
}> = ({ title, colors, breaks, onChange, options }) => {
  const isPercent = title.includes("Percent");
  const cleanBreaks = breaks.map(isPercent ? percentFormatter : compactFormatter);
  return (
    <Box
      component="div"
      display="flex"
      flexDirection="column"
      alignItems="start"
      borderRadius="0.25rem"
    >
      {!!(onChange && options) ? (
        <FormControl size="small" sx={{ padding: 0, m: "0.5rem 0" }}>
          <InputLabel id="demo-select-small-label" sx={{ background: "white", px: 1 }}>
            Map Layer
          </InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={title}
            sx={{
              fontSize: "0.75rem",
              padding: "0",
              borderRadius: "0.25rem",
              width: "100%",
            }}
            label=""
            onChange={(e) => onChange(e.target.value)}
          >
            {options.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <Typography variant="h6" component="h4" fontSize="0.75rem">
          {title}
        </Typography>
      )}
      {colors.map((color, index) => (
        <Box
          key={index}
          component="div"
          display="flex"
          flexDirection="row"
          alignItems="center"
          marginBottom="5px"
          width="100%"
        >
          <Box
            component="div"
            width="20px"
            height="20px"
            marginRight="10px"
            sx={{
              backgroundColor: color,
            }}
          ></Box>
          <Box
            component={"div"}
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="start"
            width="100%"
          >
            <Typography component="p" fontSize="0.75rem" margin="0">
              {index === 0
                ? `< ${cleanBreaks[0]}`
                : index === colors.length - 1
                ? `≥ ${cleanBreaks[cleanBreaks.length - 1]}`
                : `${cleanBreaks[index - 1]} - ${cleanBreaks[index]}`}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
