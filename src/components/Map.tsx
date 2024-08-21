import "mapbox-gl/dist/mapbox-gl.css";
import Box from "@mui/material/Box";
import { staticData, useStore } from "../state/store";
import React, { useEffect, useMemo, useRef } from "react";
import { MVTLayer } from "@deck.gl/geo-layers";
import GlMap, {
  // @ts-ignore
  FullscreenControl,
  // @ts-ignore
  NavigationControl,
  // @ts-ignore
  ScaleControl,
  // @ts-ignore
  useControl,
  // @ts-ignore
  AttributionControl,
} from "react-map-gl";
import { mapConfig, MapLayerOptions, mapLayers } from "../config/map";
import Alert from "@mui/material/Alert";
import { LoadingStateShade } from "./LoadingShade";
import { MapTooltip } from "./MapTooltip";
import { Legend } from "./MapLegend";
import { DeckGLOverlay } from "./DeckglOverlay";
import { FilterListBox } from "./FilterListBox";
import { styled } from "@mui/material";
import {
  getMvtLayer,
  getScaleQuintile,
  INITIAL_VIEW_STATE,
} from "../utils/mapUtils";
import { randomString } from "../utils/randomString";

const MapContainer = styled(Box)({
  width: "100%",
  height: "100%",
  position: "relative",
  // vertical ipad and smaller
  "@media (max-width: 1024px)": {
    height: "70vh",
    //  .mapboxgl-map child div
    "& > div.mapboxgl-map": {
      height: "70vh",
    },
  },
});

export const MainMapView: React.FC<{
  onLoad?: (e: any) => void;
  defaultMapLayer?: string;
  containerId?: string;
}> = ({ defaultMapLayer, containerId, onLoad }) => {
  // globals
  const geography = useStore((state) => state.geography);
  const geographyConfig = mapConfig.find((c) => c.layer === geography)!;
  const loadingState = useStore((state) => state.loadingState);
  const timestamp = useStore((state) => state.timestamp);
  const executeQuery = useStore((state) => state.executeQuery);
  const setTooltip = useStore((state) => state.setTooltip);

  const [mapLayer, setMapLayer] = React.useState(
    defaultMapLayer || mapLayers[0].label
  );

  const mapLayerConfig = mapLayers.find((l) => l.label === mapLayer)!;
  const [zoom, setZoom] = React.useState(INITIAL_VIEW_STATE.zoom);
  const mapId = useRef(randomString());

  const { fill, line, colors, mappedData, quantiles } = useMemo(() => {
    if (loadingState === "loaded") {
      return getScaleQuintile(
        staticData,
        mapLayerConfig.dataColumn,
        geographyConfig.dataId,
        geographyConfig.tileId,
        mapLayerConfig.colorScheme
      );
    } else {
      return {
        fill: (_: any) => [120, 120, 120],
        line: (_: any) => [120, 120, 120],
        colors: [],
        quantiles: [],
        mappedData: {},
      };
    }
  }, [mapLayerConfig, timestamp, loadingState]);

  const handleHover: MVTLayer["onHover"] = (info: any) => {
    if (info.object) {
      const idCol = geographyConfig.dataId;
      const tileId = geographyConfig.tileId;
      const data = staticData.find(
        (d: Record<string, unknown>) => d[tileId] === info.object.properties[idCol]
      ) || {}
      const tooltipdata = {
        ...info.object.properties,
        ...data,
      };

      let cleanTooltipData: Record<string, unknown> = {}
      
      if (geographyConfig.tooltipKeys) {
        Object.entries(geographyConfig.tooltipKeys).forEach(([k,v]) => {
          cleanTooltipData[v] = tooltipdata[k]
        })
      }

      setTooltip({
        x: info.x,
        y: info.y,
        data: cleanTooltipData
      });
      return true;
    } else {
      setTooltip(undefined);
      return false;
    }
  };

  const layers = mapConfig.map((f) =>
    getMvtLayer(geography, f.layer, fill, line, handleHover)
  );

  useEffect(() => {
    if (loadingState === "unloaded") executeQuery();
    if (loadingState === "settings-changed") setTooltip(undefined);
  }, [loadingState, executeQuery]);

  useEffect(() => {
    if (loadingState === "settings-changed") executeQuery();
  }, [executeQuery]);

  return (
    <>
      <MapContainer
        component="section"
        onMouseLeave={() => setTooltip(undefined)}
        id={mapId.current}
      >
        <LoadingStateShade loadingState={loadingState} />
        {!!(
          (loadingState === "loaded" && zoom < 8 && geography === "Sections") ||
          (loadingState === "loaded" && zoom < 7 && geography === "Tracts")
        ) && (
          <Alert
            variant="outlined"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              right: 0,
              transform: "translateX(-50%)",
              pointerEvents: "none",
              zIndex: 1000,
              margin: "1rem",
              width: "50%",
              background: "rgba(255,255,255,0.95)",
              // shadow
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            severity="info"
          >
            Zoom in to view data
          </Alert>
        )}
        <FilterListBox />
        <GlMap
          maxBounds={[-130, 30, -104, 45.0]}
          attributionControl={false}
          onLoad={(e) => {
            onLoad && onLoad(e);
          }}
          // hash={true}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN as string}
          mapStyle="mapbox://styles/cpr2024/clyfwrigb01ca01qj6eg720be?fresh=true"
          initialViewState={INITIAL_VIEW_STATE}
          // @ts-ignore
          projection={"mercator"}
          onMoveEnd={(e: any) => {
            setZoom(Math.round(e.viewState.zoom));
          }}
          reuseMaps={true}
        >
          <NavigationControl position="top-left" />
          <FullscreenControl
            containerId={containerId || mapId.current}
            position="top-left"
          />
          <AttributionControl
            compact
            position="bottom-right"
            customAttribution={`Data Sources: ${mapLayerConfig.attribution}`}
          />
          <ScaleControl unit="imperial" position="bottom-right" />
          <DeckGLOverlay layers={layers} interleaved={true} />
        </GlMap>
        {!!quantiles.length && (
          <Box
            component="div"
            sx={{
              position: "absolute",
              left: "0.5rem",
              bottom: "3rem",
              margin: "0",
              padding: "0.5rem",
              fontSize: "0.75rem",
              background: "rgba(255,255,255,0.95)",
              // shadow
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              zIndex: 1000,
            }}
          >
            <Legend
              colors={colors}
              breaks={quantiles}
              title={mapLayerConfig.label}
              options={MapLayerOptions}
              onChange={(v) => setMapLayer(v)}
            />
          </Box>
        )}
        <MapTooltip
          geographyConfig={geographyConfig}
          mappedData={mappedData}
          label={mapLayerConfig.label}
        />
      </MapContainer>
    </>
  );
};
