import Box from "@mui/material/Box";
import { MainMapView } from "./Map";
import { FilterControls } from "./FilterControls";
import { WidgetContainer } from "./WidgetContainer";
// @ts-ignore
import syncMaps from "mapbox-gl-sync-move";
import { useRef } from "react";

export const DualMapWidget = () => {
  const mainMap = useRef<any>(null);

  const handleLoad = (e: any) => {
    if (mainMap.current === null) {
      mainMap.current = e.target;
    } else {
      syncMaps(mainMap.current, e.target);
    }
  };

  return (
    <WidgetContainer>
      <FilterControls />
      <Box
        component="div"
        sx={{ flexDirection: "column", gap: 4, flexGrow: 1 }}
      >
        <Box
          sx={{ display: "flex", gap: 0, height: "100%" }}
          component="div"
          id="dualMapContainer"
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              borderRight: "2px solid black",
            }}
          >
            <MainMapView
              defaultMapLayer="Pounds of Chemicals Applied"
              containerId={"dualMapContainer"}
              onLoad={handleLoad}
            />
          </Box>
          <MainMapView
            defaultMapLayer="Total Population"
            containerId={"dualMapContainer"}
            onLoad={handleLoad}
          />
        </Box>
      </Box>
    </WidgetContainer>
  );
};
