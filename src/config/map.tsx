import { FilterSpec } from "../types/state"

export const mapConfig: {
  layer: string;
  tileset: string;
  endpoint: string;
  tileId: string;
  dataId: string;
}[] = [
  {
    layer: 'Townships',
    tileset: "cpr2024.cioych4l",
    endpoint: "66bbaa1d5b6d420008c78e51",
    tileId: "TownshipRange",
    dataId: "TownshipRange"
  },
  {
    layer: "Counties",
    tileset:"cpr2024.47ns3kc2",
    endpoint: "66bbaa9a5b6d420008c78e54",
    tileId: "GEOID",
    dataId: "FIPS"
  },
  {
    layer: "School Districts",
    tileset: "cpr2024.5i4j8yha",
    endpoint: "66bbaa715b6d420008c78e53",
    tileId: "FIPS",
    dataId: "FIPS"
  },
  {
    layer: "Tracts",
    tileset: "cpr2024.0n14fhc6",
    endpoint: "66bb8eb8811a870008714ce7",
    tileId: "GEOID",
    dataId: "GEOID"
  },
  {
    layer: "Sections",
    tileset: "cpr2024.atj2mdo6",
    endpoint: "66bbaa465b6d420008c78e52" , 
    tileId: "CO_MTRS",
    dataId: "comtrs"
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