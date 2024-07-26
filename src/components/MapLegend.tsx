"use client";
import "mapbox-gl/dist/mapbox-gl.css";
import Box from "@mui/material/Box";
import React from "react";
import * as d3 from "d3";
import Typography from "@mui/material/Typography";

export const compactFormatter = d3.format(".2s");
export const Legend: React.FC<{
  title: string;
  colors: string[] | readonly string[];
  breaks: number[];
}> = ({ title, colors, breaks }) => {
  const cleanBreaks = breaks.map(compactFormatter);
  return (
    <Box
      component="div"
      display="flex"
      flexDirection="column"
      alignItems="start"
      borderRadius="0.25rem"
    >
      <Typography variant="h6" component="h4" fontSize="0.75rem">
        {title}
      </Typography>
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
              backgroundColor: color
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
