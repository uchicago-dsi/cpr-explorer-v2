import { percentFormatter } from "../components/MapLegend";
import { FilterSpec } from "../types/state";
import {
  applicationFilters,
  geographyFilters,
  impactFilters,
  pesticideInfoFilters,
} from "./filters";
import * as d3 from "d3";

const demographicFilterKeys = [
  "Median Household Income",
  "Percent Black or African American",
  "Percent Hispanic or Latino",
  "Percent Non-Hispanic White",
  "Percent Asian",
  "Percent Native American",
  "Percent Native Hawaiian or Pacific Islander",
];

const mapKeys = [
  "Date Range",
  ...applicationFilters.filters.map((filter) => filter.label),
  ...pesticideInfoFilters.filters.map((filter) => filter.label),
  ...impactFilters.filters.map((filter) => filter.label),
  ...geographyFilters.filters.map((filter) => filter.label),
];
const demogViewKeys = [...demographicFilterKeys, ...mapKeys];
const ACS_ATTRIBTUION = "ACS 2021 5-year estiamtes, 2020 Census Geos";

export const mapLayers: {
  label: string;
  dataColumn: string;
  attribution: string;
  colorScheme?: readonly string[] | string[];
  tooltipKeys?: Record<string, string>;
  tooltipFormatter?: (value: any) => string;
}[] = [
  {
    label: "Pounds of Chemicals Applied",
    dataColumn: "lbs_chm_used",
    attribution: "CDPR PUR 2017-2022; 2020 Census Geos",
    tooltipKeys: {
      lbs_chm_used: "Pounds of Chemicals Applied",
    },
  },
  {
    label: "Pounds of Product Applied",
    dataColumn: "lbs_prd_used",
    attribution: "CDPR PUR 2017-2022; 2020 Census Geos",
    tooltipKeys: {
      lbs_prd_used: "Pounds of Product Applied",
    },
  },
  {
    label: "AI Intensity (lbs/sq mi)",
    dataColumn: "ai_intensity",
    attribution: "CDPR PUR 2017-2022; 2020 Census Geos",
    tooltipKeys: {
      ai_intensity: "AI Intensity (lbs/sq mi)",
    },
  },
  {
    label: "Product Intensity (lbs/sq mi)",
    dataColumn: "prd_intensity",
    attribution: "CDPR PUR 2017-2022; 2020 Census Geos",
    tooltipKeys: {
      prd_intensity: "Product Intensity (lbs/sq mi)",
    },
  },
  {
    label: "Total Population",
    dataColumn: "Pax Total",
    attribution: ACS_ATTRIBTUION,
    colorScheme: d3.schemeYlGnBu[5],
    tooltipKeys: {
      "Pax Total": "Total Population",
    },
  },
  {
    label: "Percent Black or African American",
    dataColumn: "Pct NH Black",
    attribution: ACS_ATTRIBTUION,
    colorScheme: d3.schemePurples[5],
    tooltipKeys: {
      "Pct NH Black": "Percent Black or African American",
    },
    tooltipFormatter: percentFormatter
  },
  {
    label: "Percent Hispanic or Latino",
    dataColumn: "Pct Hispanic",
    attribution: ACS_ATTRIBTUION,
    colorScheme: d3.schemeOranges[5],
    tooltipKeys: {
      "Pct Hispanic": "Percent Hispanic or Latino",
    },
    tooltipFormatter: percentFormatter
  },
  // "Percent Non-Hispanic White",
  // "Percent Asian",
  // "Percent Native American",
  // "Percent Native Hawaiian or Pacific Islander",
  {
    label: "Percent Non-Hispanic White",
    dataColumn: "Pct NH White",
    attribution: ACS_ATTRIBTUION,
    colorScheme: d3.schemeBlues[5],
    tooltipKeys: {
      "Pct NH White": "Percent Non-Hispanic White",
    },
    tooltipFormatter: percentFormatter
  },
  {
    label: "Percent Non-Hispanic Asian",
    dataColumn: "Pct NH Asian",
    attribution: ACS_ATTRIBTUION,
    colorScheme: d3.schemeGreens[5],
    tooltipKeys: {
      "Pct NH Asian": "Percent Asian",
    },
    tooltipFormatter: percentFormatter
  },
  {
    label: "Percent Non-Hispanic American Indian and Alaska Native",
    dataColumn: "Pct NH AIAN",
    attribution: ACS_ATTRIBTUION,
    colorScheme: d3.schemeReds[5],
    tooltipKeys: {
      "Pct NH AIAN": "Percent American Indian and Alaska Native",
    },
    tooltipFormatter: percentFormatter
  },
  {
    label: "Percent Non-Hispanic Native Hawaiian and Pacific Islander",
    dataColumn: "Pct NH NHPI",
    attribution: ACS_ATTRIBTUION,
    colorScheme: d3.schemeOranges[5],
    tooltipKeys: {
      "Pct NH NHPI": "Percent Native Hawaiian and Pacific Islander",
    },
    tooltipFormatter: percentFormatter
  },
  {
    label: "Percent With Less Than High School",
    dataColumn: "Pct No High School",
    attribution: ACS_ATTRIBTUION,
    colorScheme: d3.schemeReds[5],
    tooltipKeys: {
      "Pct No High School": "Percent With Less Than High School",
    },
    tooltipFormatter: percentFormatter
  },
  {
    label: "Percent Working in Agriculture",
    dataColumn: "Pct Agriculture",
    attribution: ACS_ATTRIBTUION,
    colorScheme: d3.schemeGreens[5],
    tooltipKeys: {
      "Pct Agriculture": "Percent Working in Agriculture",
    },
    tooltipFormatter: percentFormatter
  },
];
export const MapLayerOptions = mapLayers.map((layer) => layer.label);

