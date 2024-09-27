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

export const LoadingStateShade: React.FC<{
  loadingState: State["loadingState"];
}> = ({ loadingState }) => {
  const executeQuery = useStore((state) => state.executeQuery);
  const toggleAlwaysApplyFilters = useStore(
    (state) => state.toggleAlwaysApplyFilters
  );
  const alwaysApplyFilters = useStore((state) => state.alwaysApplyFilters);
  const timeseriesType = useStore((state) => state.timeseriesType);
  const view = useStore((state) => state.view);
  const _loadingState =
    !timeseriesType && view === "timeseries"
      ? "timeseries-intro"
      : loadingState;

  switch (_loadingState) {
    // ag-on-not-counties
    case "loading":
      return (
        <LoadingStateContainer>
          <CircularProgress />
          <Typography component="h4" fontWeight={"bold"} mt={2}>
            Loading...
          </Typography>
        </LoadingStateContainer>
      );
    case "error":
      return (
        <LoadingStateContainer>
          <Alert variant="outlined" severity="error">
            Error loading data
          </Alert>
        </LoadingStateContainer>
      );
    case "timeseries-intro":
      return (
        <LoadingStateContainer>
          <Alert variant="outlined" severity="error">
            Please select a filter type to view over time. Data will be
            aggregated to this type.
          </Alert>
        </LoadingStateContainer>
      );
    case "timeseries-none":
      return (
        <LoadingStateContainer>
          <Alert variant="outlined" severity="error">
            Please select at least one chemical class, use type, active
            ingredient, or product in the data filters menu to view timeseries
            data
          </Alert>
        </LoadingStateContainer>
      );
    case "timeseries-too-many":
      return (
        <LoadingStateContainer>
          <Alert variant="outlined" severity="error">
            Please select up to nine (9) AI, class, type, or product in the data
            filters menu to view timeseries data
          </Alert>
        </LoadingStateContainer>
      );
    case "no-data":
      return (
        <LoadingStateContainer>
          <Alert variant="outlined" severity="error">
            No data matches the selected filters
          </Alert>
        </LoadingStateContainer>
      );
    case "settings-changed":
      if (alwaysApplyFilters) {
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
      } else {
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
                Settings updated. Click 'Apply Changes' to refresh the data
                view.
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
    case "ag-on-not-counties":
      return (
        <LoadingStateContainer>
          <Alert variant="outlined" severity="error">
            Non-agricultural data are only available for counties
          </Alert>
        </LoadingStateContainer>
      );
    default:
      return null;
  }
};
