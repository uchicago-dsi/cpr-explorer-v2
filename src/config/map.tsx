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
    endpoint: "66bbaa9a5b6d420008c78e54",
    tileId: "GEOID",
    dataId: "FIPS",
    filterKeys: defaultKeys
  },
  {
    layer: "School Districts",
    tileset: "cpr2024.5i4j8yha",
    endpoint: "66bbaa715b6d420008c78e53",
    tileId: "FIPS",
    dataId: "FIPS",
    filterKeys: defaultKeys
  },
  {
    layer: "Tracts",
    tileset: "cpr2024.0n14fhc6",
    endpoint: "66bb8eb8811a870008714ce7",
    tileId: "GEOID",
    dataId: "GEOID",
    filterKeys: defaultKeys
  },
  {
    layer: "Sections",
    tileset: "cpr2024.atj2mdo6",
    endpoint: "66bbaa465b6d420008c78e52" , 
    tileId: "CO_MTRS",
    dataId: "comtrs",
    filterKeys: defaultKeys
  },
  {
    layer: 'ZCTA',
    tileset: "cpr2024.3w98sm2d",
    endpoint: "66bba9ed5b6d420008c78e50",
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