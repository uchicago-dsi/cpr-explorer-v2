import { Button } from "@mui/material";
import { useStore } from "../state/store";
import { timeseriesViews } from "../config/filters";
import { mapConfig } from "../config/map";

export const DownloadButtons: React.FC<{ selectedIndices?: number[], compact?: Boolean }> = ({
  selectedIndices,
  compact
}) => {
  const download = useStore((state) => state.download);
  const isLoaded = useStore((state) => state.loadingState === "loaded");
  const sortKeys = useStore((state) => {
    if (state.view === "map" || state.view === "mapDualView") {
      const config = mapConfig.find((l) => l.layer === state.geography);
      return config?.sortKeys;
    }
    if (state.view === "timeseries") {
      const config = timeseriesViews.find(
        (v) => v.label === state.timeseriesType
      );
      return config?.sortKeys;
    }
    return null;
  }) as unknown as string[];

  return (
    <>
      <Button
        disabled={!isLoaded}
        onClick={() => download("excel", undefined, sortKeys)}
        variant="contained"
        sx={{ textTransform: "uppercase", fontWeight: "normal" }}
      >
        Download {compact ? "" : "Data "}as Excel
      </Button>
      {!!selectedIndices?.length && (
        <Button
          disabled={!isLoaded}
          onClick={() => download("excel", selectedIndices, sortKeys)}
          variant="outlined"
          sx={{ textTransform: "uppercase", fontWeight: "normal" }}
        >
          Download Selected {compact ? "" : "Data "} as Excel
        </Button>
      )}
      <Button
        disabled={!isLoaded}
        onClick={() => download("zip", undefined, sortKeys)}
        variant="contained"
        sx={{ textTransform: "uppercase", fontWeight: "normal" }}
      >
        Download {compact ? "" : "Data "} as CSV
      </Button>
      {!!selectedIndices?.length && (
        <Button
          disabled={!isLoaded}
          onClick={() => download("zip", selectedIndices, sortKeys)}
          variant="outlined"
          sx={{ textTransform: "uppercase", fontWeight: "normal" }}
        >
          Download Selected {compact ? "" : "Data "} as CSV
        </Button>
      )}
    </>
  );
};
