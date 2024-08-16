import { FilterSpec } from "../types/state"
import { ingredientSection } from "./filters"


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
const sectionTownshipKeys = [ 
  "Date Range",
  ...ingredientKeys
]

export const mapLayers: {
  label: string;
  dataColumn: string;
  attribution: string;
  colorScheme?: readonly string[] | string[];
}[] = [
  {
    label: "Pounds of Chemicals Applied",
    dataColumn: "lbs_chm_used",
    attribution: "CDPR PUR 2017-2022; Census Geographies 2020"
  },
  {
    label: "Pounds of Product Applied",
    dataColumn: "lbs_prd_used",
    attribution: "CDPR PUR 2017-2022; Census Geographies 2020"
  },
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
    tileset: "cpr2024.cioych4l",
    endpoint: "66bbaa1d5b6d420008c78e51",
    tileId: "TownshipRange",
    dataId: "TownshipRange",
    filterKeys: sectionTownshipKeys
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
    filterKeys: sectionTownshipKeys
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