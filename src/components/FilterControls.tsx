import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";

import {
  allFilterSections,
  allFilterSpecs,
  timeseriesFilterSpec,
  timeseriesViews,
} from "../config/filters";
import { mapConfigFilterSpec } from "../config/map";
import { useStore } from "../state/store";
import { MultipleSelectCheckmarks } from "./Dropdown";
import { FilterControl } from "./Interface";
import { Modal, styled, useMediaQuery } from "@mui/material";
import { theme } from "../main";

type FilterProps = {
  allowToggle?: boolean;
};

const SectionBreak = styled("hr")`
  margin: 1rem 0;
  width: 100%;
`;

export const FilterControls: React.FC<FilterProps> = ({ allowToggle }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const isDesktop = useMediaQuery("(min-width:1024px)");
  if (isDesktop) {
    return <FilterControlsInner allowToggle={allowToggle} />;
  } else {
    return (
      <div>
        <Button
          onClick={handleOpen}
          variant="contained"
          sx={{
            margin: "1rem auto",
            display: "block",
          }}
        >
          Data Filters and Settings
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              height: "90vh",
              backgroundColor: "white",
              width: "90vw",
              left: "5vw",
              top: "5vh",
              position: "absolute",

              borderRadius: "0.25rem",
              background: "white",
              border: `2px solid ${theme.palette.secondary.main}`,
              // shadow
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box
              sx={{
                position: "relative",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              {/* close button */}
              <Box
                display={"flex"}
                flexDirection={"row"}
                flex="0"
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Typography component="h2" variant="h5" padding="1rem">
                  Data Filters and Settings
                </Typography>
                <Button
                  onClick={handleClose}
                  sx={{
                    flex: 0,
                    height: "2rem",
                    width: "1rem",
                    margin: "0 1rem",
                  }}
                  variant="contained"
                >
                  &times;
                </Button>
              </Box>
              <Box
                sx={{
                  overflowY: "scroll",
                }}
              >
                <FilterControlsInner allowToggle={allowToggle} />
              </Box>
            </Box>
          </Box>
        </Modal>
      </div>
    );
  }
};

const FilterScrollingContainer = styled(Box)<{ isOpen?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 2;
  padding: 1rem;
  position: relative;
  flex: 0;
  border-right: 2px solid rgba(0,0,0,0.4);
  min-width: ${(p) => (p.isOpen ? "300px" : "2rem")};
  max-height: 70vh;
  min-height: 70vh;
  overflow-y: auto;
  overflow-x: hidden;
  // children 
  > * {
    visibility: ${(p) => (p.isOpen ? "visible" : "hidden")};
  }
  > #toggle-filters {
  visibility: visible !important;
  }
  @media (max-width: 1024px): {
    max-height: none;
    min-height: none;
    overflow: visible;
    width: calc(100% - 2rem);
    max-width: none;
    border-right: none;
`;

const FilterControlsInner: React.FC<FilterProps> = ({ allowToggle }) => {
  const executeQuery = useStore((state) => state.executeQuery);
  const isLoaded = useStore((state) => state.loadingState === "loaded");
  const geography = useStore((state) => state.geography);
  const setGeography = useStore((state) => state.setGeography);
  const timeseriesType = useStore((state) => state.timeseriesType);
  const setTimeseriesType = useStore((state) => state.setTimeseriesType);
  const view = useStore((state) => state.view);

  const filterKeys = useStore((state) => state.filterKeys);

  const mainFilterKey = useStore((state) => {
    const mainFilterKey =
      state.view === "timeseries"
        ? timeseriesViews.find((v) => v.label === state.timeseriesType)
            ?.mainFilterKey
        : undefined;
    return mainFilterKey;
  });

  const timeseriesMainConfig = allFilterSpecs.find(
    (f) => f.label === mainFilterKey
  );

  const alwaysApplyChanges = useStore((state) => state.alwaysApplyFilters);

  const toggleAlwaysApplyFilters = useStore(
    (state) => state.toggleAlwaysApplyFilters
  );

  const [open, setOpen] = React.useState(true);

  return (
    <FilterScrollingContainer
      isOpen={allowToggle ? open : true}
      id="filter-controls"
    >
      {allowToggle && (
        <button
          id="toggle-filters"
          style={{ position: "absolute", right: 0, top: 0 }}
          onClick={() => setOpen(!open)}
        >
          {open ? "<<" : ">>"}
        </button>
      )}
      {!!(!isLoaded || alwaysApplyChanges) && (
        <Box
          component="div"
          padding="0.5rem"
          margin="0 0 1rem 0"
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
      {!!view.includes("map") && (
        <>
          <span id="geography">
            <Typography component="h3" variant="h6">
              Geography
            </Typography>

            <MultipleSelectCheckmarks
              multiple={false}
              spec={mapConfigFilterSpec}
              onChange={(value) => setGeography(value as string)}
              state={{ value: geography, label: geography } as any}
            />
          </span>
          <SectionBreak />
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
          {!!timeseriesMainConfig && (
            <FilterControl
              key={JSON.stringify(timeseriesMainConfig.queryParam)}
              spec={timeseriesMainConfig}
            />
          )}

          <SectionBreak />
        </>
      )}
      {allFilterSections
        .filter((section) =>
          section.filters.some(
            (filter) =>
              (!filterKeys?.length || filterKeys.includes(filter.label)) &&
              mainFilterKey !== filter.label
          )
        )
        .map((section, i) => (
          <Box
            key={section.title}
            component="div"
            id={`filters-section-${section.title
              .replace(/\s/g, "-")
              .toLowerCase()}`}
          >
            {" "}
            <Typography
              component="h3"
              variant="h6"
              margin="0"
              paddingBottom={section.subtitle ? "1rem" : "0"}
            >
              {section.title}
            </Typography>
            {section.subtitle && (
              <Typography
                component="div"
                sx={{ fontSize: "0.75rem", mt: 0, pb: 2 }}
              >
                {section.subtitle}
              </Typography>
            )}
            {section.filters.map((filter) =>
              (!filterKeys?.length || filterKeys.includes(filter.label)) &&
              mainFilterKey !== filter.label ? (
                <FilterControl
                  key={JSON.stringify(filter.queryParam)}
                  spec={filter}
                />
              ) : null
            )}
            {i + 1 === allFilterSections.length ? null : <SectionBreak />}
          </Box>
        ))}
    </FilterScrollingContainer>
  );
};
