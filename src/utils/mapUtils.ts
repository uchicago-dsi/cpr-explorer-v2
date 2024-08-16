import { MVTLayer } from "@deck.gl/geo-layers";
import * as d3 from "d3";
import { mapConfig } from "../config/map";

export const DEFAULT_MVT_LAYER_SETTINGS = {
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

export const getMvtLayer = (
  geography: string,
  layer: string,
  fill: any,
  line: any,
  handleHover: MVTLayer["onHover"]
) => {
  return new MVTLayer({
    ...(DEFAULT_MVT_LAYER_SETTINGS as any),
    id: layer,
    visible: geography === layer,
    data: getMapboxApi(layer),
    getLineColor: line,
    getFillColor: fill,
    onClick: (_info: any) => {},
    onHover: handleHover,
    updateTriggers: {
      getFillColor: [fill],
      getLineColor: [line],
    },
  });
};

export const INITIAL_VIEW_STATE = {
  latitude: 36.778259,
  longitude: -117.5,
  zoom: 5,
  maxZoom: 0,
  pitch: 0,
  bearing: 0,
};

export const getMapboxApi = (layer: string) => {
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

export const getScaleQuintile = (
  data: Array<Record<string, unknown>>,
  accessor: string,
  id: string,
  geoid: string,
  colorScheme?: readonly string[] | string[]
) => {
  const colors = colorScheme || d3.schemeYlOrRd[5];
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
  const fill = (row: any) => {
    const entryId = row.properties[geoid];
    // @ts-ignore
    const entryValue = mappedData[entryId];
    if (entryValue === undefined) {
      return [0, 0, 0, 0];
    }
    return d3Scale(entryValue);
  };
  const line = (row: any) => {
    const entryId = row.properties[geoid];
    // @ts-ignore
    const entryValue = mappedData[entryId];
    if (entryValue === undefined) {
      return [0, 0, 0, 0];
    } else {
      return [0, 0, 0, 255];
    }
  };
  // as rgb array
  return {
    fill,
    line,
    colors,
    mappedData,
    quantiles: d3Scale.quantiles(),
  };
};
