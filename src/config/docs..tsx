export const license = `MIT License...`

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
  `,
  timeseries: `
  Data columns
  --
  - monthyear: Month and Year as YYYY-MM
  - lbs_chm_used: Pounds of active ingredient chemcial used
  - lbs_prd_used: Pounds of product used
  - chem_code / ai_class / ai_type / ai_type_specific / prodno: Chemical codes and types
  `
}