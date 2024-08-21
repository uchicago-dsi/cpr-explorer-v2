import { Box, styled } from "@mui/material";

export const StyledOverlayBox: React.FC<
  React.ComponentProps<typeof Box>
> = styled(Box)({
  position: "absolute",
  fontSize: "0.75rem",
  zIndex: 1000,
  padding: "0.5rem",
  borderRadius: "0.25rem",
  background: "rgba(255, 255, 255, 0.95)",
  borderColor: "secondary.main",
  borderWidth: "2px",
  borderStyle: "solid",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
})
