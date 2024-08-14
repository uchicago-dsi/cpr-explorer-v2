import { dataDescription, license } from "../config/docs."
import { unparse } from "papaparse";
import { downloadZip } from "client-zip"
import { FilterState } from "../types/state";

const cleanFitlersText = (view: string, filters: FilterState[], info?: Record<string,any>) => {
  let filterText = `Data Filters\n--\nView: ${view}\n`
  if (info) {
    Object.entries(info).forEach(([key, value]) => {
      filterText += `${key}: ${value}\n`
    })
  }
  for (const filter of filters) {
    if (Array.isArray(filter.value) && Array.isArray(filter.queryParam)) {
      for (let i=0; i<filter.queryParam.length; i++) {
        let value = `${filter.value[i]}`
        const valueLabel = (filter.valueLabels as any[])?.[i]
        if (valueLabel && valueLabel !== value) value += ` (${valueLabel})`
        filterText += `${filter.label} - ${filter.queryParam[i]}: ${value}\n`
      }
    } else if (Array.isArray(filter.value)) {
      let valueText = `${filter.label}: `
      for (let i=0; i<filter.value.length; i++) {
        let value = `${filter.value[i]}`
        const valueLabel = (filter.valueLabels as any[])?.[i]
        if (valueLabel) value += `(${valueLabel})`
        if (i < filter.value.length - 1) value += `, `
        valueText += `${value}`
      }
      filterText += `${valueText}\n`
    } else {
      filterText += `${filter.label}: ${filter.value}\n`
    }
  }
  return filterText
}

export const packageAndZipData = async (
  view: string,
  filters: FilterState[],
  data: Array<Record<string,any>>,
  info?: Record<string,any>
) => {
  const docsOutput = {
    name: "description.txt",
    lastModified: new Date(),
    input: dataDescription[view as keyof typeof dataDescription]
  }
  const dataOutput = {
    name: "data.csv",
    lastModified: new Date(),
    input: unparse(data)
  }
  const licenseOutput = {
    name: "license.txt",
    lastModified: new Date(),
    input: license
  }

  let cleanFilters = cleanFitlersText(view, filters, info)

  const filtersOutput = {
    name: "filters.txt",
    lastModified: new Date(),
    input: cleanFilters
  }

  // get the ZIP stream in a Blob
  const blob = await downloadZip([
    docsOutput,
    dataOutput,
    licenseOutput,
    filtersOutput
  ]).blob()

  // make and click a temporary link to download the Blob
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = "test.zip"
  link.click()
  link.remove()
}