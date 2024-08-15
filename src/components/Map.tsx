"use client";
import "mapbox-gl/dist/mapbox-gl.css";
import Box from "@mui/material/Box";
import { staticData, useStore } from "../state/store";
import React, { useEffect, useMemo, useRef } from "react";
import { MVTLayer } from "@deck.gl/geo-layers";
import * as d3 from "d3";
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
import { mapConfig } from "../config/map";
import Alert from "@mui/material/Alert";
import { LoadingStateShade } from "./LoadingShade";
import { MapTooltip } from "./MapTooltip";
import { Legend } from "./MapLegend";
import { DeckGLOverlay } from "./DeckglOverlay";
import { FilterListBox } from "./FilterListBox";
import { styled } from "@mui/material";

const DEFAULT_MVT_LAYER_SETTINGS = {
  pickable: true,
  getLineColor: [0, 0, 0, 255],
  getLineWidth: 5,
  // autoHighlight: true,
  lineWidthMinPixels: 1,
  minZoom: 4,
  getLineDashArray: [3, 3],
  beforeId: "not-cali",
  opacity: 0.8,
};

const getMvtLayer = (
  geography: string,
  layer: string,
  fill: any,
  handleHover: MVTLayer["onHover"]
) => {
  return new MVTLayer({
    ...(DEFAULT_MVT_LAYER_SETTINGS as any),
    id: layer,
    visible: geography === layer,
    data: getMapboxApi(layer),
    getFillColor: fill,
    onClick: (_info: any) => {},
    onHover: handleHover,
    updateTriggers: {
      getFillColor: [fill],
    },
  });
};

const randomString = () => Math.random().toString(36).substring(7);

const INITIAL_VIEW_STATE = {
  latitude: 36.778259,
  longitude: -117.5,
  zoom: 5,
  maxZoom: 0,
  pitch: 0,
  bearing: 0,
};
const getMapboxApi = (layer: string) => {
  const config = mapConfig.find((c) => c.layer === layer);
  if (!config) {
    throw new Error(`No config found for layer: ${layer}`);
  }
  return `https://api.mapbox.com/v4/${
    config.tileset
  }/{z}/{x}/{y}.mvt?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`;
};
const hexToRgb = (hex: string) => {
  if (!hex) return [0, 0, 0, 0];
  const bigint = parseInt(hex.replace("#", ""), 16);
  return [bigint >> 16, (bigint >> 8) & 255, bigint & 255];
};

const getScaleQuintile = (
  data: Array<Record<string, unknown>>,
  accessor: string,
  id: string,
  geoid: string
) => {
  const colors = d3.schemeYlOrRd[5];
  const colorsRgb = colors.map(hexToRgb);
  const d3Scale = d3.scaleQuantile(
    // @ts-ignore
    data.map((d) => d[accessor]),
    colorsRgb
  );
  const mappedData = {};
  data.forEach((d) => {
    // @ts-ignore
    mappedData[d[id]] = d[accessor];
  });
  const color = (row: any) => {
    const entryId = row.properties[geoid];
    // @ts-ignore
    const entryValue = mappedData[entryId];
    if (entryValue === undefined) {
      return [0, 0, 0, 0];
    }
    return d3Scale(entryValue);
  };
  // as rgb array
  return {
    color,
    colors,
    mappedData,
    quantiles: d3Scale.quantiles(),
  };
};

const MapContainer = styled(Box)({
  width: "100%",
  height: "100%",
  position: "relative",
  // vertical ipad and smaller
  "@media (max-width: 768px)": {
    height: "70vh",
    //  .mapboxgl-map child div
    "& > div.mapboxgl-map": {
      height: "70vh",
    },
  },
});

export const MainMapView: React.FC = () => {
  const geography = useStore((state) => state.geography);
  const geographyConfig = mapConfig.find((c) => c.layer === geography)!;
  const loadingState = useStore((state) => state.loadingState);
  const timestamp = useStore((state) => state.timestamp);
  const executeQuery = useStore((state) => state.executeQuery);
  const setTooltip = useStore((state) => state.setTooltip);
  const [zoom, setZoom] = React.useState(INITIAL_VIEW_STATE.zoom);
  const mapId = useRef(randomString());
  const {
    color: fill,
    colors,
    mappedData,
    quantiles,
  } = useMemo(() => {
    if (loadingState === "loaded") {
      return getScaleQuintile(
        staticData,
        "lbs_chm_used",
        geographyConfig.dataId,
        geographyConfig.tileId
      );
    } else {
      return {
        color: (_: any) => [120, 120, 120],
        colors: [],
        quantiles: [],
        mappedData: {},
      };
    }
  }, [timestamp, loadingState]);
  const handleHover: MVTLayer["onHover"] = (info: any) => {
    if (info.object) {
      setTooltip({
        x: info.x,
        y: info.y,
        data: info.object.properties,
      });
      return true;
    } else {
      setTooltip(undefined);
      return false;
    }
  };

  const layers = mapConfig.map((f) =>
    getMvtLayer(geography, f.layer, fill, handleHover)
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
          (zoom < 7 && geography === "Tracts")
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
          <FullscreenControl containerId={mapId.current} position="top-left" />
          <AttributionControl
            compact
            position="bottom-right"
            customAttribution="Data Sources:
            CA Dept of Pesticide Regulation PUR 2017-2022, 
            ACS 2021 5-Year esimates 2021"
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
              title="Pounds of Chemical Used"
            />
          </Box>
        )}
        <MapTooltip geographyConfig={geographyConfig} mappedData={mappedData} />
      </MapContainer>
    </>
  );
};
