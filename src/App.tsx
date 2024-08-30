import { Box, styled } from "@mui/material";
import Button from "@mui/material/Button";
import { AboutWidget } from "./components/AboutWidget";
import { Demography } from "./components/Demography";
import { MapWidget } from "./components/MapWidget";
import { TimeseriesWidget } from "./components/TimeseriesWidget";
import "./App.css";
import { useStore } from "./state/store";
import { DualMapWidget } from "./components/DualMapWidget";
import { DataTableModal } from "./components/TableViewer";
import { DownloadButtons } from "./components/DownloadButtons";
import { LoadSaveSelectionModal } from "./components/LoadSaveSelectionModal";
import { useEffect, useState } from "react";
import { Quickstart } from "./components/Quickstart";

const componentMapping = {
  map: MapWidget,
  demography: Demography,
  timeseries: TimeseriesWidget,
  about: AboutWidget,
  mapDualView: DualMapWidget,
} as const;

const dataViews = ["map", "timeseries", "mapDualView"];

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

const TabButton = styled(Button)`
  padding: 1rem;
  border: none;
  max-height: 1rem;
  text-transform: uppercase;
  &:hover {
    background: rgb(59, 83, 103);
    color: white;
  }
`;

function App() {
  const [showQuickStart, setShowQuickStart] = useState(
    localStorage.getItem("showQuickStart") === null
  );
  const currentView = useStore(
    (state) => state.view
  ) as keyof typeof componentMapping;
  const setCurrentView = useStore((state) => state.setView);
  const View = componentMapping[currentView];
  const loadQueries = useStore((state) => state.loadQueries);

  useEffect(() => {
    const url = new URL(window.location.href);
    const query = url.searchParams.get("query");
    if (query) {
      loadQueries("", "url", {});
      // clear query param
      url.searchParams.delete("query");
      window.history.pushState({}, "", url.toString());
    }
  }, []);

  return (
    <>
      {showQuickStart && (
        <Quickstart onClose={() => setShowQuickStart(false)} />
      )}
      <NavContainer id="nav-container">
        <Box component={"div"} flexDirection={"row"} display="flex" gap="2px">
          <TabButton onClick={() => setShowQuickStart(true)} color="secondary">
            Quickstart
          </TabButton>
          {selectConfig.map((config) => (
            <TabButton
              key={config.value}
              onClick={() => setCurrentView(config.value as any)}
              sx={{
                fontWeight: currentView === config.value ? "bold" : "normal",
                color: currentView === config.value ? "#f5f5f5" : "#4d7996",
                background:
                  currentView === config.value ? "#4d7996" : "#f5f5f5",
              }}
            >
              {config.label}
            </TabButton>
          ))}
        </Box>
      </NavContainer>
      <span id="data-view">
        <View />
      </span>
      {!!dataViews.includes(currentView) && (
        <Box
          component={"div"}
          id="meta-data-stuff"
          sx={{ display: "flex", justifyContent: "center", py: 2, gap: 2 }}
        >
          <DownloadButtons />
          <DataTableModal />
          {/* <LoadSaveSelectionModal /> */}
        </Box>
      )}
    </>
  );
}

export default App;
