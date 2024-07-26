"use client";
import "mapbox-gl/dist/mapbox-gl.css";
import Box from "@mui/material/Box";
import { useStore } from "../state/store";
import React from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { compactFormatter } from "./MapLegend";

export const MapTooltip: React.FC<{
  mappedData: any;
  geographyConfig: any;
}> = ({ mappedData, geographyConfig }) => {
  const tooltip = useStore((state) => state.tooltip);
  if (!tooltip) return null;
  const idCol = geographyConfig.tileId;
  const _value = mappedData[tooltip.data[idCol]];
  const value = isNaN(_value) ? "No Use In Data" : compactFormatter(_value);
  return (
    <Box
      component={"div"}
      sx={{
        position: "absolute",
        left: tooltip.x,
        top: tooltip.y,
        padding: "0.5rem",
        background: "rgba(255,255,255,0.95)",
        // shadow
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        fontSize: "0.75rem",
        transform: "translate(0.5rem, 0.5rem)",
        pointerEvents: "none",
      }}
    >
      <List style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <ListItem>
          <Typography component="p">
            <b>Pounds of Chemical Used:</b> {value}
          </Typography>
        </ListItem>
        {Object.entries(tooltip.data).map(([key, value]) => (
          <ListItem key={key}>
            <Typography component="p">
              <b>{key}:</b> {value as any}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};