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
import { Modal, styled, useMediaQuery } from "@mui/material";
import { theme } from "../main";

export const FilterControls: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const isDesktop = useMediaQuery("(min-width:1024px)");
  if (isDesktop) {
    return <FilterControlsInner />;
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
                <FilterControlsInner />
              </Box>
            </Box>
          </Box>
        </Modal>
      </div>
    );
  }
};

const FilterScrollingContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 2,
  padding: "1rem",
  flex: 0,
  borderRight: "2px solid rgba(0,0,0,0.4)",
  maxWidth: "300px",
  minWidth: "300px",
  maxHeight: "70vh",
  minHeight: "70vh",
  overflow: "auto",
  // vertical ipad or smaller
  "@media (max-width: 1024px)": {
    // no max height or min height
    maxHeight: "none",
    minHeight: "none",
    overflow: "visible",
    width: "calc(100% - 2rem)",
    maxWidth: "none",
    borderRight: "none",
  },
});

const FilterControlsInner: React.FC = () => {
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
    <FilterScrollingContainer>
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
      {allFilterSections
        .filter((section) =>
          section.filters.some(
            (filter) => !filterKeys?.length || filterKeys.includes(filter.label)
          )
        )
        .map((section, i) => (
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
    </FilterScrollingContainer>
  );
};
