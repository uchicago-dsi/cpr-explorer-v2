import "mapbox-gl/dist/mapbox-gl.css";
import { cleanLabel } from "../utils/cleanLabel";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useStore } from "../state/store";
import { StyledOverlayBox } from "./StyledOverlayBox";

export const FilterListBox = () => {
  const uiFilters = useStore((state) => state.uiFilters);
  const geography = useStore((state) => state.geography);
  const view = useStore((state) => state.view);
  const timeseriesType = useStore((state) => state.timeseriesType);
  const filterKeys = useStore((state) => state.filterKeys);

  return (
    <StyledOverlayBox
      component={"div"}
      position={"absolute"}
      top={"0.5rem"}
      right={"0.5rem"}
      maxHeight={"calc(100% - 3rem)"}
      maxWidth={"min(40%, 15rem)"}
      borderColor={"secondary.main"}
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
        <ListItem>
          <Typography component="p" sx={{lineHeight: 1.7}}>
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
    </StyledOverlayBox>
  );
};
