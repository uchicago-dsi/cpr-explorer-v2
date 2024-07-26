import "mapbox-gl/dist/mapbox-gl.css";
import Box from "@mui/material/Box";
import { useStore } from "../state/store";
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { State } from "../types/state";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import { LoadingStateContainer } from "./LoadingStateContainer";

export const LoadingStateShade: React.FC<{ loadingState: State["loadingState"] }> = ({
  loadingState,
}) => {
  const executeQuery = useStore((state) => state.executeQuery);
  const toggleAlwaysApplyFilters = useStore(
    (state) => state.toggleAlwaysApplyFilters
  );
  const alwaysApplyFilters = useStore((state) => state.alwaysApplyFilters);
  if (loadingState === "loading") {
    return (
      <LoadingStateContainer>
        <CircularProgress />
        <Typography component="h4" fontWeight={"bold"} mt={2}>
          Loading...
        </Typography>
      </LoadingStateContainer>
    );
  }
  if (loadingState === "error") {
    return (
      <LoadingStateContainer>
        <Alert variant="outlined" severity="error">
          Error loading data
        </Alert>
      </LoadingStateContainer>
    );
  }
  if (loadingState === "no-data") {
    return (
      <LoadingStateContainer>
        <Alert variant="outlined" severity="error">
          No data matches the selected filters
        </Alert>
      </LoadingStateContainer>
    );
  }
  if (loadingState === "settings-changed" && alwaysApplyFilters) {
    return (
      <LoadingStateContainer>
        <Alert
          variant="outlined"
          severity="info"
          sx={{
            background: "white",
          }}
        >
          <Typography component="p">
            Settings updated. Applying changes...
          </Typography>
        </Alert>
      </LoadingStateContainer>
    );
  }
  if (loadingState === "settings-changed") {
    return (
      <LoadingStateContainer>
        <Alert
          variant="outlined"
          severity="info"
          sx={{
            background: "white",
          }}
        >
          <Typography component="p">
            Settings updated. Click 'Apply Changes' to refresh the data view.
          </Typography>
          <Box
            component="div"
            display={"flex"}
            flexDirection={"row"}
            gap={2}
            mt={2}
          >
            <Button
              variant="contained"
              onClick={executeQuery}
              sx={{
                textTransform: "none",
                position: "sticky",
                top: "1rem",
              }}
            >
              Apply Changes
            </Button>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={alwaysApplyFilters}
                    onClick={toggleAlwaysApplyFilters}
                  />
                }
                sx={{
                  fontSize: "0.5rem",
                }}
                label="Automatically Apply Changes"
              />
            </FormGroup>
          </Box>
        </Alert>
      </LoadingStateContainer>
    );
  }
  return null;
};
