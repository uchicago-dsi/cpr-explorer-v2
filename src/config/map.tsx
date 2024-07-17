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