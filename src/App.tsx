import { useState } from "react";
import "./App.css";
import { FilterControl } from "./components/Interface";
import { allFilterSections } from "./config/filters";
import { Box } from "@mui/material";
import { MainMapView } from "./components/Map";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { useStore } from "./state/store";
import { MultipleSelectCheckmarks } from "./components/Dropdown";
import { mapConfigFilterSpec } from "./config/map";
export const MapWidget = () => {
  const executeQuery = useStore((state) => state.executeQuery);
  const isLoaded = useStore((state) => state.loadingState === "loaded");
  const geography = useStore((state) => state.geography);
  const setGeography = useStore((state) => state.setGeography);
  
  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "row",
        background: "white",
        margin: "1rem",
        borderRadius: "0.5rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 2,
          borderRight: "2px solid rgba(0,0,0,0.4)",
        }}
        maxWidth={"300px"}
        maxHeight={"80vh"}
        minHeight={"80vh"}
        overflow="auto"
      >
        {!isLoaded && <Button 
          variant="contained"
          onClick={executeQuery}
          disabled={isLoaded}
          sx={{
            textTransform: "none",
            position: "sticky",
            top: "1rem",
            zIndex: isLoaded ? 0 : 100,
          }}
        >
          Run Query
          </Button>}
          <hr/>
        <h3>
          Geography
        </h3>

        <Accordion defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                Geographies
              </AccordionSummary>
              <AccordionDetails>
                <MultipleSelectCheckmarks
                  multiple={false}
                  spec={mapConfigFilterSpec}
                  onChange={(value) => setGeography(value as string)}
                  state={{value: geography, label: geography} as any}
                />
              </AccordionDetails>
            </Accordion>
        <h3>
          Data Filters
        </h3>

        {allFilterSections.map((section) => (
          <div key={section.title}>
            <Accordion defaultExpanded={section.defaultOpen}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                {section.title}
              </AccordionSummary>
              <AccordionDetails>
                {section.filters.map((filter) => (
                  <FilterControl
                    key={JSON.stringify(filter.queryParam)}
                    spec={filter}
                  />
                ))}
              </AccordionDetails>
            </Accordion>
          </div>
        ))}
      </Box>
      <Box
        component="div"
        sx={{ flexDirection: "column", gap: 4, flexGrow: 1 }}
      >
        <MainMapView />
      </Box>
    </Box>
  );
};
const componentMapping = {
  map: MapWidget,
  demography: () => <p>demo coming soon</p>,
  timeseries: () => <p>Timeseries coming soon</p>,
} as const;

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
];

function App() {
  const [currentView, setCurrentView] =
    useState<keyof typeof componentMapping>("map");
  const View = componentMapping[currentView];
  return (
    <>
      <Box
        component={"div"}
        // row
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          px: "1rem",
          py:0,
          background: "white",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "0.5rem",
          margin: "1rem",
          // vertical align
          alignItems: "center",
          // spread horizontally
          justifyContent: "space-between",
        }}
      >
        <h1 style={{ padding: "0 1rem" }}>Pesticide Data Explorer</h1>
        <ButtonGroup variant="text" aria-label="Basic button group">
          {selectConfig.map((config) => (
            <Button
              key={config.value}
              onClick={() => setCurrentView(config.value as any)}
              sx={{
                py:2,
                px:2,
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
      </Box>
      <View />
    </>
  );
}

export default App;
