import "mapbox-gl/dist/mapbox-gl.css";
import { cleanLabel } from "../utils/cleanLabel";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useStore } from "../state/store";
import { StyledOverlayBox } from "./StyledOverlayBox";
import Button from "@mui/material/Button";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

export const FilterListBox = () => {
  const uiFilters = useStore((state) => state.uiFilters);
  const geography = useStore((state) => state.geography);
  const view = useStore((state) => state.view);
  const timeseriesType = useStore((state) => state.timeseriesType);
  const filterKeys = useStore((state) => state.filterKeys);
  const filterKeysNotUsed = filterKeys
    .filter((f) => !uiFilters.find((u) => u.label === f))
    .sort((a, b) => a.localeCompare(b))
    .join(", ");

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
        {filterKeysNotUsed.length > 0 && (
          <LightTooltip
            title={`The following filters are available but not applied to this query:\n\n${filterKeysNotUsed}`}
          >
            <InfoIcon color="primary" fontSize="small"
            sx={{
              transform: "translateY(25%)",
            }}
            />
          </LightTooltip>
        )}
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
          <Typography component="p" sx={{ lineHeight: 1.7 }}>
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
