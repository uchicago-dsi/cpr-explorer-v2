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
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox";
import { mapConfig } from "../config/map";
import CircularProgress from "@mui/material/CircularProgress";
import { State } from "../types/state";
import Alert from "@mui/material/Alert";
// import IconButton from "@mui/material/IconButton";
// import Tooltip from "@mui/material/Tooltip";
// import InfoIcon from "@mui/icons-material/Info";
import { cleanLabel } from "../utils/cleanLabel";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

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
    onClick: (info: any) => {
      console.log(info);
    },
    onHover: handleHover,
    updateTriggers: {
      getFillColor: [fill],
    },
  });
};

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

const LoadingStateContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Box
      component="div"
      sx={{
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
      }}
    >
      {children}
    </Box>
  );
};
const LoadingStateShade: React.FC<{ loadingState: State["loadingState"] }> = ({
  loadingState,
}) => {
  const executeQuery = useStore((state) => state.executeQuery);
  const toggleAlwaysApplyFilters = useStore(
    (state) => state.toggleAlwaysApplyFilters
  );
  const alwaysApplyFilters = useStore((state) => state.alwaysApplyFilters);
  if (loadingState === "loading") {
    return (
      <LoadingStateContainer>
        <CircularProgress />
        <Typography component="h4" fontWeight={"bold"} mt={2}>
          Loading...
        </Typography>
      </LoadingStateContainer>
    );
  }
  if (loadingState === "error") {
    return (
      <LoadingStateContainer>
        <Alert variant="outlined" severity="error">
          Error loading data
        </Alert>
      </LoadingStateContainer>
    );
  }
  if (loadingState === "no-data") {
    return (
      <LoadingStateContainer>
        <Alert variant="outlined" severity="error">
          No data matches the selected filters
        </Alert>
      </LoadingStateContainer>
    );
  }
  if (loadingState === "settings-changed" && alwaysApplyFilters) {
    return (
      <LoadingStateContainer>
        <Alert
          variant="outlined"
          severity="info"
          sx={{
            background: "white",
          }}
        >
          <Typography component="p">
            Settings updated. Applying changes...
          </Typography>
        </Alert>
      </LoadingStateContainer>
    );
  }
  if (loadingState === "settings-changed") {
    return (
      <LoadingStateContainer>
        <Alert
          variant="outlined"
          severity="info"
          sx={{
            background: "white",
          }}
        >
          <Typography component="p">
            Settings updated. Click 'Apply Changes' to refresh the data view.
          </Typography>
          <Box
            component="div"
            display={"flex"}
            flexDirection={"row"}
            gap={2}
            mt={2}
          >
            <Button
              variant="contained"
              onClick={executeQuery}
              sx={{
                textTransform: "none",
                position: "sticky",
                top: "1rem",
              }}
            >
              Apply Changes
            </Button>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={alwaysApplyFilters}
                    onClick={toggleAlwaysApplyFilters}
                  />
                }
                sx={{
                  fontSize: "0.5rem",
                }}
                label="Automatically Apply Changes"
              />
            </FormGroup>
          </Box>
        </Alert>
      </LoadingStateContainer>
    );
  }
  return null;
};

const compactFormatter = d3.format(".2s");
const Legend: React.FC<{
  title: string;
  colors: string[] | readonly string[];
  breaks: number[];
}> = ({ title, colors, breaks }) => {
  const cleanBreaks = breaks.map(compactFormatter);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "start" }}
    >
      <Typography variant="h6" component="h4" fontSize="0.75rem">
        {title}
      </Typography>
      {colors.map((color, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "5px",
            width: "100%",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: color,
              marginRight: "10px",
            }}
          ></div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              width: "100%",
              flexDirection: "row",
            }}
          >
            <Typography component="p" fontSize="0.75rem" margin="0">
              {index === 0
                ? `< ${cleanBreaks[0]}`
                : index === colors.length - 1
                ? `≥ ${cleanBreaks[cleanBreaks.length - 1]}`
                : `${cleanBreaks[index - 1]} - ${cleanBreaks[index]}`}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
};

export const MapTooltip: React.FC<{
  mappedData: any;
  geographyConfig: any;
}> = ({ mappedData, geographyConfig }) => {
  const tooltip = useStore((state) => state.tooltip);
  if (!tooltip) return null;
  const idCol = geographyConfig.tileId;
  const _value = mappedData[tooltip.data[idCol]];
  const value = isNaN(_value) ? "No Use In Data" : compactFormatter(_value);
  return (
    <Box
      component={"div"}
      sx={{
        position: "absolute",
        left: tooltip.x,
        top: tooltip.y,
        padding: "0.5rem",
        background: "rgba(255,255,255,0.95)",
        borderRadius: "0.5rem",
        // shadow
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        fontSize: "0.75rem",
        transform: "translate(0.5rem, 0.5rem)",
        pointerEvents: "none",
      }}
    >
      <List style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <ListItem>
          <Typography component="p">
            <b>Pounds of Chemical Used:</b> {value}
          </Typography>
        </ListItem>
        {Object.entries(tooltip.data).map(([key, value]) => (
          <ListItem key={key}>
            <Typography component="p">
              <b>{key}:</b> {value as any}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export const MainMapView: React.FC = () => {
  const geography = useStore((state) => state.geography);
  const geographyConfig = mapConfig.find((c) => c.layer === geography)!;
  const loadingState = useStore((state) => state.loadingState);
  const uiFilters = useStore((state) => state.uiFilters);
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

  return (
    <>
      <Box
        component="section"
        sx={{ width: "100%", height: "100%", position: "relative" }}
        onMouseLeave={() => setTooltip(undefined)}
      >
        <LoadingStateShade loadingState={loadingState} />
        {!!(
          loadingState === "loaded" &&
          zoom < 8 &&
          (geography === "Sections" || geography === "Tracts")
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
        <Box
          component={"div"}
          sx={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            maxHeight: "calc(100% - 3rem)",
            maxWidth: "min(40%, 15rem)",
            fontSize: "0.75rem",
            zIndex: 1000,
            padding: "0.5rem",
            background: "rgba(255,255,255,0.95)",
            borderRadius: "0.5rem",
            // shadow
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            component="p"
            padding="0"
            margin="0"
            fontWeight="bold"
            sx={{
              textDecoration: "underline",
            }}
          >
            Data Filters
          </Typography>
          <List
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              maxWidth: "50ch",
            }}
          >
            <ListItem>
              <Typography component="p">
                <b>Geography:</b> {geography}
              </Typography>
            </ListItem>
            {uiFilters
              .filter(
                (f) => f.value && (!Array.isArray(f.value) || f.value.length)
              )
              .map((f, i) => (
                <ListItem key={`filter-${i}`}>
                  <Typography component="p"
                    sx={{
                      wordBreak: "anywhere"
                    }}
                  >
                    <b>{f.label}:</b>{" "}
                    {!Array.isArray(f.valueLabels)
                      ? cleanLabel(f.valueLabels)
                      : Array.isArray(f.queryParam)
                      ? f.valueLabels.join(" to ")
                      : f.valueLabels
                          .map(cleanLabel)
                          .sort((a, b) => a.localeCompare(b))
                          .join(", ")}
                  </Typography>
                </ListItem>
              ))}
          </List>
        </Box>
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
              borderRadius: "0.5rem",
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
      </Box>
    </>
  );
};
