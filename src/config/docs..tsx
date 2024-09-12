const dateAccessed = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

export const license = `
This data is licensed under the Creative Commons Attribution License 4.0 (CC-BY) (https://creativecommons.org/licenses/by/4.0/)

An appropriate attribution must accompany this data wherever it is used or published. Attribution should look like the following information:\n

Halpern, Dylan, Susan Paykin, PANNA, and CPR. PUR Data Explorer. Open Spatial Lab, Data Science Institute, 2023-2024. Accessed ${dateAccessed}. CPR Explorer, ${window.location.href}. Licensed under CC-BY.

Bibtex for citation managers such as Zotero:

@misc{halpern2024pur,
  author       = {Dylan Halpern and Susan Paykin and Pesticide Action Network North America and Californians for Pesticide Reform},
  title        = {PUR Data Explorer},
  year         = {2023--2024},
  note         = {Accessed: ${dateAccessed}},
  url          = {${window.location.href}},
  license      = {CC-BY},
  organization = {Open Spatial Lab, Data Science Institute, University of Chicago}
}
`
export const dataSources = `

Data Sources
--
California Department of Pesticide Regulation, 2022. AI Categories Table.
CalPIP Home - California Pesticide Information Portal [WWW Document], 2024. URL https://calpip.cdpr.ca.gov/main.cfm (accessed 9.5.24).
Pesticide Use Reporting [WWW Document], 2022. URL https://www.cdpr.ca.gov/docs/pur/purmain.htm (accessed 9.5.24).
Social Explorer - Tables - ACS 2021 (5-Year Estimates) [WWW Document], 2021. . Social Explorer. URL https://www.socialexplorer.com/explore-maps (accessed 9.5.24).
US Census Bureau, 2020. TIGER/Line Shapefiles [WWW Document]. Census.gov. URL https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html (accessed 9.5.24).
`
export const dataDescription = {
map: `
Data columns
--
- GEOID: Geographic Identifier [Census tracts only]
- FIPS: Federal Information Processing Standards [Counties, School Districts]
- TownshipRange: Township Range [Townships]
- comtrs: County-Municipality-Section [Sections]
- ZCTA5CE20: ZIP Code Tabulation Area [ZIP Codes]
- lbs_chm_used: Pounds of active ingredient chemcial used
- lbs_prd_used: Pounds of product used
- ai_intensity: Pounds of active ingredient per square mile of total area (not just growing area)
- prd_intensity: Pounds of product per square mile of total area (not just growing area)
- Median HH Income: Median Household Income (2021 dollars)
- Pax Total: Total Population
- Pax NH Black: Total Black or African American Population (non hispanic)
- Pct NH Black: Percent Black or African American
- Pax Hispanic: Total Hispanic or Latino Population
- Pct Hispanic: Percent Hispanic or Latino
- Pct No High School: Percent of people over 25 with Less Than High School degree as their highest level of education
- Pct Agriculture: Percent of people working in Agriculture
${dataSources}
`,
timeseries: `
Data columns
--
- monthyear: Month and Year as YYYY-MM
- lbs_chm_used: Pounds of active ingredient chemcial used
- lbs_prd_used: Pounds of product used
- chem_code / ai_class / ai_type / ai_type_specific / prodno: Chemical codes and types
${dataSources}
`
}