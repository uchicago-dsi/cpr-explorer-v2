import { Box, styled, Typography } from "@mui/material";
import { WidgetContainer } from "./WidgetContainer";

const InlineCode = styled("code")({
  backgroundColor: "#f4f4f4",
  padding: "0.2rem",
  borderRadius: "0.2rem",
  fontFamily: "monospace",
});

export const AboutWidget = () => {
  return (
    <WidgetContainer>
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection="column"
        gap={2}
        p={2}
      >
        <Typography component={"h3"} fontSize={"1.5rem"} fontWeight={"bold"}>
          About
        </Typography>
        <Typography component={"p"}>
          This tool makes it easier to explore California's Pesticide Use
          Reporting (PUR) data and combine that data with common demographic
          census variables. This tool also makes PUR data available at various
          census geographies, which are often helpful for understanding the use
          of pesticides in a community and to support data-driven advocacy.
          <br />
          This tool was developed by the Open Spatial Lab at the University of
          Chicago Data Science Institute in collaboration with Californian's for
          Pesticide Reform (CPR) and Pesticide Action Network North American
          (PANNA).
          <br />
          Support for this project was provided by the Robert Wood Johnson
          Foundation and 11th Hour Foundation. The views expressed here do not
          necessarily reflect the views of the Foundations.
        </Typography>
        <Typography component={"h4"}>Data Description</Typography>
        <Typography component={"p"}>
          California's Pesticide Use Reporting (PUR) program has collected data
          on California's agriculture and many non-agriculture pesticide uses
          across the state since 1970 through present day. Managed and collected
          by California's Department of Pesticide Regulation, PUR data is
          refreshed about once per year. More information is available from [CA
          DPR](https://www.cdpr.ca.gov/docs/pur/purmain.htm). California PUR
          Data This interactive data explorer enables users to filter or
          summarize publicly available California PUR data based on the
          following parameters. PUR data was accessed in Summer 2024. Data from
          2017 to 2022 (the most recent data year) are available in this tool.
          Year (start and end), months Active ingredient Active ingredient class
          or type Product Commodity Agricultural or non-agricultural use
          (Agricultural available at 1 sq. mi units; non-agricultural available
          at county-level.)
          <br />
          <br />
          Spatial Data (GIS) Spatial data enables users to query data based on
          the following areas, or spatial units:
          <ul>
            <li>
              Census Administrative Boundaries: ACS 2021 and 2020 boundaries,
              via census.gov
            </li>
            <li>Counties Zip codes Census tracts</li>
            <li>
              School districts: elementary, secondary, and unified school
              districts
            </li>
          </ul>
          Community Data:
          <ul>
            <li>
              Community and demographic data allows users to better understand
              the impact of pesticide use on different populations locally and
              across the state.
            </li>
            <li>
              Demographic data available to filter, map, and explore include:
              Census Demographic Data: ACS 2021 5-year estimates, via Social
              Explorer Population Race and ethnicity Education
            </li>
          </ul>
        </Typography>
        <Typography component={"h4"}>Data Processing</Typography>
        <Typography component={"p"}>
          Data processing for this tool includes the following steps:
          <ol>
            <li>Data accessed from CalPip via web interface and downloaded</li>
            <li>
              Data converted from <InlineCode>txt</InlineCode> format to Apache
              Parquet with the following columns retained:
              <InlineCode>COMTRS</InlineCode> ,
              <InlineCode>POUNDS_CHEMICAL_APPLIED</InlineCode> ,
              <InlineCode>POUNDS_PRODUCT_APPLIED</InlineCode> ,
              <InlineCode>AERIAL_GROUND_INDICATOR</InlineCode> ,
              <InlineCode>AG_NONAG</InlineCode>,
              <InlineCode>AMOUNT_PLANTED</InlineCode> ,
              <InlineCode>CHEMICAL_CODE</InlineCode> ,
              <InlineCode>COUNTY_CODE</InlineCode> ,
              <InlineCode>PRODUCT_CHEMICAL_PERCENT</InlineCode>,
              <InlineCode>PRODUCT_NUMBER</InlineCode> ,
              <InlineCode>SITE_CODE</InlineCode>
            </li>
            <li>
              Date converted to ISO format <InlineCode>YYYY-MM</InlineCode>{" "}
              (column name: <InlineCode>monthyear</InlineCode>) for easier
              sorting and filtering
            </li>
            <li>
              Data grouped on
              <InlineCode>COMTRS</InlineCode>,
              <InlineCode>AERIAL_GROUND_INDICATOR</InlineCode> ,
              <InlineCode>AG_NONAG</InlineCode>,
              <InlineCode>CHEMICAL_CODE</InlineCode> ,
              <InlineCode>COUNTY_CODE</InlineCode> ,
              <InlineCode>PRODUCT_CHEMICAL_PERCENT</InlineCode>,
              <InlineCode>PRODUCT_NUMBER</InlineCode> ,
              <InlineCode>SITE_CODE</InlineCode> and{" "}
              <InlineCode>monthyear</InlineCode>
              to optimize data size
            </li>
            <li>
              Data are joined to active ingredient classes, types, and specific
              types from previous work developed in the PUR WebGIS
            </li>
          </ol>
          For section-level data, no further processing is applied. For
          TownshipRange and County data, the section data was further grouped on
          county code and township range identifiers.
          <br />
          For census geographic units, section level PUR data was joined to the
          relevant geographic units. This process applied area interpolation to
          calculate the proportion of each section that falls within each
          geographic unit. The following georocessing steps were applied:
          <ol>
            <li>
              Convert all geospatial data to NAD83 / California Albers
              projection (EPSG:3310)
            </li>
            <li>Calculate original area of each section (roughly 1 sq mi)</li>
            <li>Overlay section areas with census geographies</li>
            <li>
              Calculate the propertion of the section in each census geography
            </li>
            <li>
              To resolve topological data errors and optimize data, any section
              with at least 95% of its area in one census geography was applied
              fully to that census geography
            </li>
            <li>
              If a section was split between two census geographies, its pounds
              of chemical applied and pounds of product applied would be split
              between those two geographies as a portion of the area within
            </li>
          </ol>
          Please note that any data processing inherently adds some data
          uncertainty. In this case, we estimate that across the full data there
          is around 0.02% for census tracts and school districts due to
          rounding, small geometry errors, etc. For Zip Code Tabulation Areas
          (ZCTAs), around 2% of data is missing due to lack of total coverage
          from ZCTA boundaries. County, township, and section data are directly
          mapped to PUR data and have effectively no data uncertainty added in
          our processing.
          <br />
          Census demographic data is joined based on relevant geographic
          identifier (GEOID, FIPS, or ZCTA).
        </Typography>
        <Typography component={"h4"}>Data Filtering</Typography>
        <Typography component={"p"}>
          Several data filters are applied based on user data requests.
          <br />
          The following filters match using a SQL <InlineCode>
            IN
          </InlineCode>{" "}
          where clause:
          <ol>
            <li>
              Active Ingredient (AI): <InlineCode>CHEMICAL_CODE</InlineCode> in
              selected active ingredient identifiers
            </li>
            <li>
              Active Ingredient Class: <InlineCode>ai_class</InlineCode> in
              selected active ingredient classes
            </li>
            <li>
              Active Ingredient Type: <InlineCode>ai_type</InlineCode> in
              selected active ingredient typees
            </li>
            <li>
              Active Ingredient Type Specific:{" "}
              <InlineCode>ai_type_specific</InlineCode> in selected specific
              active ingredient types
            </li>
            <li>
              Product: <InlineCode>prodno</InlineCode> in selected product codes
            </li>
            <li>
              Site: <InlineCode>site_code</InlineCode> in selected site codes
            </li>
          </ol>
          The following filters use a SQL greater than{" "}
          <InlineCode>{">"}</InlineCode> or less than{" "}
          <InlineCode>{"<"}</InlineCode> where clause:
          <ol>
            <li>
              Percent Black or African American:{" "}
              <InlineCode>pctblack</InlineCode> calculated from ACS 2021 data
              non-hispanic black or african american population divided by total
              population
            </li>
            <li>
              Percent Hispanic or Latino: <InlineCode>pcthispanic</InlineCode>{" "}
              calculated from ACS 2021 data hispanic or latino population
              divided by total population
            </li>
            <li>
              Median household income: <InlineCode>hhincome</InlineCode>{" "}
              calculated from ACS 2021 data
            </li>
          </ol>
        </Typography>
        <Typography component={"h4"}>Data Grouping</Typography>
        <Typography component={"p"}>
          After filtering, the following data groupings are applied:
          <br />
          <b>Map View</b>
          <br />
          <ol>
            <li>
              Township range: Grouped by Township range identifier and pounds of
              chemical and product summed
            </li>
            <li>
              County: Grouped by county identifier and pounds of chemical and
              product summed
            </li>
            <li>
              Tract: Grouped by tract identifier and pounds of chemical and
              product summed
            </li>
            <li>
              School district: Grouped by School district identifier and pounds
              of chemical and product summed
            </li>
            <li>
              Zip code tabulation area (ZCTA): Grouped by Zip code tabulation
              area (ZCTA) identifier and pounds of chemical and product summed
            </li>
            <li>
              Section: Grouped by COMTRS identifier and pounds of chemical and
              product summed
            </li>
          </ol>
          <br />
          <b>Time series view</b>
          <br />
          <ol>
            <li>
              Active Ingredient Class: Grouped by Active Ingredient Class and
              date (monthyear) and pounds of chemical and product summed
            </li>
            <li>
              Active Ingredient Type: Grouped by Active Ingredient Type and date
              (monthyear) and pounds of chemical and product summed
            </li>
            <li>
              Active Ingredient Type Specific: Grouped by Active Ingredient Type
              Specific and date (monthyear) and pounds of chemical and product
              summed
            </li>
            <li>
              Active Ingredient: Grouped by Active Ingredient identifier and
              date (monthyear) and pounds of chemical and product summed
            </li>
            <li>
              Product: Grouped by product identifier and date (monthyear) and
              pounds of chemical and product summed
            </li>
          </ol>
        </Typography>
      </Box>
    </WidgetContainer>
  );
};
