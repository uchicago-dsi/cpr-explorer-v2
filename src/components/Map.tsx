"use client"
import "mapbox-gl/dist/mapbox-gl.css"
import Box from "@mui/material/Box";
import { staticData, useStore } from "../state/store";
import React, { useEffect, useMemo, useRef } from "react";
import {MVTLayer} from "@deck.gl/geo-layers";
import * as d3 from "d3";
import GlMap, {
  FullscreenControl,
  NavigationControl,
  ScaleControl,
  useControl,
} from "react-map-gl";
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox";
import { mapConfig } from "../config/map";
import CircularProgress from "@mui/material/CircularProgress";
import { State } from "../types/state";
import Alert from "@mui/material/Alert";

const randomString = () => Math.random().toString(36).substring(7);
export function DeckGLOverlay(
  props: MapboxOverlayProps & {
    interleaved?: boolean;
  }
) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

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
  return `https://api.mapbox.com/v4/${config.tileset}/{z}/{x}/{y}.mvt?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`;
}
const hexToRgb = (hex: string) => {
  if (!hex) return [0,0,0,0];
  const bigint = parseInt(hex.replace("#", ""), 16);
  return [bigint >> 16, (bigint >> 8) & 255, bigint & 255];
}

const getScaleQuintile = (
  data: Array<Record<string, unknown>>, 
  accessor: string,
  id: string,
  geoid: string
) => {
  const colors = d3.schemeYlOrRd[5];
  const colorsRgb = colors.map(hexToRgb);
  // @ts-ignore
  const d3Scale = d3.scaleQuantile(data.map((d) => d[accessor]), colorsRgb);
  const mappedData = {}
  data.forEach((d) => {
    // @ts-ignore
    mappedData[d[id]] = d[accessor];
  });
  const color = (row: any) => {
    const entryId = row.properties[geoid];
    // @ts-ignore
    const entryValue = mappedData[entryId];
    if (entryValue === undefined) {
      return [0,0,0,0];
    }
    return  d3Scale(entryValue);
  }
  // as rgb array
  return {
    color,
    quantiles: d3Scale.quantiles(),
  };
}

const LoadingStateContainer: React.FC<{children: React.ReactNode}> = ({children}) => {
  return <Box component="div" sx={{
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(255,255,255,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    zIndex: 1000,
    }}>{children}</Box>
}
const LoadingStateShade: React.FC<{loadingState: State['loadingState']}> = (
  {
    loadingState
  
  }
) => {
  if (loadingState === 'loading') {
    return <LoadingStateContainer>
      <CircularProgress />
      <h4>Loading...</h4>
      </LoadingStateContainer>
  }
  if (loadingState === 'error') {
    return <LoadingStateContainer>
      <Alert variant="outlined" severity="error">Error loading data</Alert>
      </LoadingStateContainer>
  }

  return null
}

export const MainMapView: React.FC = () => {
  const state = useStore((state) => state);
  const geography = state.geography;
  const geographyConfig = mapConfig.find((c) => c.layer === geography)!
  const loadingState = state.loadingState;
  const timestamp = state.timestamp;
  const mapId = useRef(randomString());
  const {
    color: fill,
    // quantiles,
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
        color: (_:any) => [120,120,120],
        quantiles: []
      }
    }
  }, [timestamp, loadingState]);

  const layers = [
    new MVTLayer({
      id: "townships",
      visible: geography === "Townships",
      data: getMapboxApi("Townships"),
      // @ts-ignore
      getFillColor: fill,
      onClick: (info: any) => {
        console.log(info);
      },
      pickable: true,
      getLineColor: [0, 0, 0, 255],
      getLineWidth: 5,
      lineWidthMinPixels: 1,
      minZoom: 4,
      getLineDashArray: [3, 3],
      beforeId: 'not-cali',
      opacity: 0.8,
      updateTriggers: {
        getFillColor: [fill],
      }
    }),
    new MVTLayer({
      id: "sections",
      visible: geography === "Sections",
      data: getMapboxApi("Sections"),
      // @ts-ignore
      getFillColor: fill,
      onClick: (info: any) => {
        console.log(info);
      },
      pickable: true,
      getLineColor: [0, 0, 0, 255],
      getLineWidth: 5,
      lineWidthMinPixels: 1,
      minZoom: 4,
      getLineDashArray: [3, 3],
      beforeId: 'not-cali',
      opacity: 0.8,
      updateTriggers: {
        getFillColor: [fill],
      }
    }),

  ];
  useEffect(() => {
    if (state.loadingState === "unloaded") state.executeQuery();
  }, [state.loadingState, state.executeQuery]);

  return (
    <Box
      component="section"
      sx={{ width: "100%", height: "100%", position: "relative" }}
    >
      <LoadingStateShade loadingState={loadingState} />
      <GlMap
        maxBounds={[-130,30,-104,45.0]}
        // hash={true}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN as string}
        mapStyle="mapbox://styles/cpr2024/clyfwrigb01ca01qj6eg720be?fresh=true"
        initialViewState={INITIAL_VIEW_STATE}
        // @ts-ignore
        projection={"mercator"}
        reuseMaps={true}
      >
        <ScaleControl unit="imperial" />
        <FullscreenControl containerId={mapId.current} />
        <NavigationControl />
        <DeckGLOverlay layers={layers} interleaved={true} />
      </GlMap>
    </Box>
  );
};
