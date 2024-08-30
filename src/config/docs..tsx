export const license = `MIT License...`
export const dataSources = `

Data Sources
--
Pesticide data accessed via CalPiP
https://calpip.cdpr.ca.gov/main.cfm
Source data Pesticide Use Reporting (PUR)
https://www.cdpr.ca.gov/docs/pur/purmain.htm
Demographic Data (American Community Survey 2021 5-year estimates) accessed via Social Explorer
https://www.socialexplorer.com/
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