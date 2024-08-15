import { Box, styled } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { AboutWidget } from "./components/AboutWidget";
import { Demography } from "./components/Demography";
import { MapWidget } from "./components/MapWidget";
import { TimeseriesWidget } from "./components/TimeseriesWidget";
import "./App.css";
import { useStore } from "./state/store";

const componentMapping = {
  map: MapWidget,
  demography: Demography,
  timeseries: TimeseriesWidget,
  about:  AboutWidget
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
    label: "Demography",
    value: "demography",
  },
  {
    label: "Use Over Time",
    value: "timeseries",
  },
  {
    label: "About",
    value: "about",
  },
];
const NavContainer = styled(Box)({
  display: "flex",
  flexDirection: "row",
  gap: 2,
  padding: "0 1rem",
  background: "white",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  borderRadius: "0.25rem",
  margin: "1rem",
  alignItems: "center",
  justifyContent: "space-between",
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
        <Typography
          component="h1"
          fontWeight="bold"
          variant="h1"
          paddingY="1rem"
          fontSize="2rem"
        >
          Pesticide Data Explorer
        </Typography>
        <ButtonGroup variant="text" aria-label="Basic button group">
          {selectConfig.map((config) => (
            <Button
              key={config.value}
              onClick={() => setCurrentView(config.value as any)}
              sx={{
                py: 2,
                px: 2,
                maxHeight: "1rem",
                fontWeight: currentView === config.value ? "bold" : "normal",
                background:
                  currentView === config.value ? "rgba(0,0,0,0.1)" : "white",
              }}
            >
              {config.label}
            </Button>
          ))}
        </ButtonGroup>
      </NavContainer>
      <View />
      {!!(currentView in dataViews) && <Box component={"div"} sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          onClick={download}
          variant="contained"
          sx={{ margin: "1rem" }}
        >
          Download Data as CSV
        </Button>
      </Box>}
    </>
  );
}

export default App;
