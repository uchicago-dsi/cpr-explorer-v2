import { Box, styled } from "@mui/material";
import Button from "@mui/material/Button";
import { AboutWidget } from "./components/AboutWidget";
import { Demography } from "./components/Demography";
import { MapWidget } from "./components/MapWidget";
import { TimeseriesWidget } from "./components/TimeseriesWidget";
import "./App.css";
import { useStore } from "./state/store";
import { DualMapWidget } from "./components/DualMapWidget";

const componentMapping = {
  map: MapWidget,
  demography: Demography,
  timeseries: TimeseriesWidget,
  about:  AboutWidget,
  mapDualView: DualMapWidget
} as const;

const dataViews = [
  "map",
  "timeseries"
]

const selectConfig = [
  {
    label: "Map",
    value: "map",
  },
  {
    label: "Use Over Time",
    value: "timeseries",
  },
  {
    label: "Demographic Comparison",
    value: "mapDualView",
  },
  // {
  //   label: "Demography",
  //   value: "demography",
  // },
  {
    label: "About",
    value: "about",
  },
];
const NavContainer = styled(Box)({
  display: "flex",
  flexDirection: "row",
  gap: 2,
  padding: "1rem",
  background: "white",
  borderBottom: "2px solid #4d799655",
  borderRadius: "0.25rem",
  margin: "0",
  alignItems: "center",
  justifyContent: "center",
  // mobile
  "@media (max-width: 600px)": {
    flexDirection: "column",
    gap: "1rem",
    padding: "0.5rem",
  },
});

function App() {
  const currentView = useStore(state => state.view) as keyof typeof componentMapping;
  const setCurrentView = useStore(state => state.setView);
  const download = useStore(state => state.download);
  const View = componentMapping[currentView];

  return (
    <>
      <NavContainer>
        <Box component={"div"} flexDirection={"row"} display="flex">
          {selectConfig.map((config) => (
            <Button
              key={config.value}
              onClick={() => setCurrentView(config.value as any)}
              sx={{
                py: 2,
                px: 2,
                mr: 1,
                border: "none",
                maxHeight: "1rem",
                fontWeight: currentView === config.value ? "bold" : "normal",
                textTransform: "uppercase",
                color: currentView === config.value ? "#f5f5f5" : "#4d7996",
                background:
                  currentView === config.value ? "#4d7996" : "#f5f5f5",
              }}
            >
              {config.label}
            </Button>
          ))}
        </Box>
      </NavContainer>
      <View />
      {!!dataViews.includes(currentView) && (
        <Box
          component={"div"}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Button
            onClick={() => download("excel")}
            variant="contained"
            sx={{ margin: "1rem", textTransform: "uppercase", fontWeight: "normal" }}
          >
            Download Data as Excel
          </Button>
          <Button
            onClick={() => download("zip")}
            variant="contained"
            sx={{ margin: "1rem", textTransform: "uppercase", fontWeight: "normal" }}
          >
            Download Data as CSV
          </Button>
        </Box>
      )}
    </>
  );
}

export default App;
