import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";

import { allFilterSections, timeseriesFilterSpec } from "../config/filters";
import { mapConfigFilterSpec } from "../config/map";
import { useStore } from "../state/store";
import { MultipleSelectCheckmarks } from "./Dropdown";
import { FilterControl } from "./Interface";

export const FilterControls: React.FC = () => {
  const executeQuery = useStore((state) => state.executeQuery);
  const isLoaded = useStore((state) => state.loadingState === "loaded");
  const geography = useStore((state) => state.geography);
  const setGeography = useStore((state) => state.setGeography);
  const timeseriesType = useStore((state) => state.timeseriesType);
  const setTimeseriesType = useStore((state) => state.setTimeseriesType);
  const view = useStore((state) => state.view);
  const filterKeys = useStore((state) => state.filterKeys);
  const alwaysApplyChanges = useStore((state) => state.alwaysApplyFilters);
  const toggleAlwaysApplyFilters = useStore(
    (state) => state.toggleAlwaysApplyFilters
  );
  
  return (
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
          top={"-1rem"}
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
      {!!(view === "map") && (
        <>
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
        </>
      )}
      {!!(view === "timeseries") && (
        <>
          <Typography component="h3" variant="h6">
            Timeseries View
          </Typography>

          <MultipleSelectCheckmarks
            multiple={false}
            spec={timeseriesFilterSpec}
            onChange={(value) => setTimeseriesType(value as string)}
            state={{ value: timeseriesType, label: timeseriesType } as any}
          />
          <hr style={{ margin: "0.5rem 0", width: "100%" }} />
        </>
      )}
      {allFilterSections.map((section, i) => (
        <Box key={section.title} component="div">
          {" "}
          <Typography component="h3" variant="h6" paddingBottom="1rem">
            {section.title}
          </Typography>
          {section.filters.map((filter) =>
            !filterKeys?.length || filterKeys.includes(filter.label) ? (
              <FilterControl
                key={JSON.stringify(filter.queryParam)}
                spec={filter}
              />
            ) : null
          )}
          {i + 1 === allFilterSections.length ? null : (
            <hr style={{ margin: "1rem 0 0 0", width: "100%" }} />
          )}
        </Box>
      ))}
    </Box>
  );
};
