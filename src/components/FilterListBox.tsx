import "mapbox-gl/dist/mapbox-gl.css";
import Box from "@mui/material/Box";
import { cleanLabel } from "../utils/cleanLabel";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { theme } from "../main";
import { useStore } from "../state/store";

export const FilterListBox = () => {
  const uiFilters = useStore((state) => state.uiFilters);
  const geography = useStore((state) => state.geography);
  const view = useStore((state) => state.view);
  const timeseriesType = useStore((state) => state.timeseriesType);
  const filterKeys = useStore((state) => state.filterKeys);

  return (
    <Box
      component={"div"}
      sx={{
        position: "absolute",
        top: "0.5rem",
        right: "0.5rem",
        maxHeight: "calc(100% - 3rem)",
        maxWidth: "min(40%, 15rem)",
        fontSize: "0.75rem",
        zIndex: 1000,
        padding: "0.5rem",
        borderRadius: "0.25rem",
        background: "rgba(255,255,255,0.95)",
        border: `2px solid ${theme.palette.secondary.main}`,
        // shadow
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        component="p"
        padding="0 0 5px 0"
        fontSize="0.85rem"
        margin="0"
        fontWeight="bold"
      >
        Your Selections:
      </Typography>
      <List
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          maxWidth: "50ch",
        }}
      >
        <ListItem
          sx={{
            lineHeight: 4,
          }}
        >
          <Typography component="p" lineHeight={1.7}>
            {view === "map" && (
              <>
                <b>Geography:</b> {geography}
              </>
            )}
            {view === "timeseries" && (
              <>
                <b>Timeseries Type:</b> {timeseriesType}
              </>
            )}
          </Typography>
        </ListItem>
        {uiFilters
          .filter((f) => f.value && (!Array.isArray(f.value) || f.value.length))
          .filter((f) => !filterKeys.length || filterKeys.includes(f.label))
          .map((f, i) => (
            <ListItem key={`filter-${i}`}>
              <Typography
                component="p"
                sx={{
                  wordBreak: "anywhere",
                }}
              >
                <b>{f.label}:</b>{" "}
                {!Array.isArray(f.valueLabels)
                  ? cleanLabel(f.valueLabels || f.value, f.label)
                  : Array.isArray(f.queryParam)
                  ? f.valueLabels.join(" to ")
                  : f.valueLabels
                      .map((v) => cleanLabel(v, f.label))
                      .sort((a, b) => a.localeCompare(b))
                      .join(", ")}
              </Typography>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};
