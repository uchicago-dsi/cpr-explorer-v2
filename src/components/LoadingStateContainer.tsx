import { Box } from "@mui/material";

export const LoadingStateContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Box
      component="div"
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(255,255,255,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        zIndex: 1000,
      }}
    >
      {children}
    </Box>
  );
};
