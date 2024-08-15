import { Box, styled } from "@mui/material";
import React from "react";

export const WidgetContainer: React.FC<any> = styled(
  Box
)({
  display: "flex",
  flexDirection: "row",
  position: "relative",
  background: "white",
  margin: "1rem",
  borderRadius: "0.25rem",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  // vertical ipad or smaller column
  "@media (max-width: 1024px)": {
    flexDirection: "column-reverse",
  },
});
