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
    endpoint: "6568f10116faa30008555612",
    tileId: "TownshipRange",
    dataId: "townshiprange"
  },
  {
    layer: "Counties",
    tileset:"cpr2024.47ns3kc2",
    endpoint: "6567860cb678c50008c549fe",
    tileId: "GEOID",
    dataId: "FIPS"
  },
  // {
  //   layer: "School Districts",
  //   tileset: "",
  //   endpoint: "656775cc2aa95c0008fc60f4",
  //   tileId: "GEOID",
  //   dataId: "SCID"
  // },
  {
    layer: "Tracts",
    tileset: "cpr2024.0n14fhc6",
    endpoint: "656774962aa95c0008fc60f3",
    tileId: "GEOID",
    dataId: "GEOID"
  },
  {
    layer: "Sections",
    tileset: "cpr2024.atj2mdo6",
    endpoint: "6691750964ade80008122215" , 
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