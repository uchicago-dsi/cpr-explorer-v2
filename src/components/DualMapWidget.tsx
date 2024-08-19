import Box from "@mui/material/Box";
import { MainMapView } from "./Map";
import { FilterControls } from "./FilterControls";
import { WidgetContainer } from "./WidgetContainer";
import { useEffect, useRef } from "react";
import { MapSyncer } from "../utils/syncMaps";

export const DualMapWidget = () => {
  const syncer = useRef<any>(new MapSyncer());

  const handleLoad = (e: any) => {
    syncer.current.addMap(e.target);
  };
  useEffect(() => {
    return () => {
      syncer.current.unmount();
    };
  });

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
