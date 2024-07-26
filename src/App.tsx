import { useState } from "react";
import "./App.css";
import { FilterControl } from "./components/Interface";
import { allFilterSections } from "./config/filters";
import { Box } from "@mui/material";
import { MainMapView } from "./components/Map";

// import Accordion from "@mui/material/Accordion";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { useStore } from "./state/store";
import { MultipleSelectCheckmarks } from "./components/Dropdown";
import { mapConfigFilterSpec } from "./config/map";
import { Demography } from "./components/Demography";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";

export const MapWidget = () => {
  const executeQuery = useStore((state) => state.executeQuery);
  const isLoaded = useStore((state) => state.loadingState === "loaded");
  const geography = useStore((state) => state.geography);
  const setGeography = useStore((state) => state.setGeography);
  const alwaysApplyChanges = useStore((state) => state.alwaysApplyFilters);
  const toggleAlwaysApplyFilters = useStore(
    (state) => state.toggleAlwaysApplyFilters
  );

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
        {!!(!isLoaded || alwaysApplyChanges) && (
          <Box
            component="div"
            padding="0.5rem"
            margin="0"
            flex="column"
            position="sticky"
            top={'-1rem'}
            zIndex={1000}
            justifyContent={"center"}
            bgcolor={"white"}
            // borderbottom
            borderBottom="2px solid rgba(0,0,0,0.1)"
          >
            {!!(!isLoaded && !alwaysApplyChanges) && (
              <Button
                variant="contained"
                onClick={executeQuery}
                disabled={isLoaded}
                sx={{
                  textTransform: "none",
                }}
              >
                Apply Changes
              </Button>
            )}
            <FormGroup
              sx={{
                position: "sticky",
                top: "1rem",
                zIndex: 100,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={alwaysApplyChanges}
                    onClick={toggleAlwaysApplyFilters}
                  />
                }
                label="Automatically Apply Changes"
              />
            </FormGroup>
          </Box>
        )}
        <hr />
        <Typography component="h3" variant="h6">
          Geography
        </Typography>

        <MultipleSelectCheckmarks
          multiple={false}
          spec={mapConfigFilterSpec}
          onChange={(value) => setGeography(value as string)}
          state={{ value: geography, label: geography } as any}
        />
        <hr style={{ margin: "0.5rem 0", width: "100%" }} />
        {allFilterSections.map((section, i) => (
          <div key={section.title}>
            {" "}
            <Typography component="h3" variant="h6" paddingBottom="1rem">
              {section.title}
            </Typography>
            {section.filters.map((filter) => (
              <FilterControl
                key={JSON.stringify(filter.queryParam)}
                spec={filter}
              />
            ))}
            {i + 1 === allFilterSections.length ? null : (
              <hr style={{ margin: "1rem 0 0 0", width: "100%" }} />
            )}
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
  demography: Demography,
  timeseries: () => <p>Timeseries coming soon</p>,
  about: () => <p>About coming soon</p>,
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
          py: 0,
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
      </Box>
      <View />
    </>
  );
}

export default App;
