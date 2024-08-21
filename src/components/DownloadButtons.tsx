import { Button } from "@mui/material";
import { useStore } from "../state/store";

export const DownloadButtons: React.FC<{ selectedIndices?: number[], compact?: Boolean }> = ({
  selectedIndices,
  compact
}) => {
  const download = useStore((state) => state.download);

  return (
    <>
      <Button
        onClick={() => download("excel")}
        variant="contained"
        sx={{ textTransform: "uppercase", fontWeight: "normal" }}
      >
        Download {compact ? '' : 'Data '}as Excel
      </Button>
      {!!selectedIndices?.length && (
        <Button
          onClick={() => download("excel", selectedIndices)}
          variant="outlined"
          sx={{ textTransform: "uppercase", fontWeight: "normal" }}
        >
          Download Selected {compact ? '' : 'Data '} as Excel
        </Button>
      )}
      <Button
        onClick={() => download("zip")}
        variant="contained"
        sx={{ textTransform: "uppercase", fontWeight: "normal" }}
      >
        Download {compact ? '' : 'Data '} as CSV
      </Button>
      {!!selectedIndices?.length && (
        <Button
          onClick={() => download("zip", selectedIndices)}
          variant="outlined"
          sx={{ textTransform: "uppercase", fontWeight: "normal" }}
        >
          Download Selected {compact ? '' : 'Data '} as CSV
        </Button>
      )}
    </>
  );
};
