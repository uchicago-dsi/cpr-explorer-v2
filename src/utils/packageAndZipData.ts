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

export const excelExportData = async (
  view: string,
  filters: FilterState[],
  data: Array<Record<string,any>>,
  info?: Record<string,any>
) => {
  const ExcelJS = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Pesticide Data Explorer';
  workbook.created = new Date();
  workbook.modified = new Date();

  const infoSheet = workbook.addWorksheet('About')
  infoSheet.getColumn('A').width = 40
  infoSheet.getColumn('B').width = 40
  infoSheet.getColumn('A').alignment = { wrapText: true }
  infoSheet.getColumn('B').alignment = { wrapText: true }

  const dataSheet = workbook.addWorksheet('Data')

  // add "About this data" to A1 on the first sheet
  infoSheet.addRow(["Data Description"])
  const dataInfo = (dataDescription[view as keyof typeof dataDescription]||'').split("\n")
  dataInfo.forEach(row => {
    if (row.includes(":") && row.includes("-")){
      const parts = row.replace("- ", "").split(":").map(f => f.trim())
      infoSheet.addRow(parts)
    } else if (row == '--' || !row.length) {
    } else {
      infoSheet.addRow([row])
    }
  })
  infoSheet.addRow([])
  infoSheet.addRow(["Filters applied to this data"])
  const cleanFiltersInfo = cleanFitlersText(view, filters, info)
  cleanFiltersInfo.split("\n").forEach(row => {
    if (row.includes(":")){
      const parts = row.replace("- ", "").split(":").map(f => f.trim())
      infoSheet.addRow(parts)
    } else if (row == '--' || !row.length) {
    } else {
      infoSheet.addRow([row])
    }
  })
  infoSheet.addRow([])
  infoSheet.addRow(["License"])
  infoSheet.addRow([license])


  // add the data to the second sheet
  dataSheet.addRows([Object.keys(data[0])])
  dataSheet.columns.forEach(column => {
    column.width = 30
  })
  data.forEach(row => {
    dataSheet.addRow(Object.values(row))
  })
  // download as xls
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = "pesticide-data-explorer.xlsx"
  link.click()
}

export const exportData = async (
  format: string,
  view: string,
  filters: FilterState[],
  data: Array<Record<string,any>>,
  info?: Record<string,any>,
) => {
  if (format === "zip") {
    await packageAndZipData(view, filters, data, info)
  } 
  if (format === "excel") {
    await excelExportData(view, filters, data, info)
  }
}