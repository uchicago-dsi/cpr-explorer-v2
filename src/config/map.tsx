import { FilterSpec } from "../types/state"
import { ingredientSection } from "./filters"
import * as d3 from "d3"

const demographiFilterKeys = [
  "Median Household Income",
  "Percent Black or African American",
  "Percent Hispanic or Latino",
]
const ingredientKeys = [
  ...ingredientSection.filters.map(filter => filter.label)
]

const defaultKeys = [ 
  "Date Range",
  ...demographiFilterKeys,
  ...ingredientKeys
]
// const sectionTownshipKeys = [ 
//   "Date Range",
//   ...ingredientKeys
// ]
const ACS_ATTRIBTUION = "ACS 2021 5-year estiamtes, 2020 Census Geos"

export const mapLayers: {
  label: string;
  dataColumn: string;
  attribution: string;
  colorScheme?: readonly string[] | string[];
}[] = [
  {
    label: "Pounds of Chemicals Applied",
    dataColumn: "lbs_chm_used",
    attribution: "CDPR PUR 2017-2022; 2020 Census Geos"
  },
  {
    label: "Pounds of Product Applied",
    dataColumn: "lbs_prd_used",
    attribution: "CDPR PUR 2017-2022; 2020 Census Geos"
  },
  {
    label: "AI Intensity (lbs/sq mi)",
    dataColumn: "ai_intensity",
    attribution: "CDPR PUR 2017-2022; 2020 Census Geos"
  },
  {
    label: "Product Intensity (lbs/sq mi)",
    dataColumn: "prd_intensity",
    attribution: "CDPR PUR 2017-2022; 2020 Census Geos"
  },
  {
    label: "Total Population",
    dataColumn: "Pax Total",
    attribution: ACS_ATTRIBTUION,
    colorScheme: d3.schemeYlGnBu[5]
  },
  {
    label: "Percent Black or African American",
    dataColumn: "Pct NH Black",
    attribution: ACS_ATTRIBTUION,
    colorScheme: d3.schemePurples[5]
  },
  {
    label: "Percent Hispanic or Latino",
    dataColumn: "Pct Hispanic",
    attribution: ACS_ATTRIBTUION,
    colorScheme: d3.schemeOranges[5]
  },
  {
    label: "Percent With Less Than High School",
    dataColumn: "Pct No High School",
    attribution: ACS_ATTRIBTUION,
    colorScheme: d3.schemeReds[5]
  },
  {
    label: "Percent Working in Agriculture",
    dataColumn: "Pct Agriculture",
    attribution: ACS_ATTRIBTUION,
    colorScheme: d3.schemeGreens[5]
  }
]
export const MapLayerOptions = mapLayers.map((layer) => layer.label)

export const mapConfig: {
  layer: string;
  tileset: string;
  endpoint: string;
  tileId: string;
  dataId: string;
  filterKeys?: string[];
}[] = [
  {
    layer: 'Townships',
    tileset: "cpr2024.62lnnt0z",
    endpoint: "66c364f46cea330008e258c2",
    tileId: "MeridianTownshipRange",
    dataId: "MeridianTownshipRange",
    filterKeys: defaultKeys
  },
  {
    layer: "Counties",
    tileset:"cpr2024.47ns3kc2",
    endpoint: "66c3a44c698c0f0008ae926b",
    tileId: "GEOID",
    dataId: "FIPS",
    filterKeys: defaultKeys
  },
  {
    layer: "School Districts",
    tileset: "cpr2024.5i4j8yha",
    endpoint: "66c3a4e0698c0f0008ae926c",
    tileId: "FIPS",
    dataId: "FIPS",
    filterKeys: defaultKeys
  },
  {
    layer: "Tracts",
    tileset: "cpr2024.0n14fhc6",
    endpoint: "66c3a573698c0f0008ae926d",
    tileId: "GEOID",
    dataId: "GEOID",
    filterKeys: defaultKeys
  },
  {
    layer: "Sections",
    tileset: "cpr2024.atj2mdo6",
    endpoint: "66c3a5be698c0f0008ae926e", 
    tileId: "CO_MTRS",
    dataId: "comtrs",
    filterKeys: defaultKeys
  },
  {
    layer: 'ZCTA',
    tileset: "cpr2024.3w98sm2d",
    endpoint: "66c3a63a698c0f0008ae926f",
    tileId: "ZCTA5CE20",
    dataId: "ZCTA5CE20",
    filterKeys: defaultKeys
  },
]

export const mapConfigFilterSpec: FilterSpec = {
  queryParam: "na",
  label: "Geography",
  component: "dropdown",
  options: {
    type: 'static',
    values: mapConfig.map((config) => ({
      value: config.layer!,
      label: config.layer!
    }))
  }
}