export const getMapConfig = (view: string): {
  layer: string;
  tileset: string;
  endpoint: string;
  tileId: string;
  dataId: string;
  filterKeys?: string[];
  tooltipKeys?: Record<string, string>;
  sortKeys?: string | string[];
}[] => [
  {
    layer: "Townships",
    tileset: "cpr2024.62lnnt0z",
    endpoint: "66c364f46cea330008e258c2",
    tileId: "MeridianTownshipRange",
    dataId: "MeridianTownshipRange",
    sortKeys: "MeridianTownshipRange",
    filterKeys: view === 'map' ? mapKeys : demogViewKeys,
    tooltipKeys: {
      MeridianTownshipRange: "MeridianTownshipRange",
    },
  },
  {
    layer: "Counties",
    tileset: "cpr2024.47ns3kc2",
    endpoint: "66c3a44c698c0f0008ae926b",
    tileId: "GEOID",
    dataId: "FIPS",
    sortKeys: "Area Name",
    filterKeys: [...view === 'map' ? mapKeys : demogViewKeys, "Agricultural Use"],
    tooltipKeys: {
      "Area Name": "Name",
      GEOID: "GEOID",
    },
  },
  {
    layer: "School Districts",
    tileset: "cpr2024.5i4j8yha",
    endpoint: "66c3a4e0698c0f0008ae926c",
    tileId: "FIPS",
    dataId: "FIPS",
    filterKeys: view === 'map' ? mapKeys : demogViewKeys,
    sortKeys: "Area Name",
    tooltipKeys: {
      "Area Name": "Name",
      FIPS: "FIPS",
    },
  },
  {
    layer: "Tracts",
    tileset: "cpr2024.0n14fhc6",
    endpoint: "66c3a573698c0f0008ae926d",
    tileId: "GEOID",
    dataId: "GEOID",
    filterKeys: view === 'map' ? mapKeys : demogViewKeys,
    sortKeys: ["NAMELSADCO", "NAMELSAD"],
    tooltipKeys: {
      NAMELSADCO: "County",
      NAMELSAD: "Name",
      GEOID: "GEOID",
    },
  },
  {
    layer: "Sections",
    tileset: "cpr2024.atj2mdo6",
    endpoint: "66c3a5be698c0f0008ae926e",
    tileId: "CO_MTRS",
    dataId: "comtrs",
    sortKeys: "comtrs",
    filterKeys: view === 'map' ? mapKeys : demogViewKeys,
    tooltipKeys: { NAMELSAD: "Name", REGIONNAME: "Region", comtrs: "CO_MTRS" },
  },
  {
    layer: "Zip Codes",
    tileset: "cpr2024.3w98sm2d",
    endpoint: "66c3a63a698c0f0008ae926f",
    tileId: "ZCTA5CE20",
    dataId: "ZCTA5CE20",
    sortKeys: "ZCTA5CE20",
    filterKeys: view === 'map' ? mapKeys : demogViewKeys,
    tooltipKeys: { ZCTA5CE20: "Zip Code", USPS_ZIP_PREF_CITY: "City" },
  },
];

export const getMapConfigFilterSpec: (view:string) => FilterSpec = (view) => ({
  queryParam: "na",
  label: "Geography",
  component: "dropdown",
  options: {
    type: "static",
    values: getMapConfig(view).map((config) => ({
      value: config.layer!,
      label: config.layer!,
    })),
  },
})
