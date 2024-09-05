import { Box, Button, styled, Typography } from "@mui/material";
import { WidgetContainer } from "./WidgetContainer";
import React from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const InlineCode = styled("code")({
  backgroundColor: "#f4f4f4",
  padding: "0.2rem",
  borderRadius: "0.2rem",
  fontFamily: "monospace",
});

const references = {
  "areal-interpolation": [
    {
      name: "Markoff and Shapiro, 1973",
      link: "https://www.tandfonline.com/doi/epdf/10.1080/00182494.1973.10112670",
    },
    {
      name: "Crackel, 1975",
      link: "https://www.tandfonline.com/doi/pdf/10.1080/00182494.1975.10112707",
    },
    {
      name: "Tobler, 1979",
      link: "https://www.tandfonline.com/doi/abs/10.1080/01621459.1979.10481647",
    },
    {
      name: "Lam, 1983",
      link: "https://www.tandfonline.com/doi/abs/10.1559/152304083783914958",
    },
    {
      name: "Gotway and Young, 2002",
      link: "https://www.tandfonline.com/doi/abs/10.1198/016214502760047140?casa_token=YgEHY",
    },
  ],
};

const Reference: React.FC<{ id: keyof typeof references }> = ({ id }) => {
  // list of a elements inline
  if (!references[id]) return <></>;

  const refs = references[id].map((ref, i) => (
    <span style={{ display: "inline" }} key={i}>
      <a
        style={{ display: "inline" }}
        href={ref.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {ref.name}
      </a>
      {i < references[id].length - 1 ? "; " : ""}
    </span>
  ));
  return (
    <Typography component={"p"} display="inline">
      ({refs})
    </Typography>
  );
};

const arealSteps = [
  {
    imagePath: "explainer-01.png",
    title: "Areal Interpolation Problem",
    text: "The areal interpolation problem is a method to combine data from different spatial units. Imagine we want to assign the pesticide use in a section that overlaps two school districts.",
  },
  {
    imagePath: "explainer-02.png",
    title: "Calculate Original Area",
    text: "First we calculate the area of the section. In this case, the section is roughly 1 square mile.",
  },
  {
    imagePath: "explainer-03.png",
    title: "Overlay and Calculate Proportions",
    text: "Next, we calculate how much of the section is in the two (or more) school districts. In this case, the section is 70% in School District 1 and 30% in School District 2.",
  },
  {
    imagePath: "explainer-04.png",
    title: "Assign Values to Census Areas",
    text: "Last, we assign the value from the section to the two school districts as a proportion weighted by the overlap. Imagine that there are 210lbs used in the section. We assign 70% of that to School District 1 (147lb = 210lbs * 0.7) and 30% to School District 2 (63lbs = 210lbs * 0.3).",
  },
];
const ArealExplainer: React.FC = () => {
  const [step, setStep] = React.useState(0);
  return (
    <Box
      sx={{
        width: "100%",
        background: "white",
        border: "1px solid gray",
        boxShadow: "0 0 5px rgba(0,0,0,0.1)",
        my: 2,
      }}
    >
      <Box
        p={2}
        my={2}
        component={"div"}
        sx={{ width: "100%", boxSizing: "border-box" }}
      >
        <img
          src={arealSteps[step].imagePath}
          alt={arealSteps[step].title}
          style={{
            width: "100%",
            height: "auto",
            maxWidth: "800px",
            margin: "0 auto",
            display: "block",
          }}
        />
        <Typography component={"h4"}>{arealSteps[step].text}</Typography>
      </Box>
      <Stepper activeStep={step} alternativeLabel>
        {arealSteps.map((step) => (
          <Step key={step.title} onClick={() => console.log(step)}>
            <StepLabel>{step.title}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Button
          color="inherit"
          disabled={step === 0}
          onClick={() => setStep((prev) => (prev - 1 >= 0 ? prev - 1 : prev))}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button
          disabled={step === arealSteps.length - 1}
          onClick={() =>
            setStep((prev) => (prev + 1 < arealSteps.length ? prev + 1 : prev))
          }
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export const AboutWidget = () => {
  return (
    <WidgetContainer
      style={{
        maxHeight: "calc(100vh - 70px)",
        overflow: "auto",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection="column"
        gap={2}
        p={4}
        pb={24}
        maxWidth="800px"
        margin="0 auto"
      >
        <Typography component={"h3"} fontSize={"1.5rem"} fontWeight={"bold"}>
          About
        </Typography>
        <Typography component={"p"}>
          This one-of-a-kind tool makes it easier to explore California's
          Pesticide Use Reporting (PUR) data and combine that data with common
          demographic census variables. This tool also makes PUR data available
          at various census geographies, which are often helpful for
          understanding the use of pesticides in a community and to support
          data-driven advocacy.
          <br />
          <br />
          Developed by the Open Spatial Lab at the University of Chicago Data
          Science Institute in collaboration with Californians for Pesticide
          Reform (CPR) and Pesticide Action Network North American (PANNA),
          project support for this tool was provided by the Robert Wood Johnson
          Foundation and 11th Hour Foundation. The views expressed here do not
          necessarily reflect the views of the Foundations.
        </Typography>
        <Typography component={"h4"} fontWeight={"bold"}>
          Data Description
        </Typography>
        <Typography component={"p"}>
          California's Pesticide Use Reporting (PUR) program has collected data
          on California's agriculture and many non-agriculture pesticide uses
          across the state since 1970 through present day. PUR data for this
          tool was accessed from the{" "}
          <a
            href="https://calpip.cdpr.ca.gov/main.cfm"
            target="_blank"
            rel="noopener noreferrer"
          >
            California Pesticide Information Portal (CalPIP).
          </a>{" "}
          PUR data are managed and collected by California's Department of
          Pesticide Regulation, and it is refreshed about once per year. More
          information is available from{" "}
          <a
            href="https://www.cdpr.ca.gov/docs/pur/purmain.htm"
            target="_blank"
            rel="noopener noreferrer"
          >
            CA DPR
          </a>
          .
          <br />
          <br />
          This interactive data explorer enables users to filter or summarize
          publicly available California PUR data based on the following
          parameters:
          <ul>
            <li>Start and end month</li>
            <li>
              Active ingredients, active ingredient classes, types, and specific
              types
            </li>
            <li>Site / crop produced</li>
            <li>Pesticide product</li>
            <li>Application method (aerial, ground, fumigation, or other)</li>
            <li>Agricultural or non-agricultural use</li>
          </ul>
          PUR data was accessed in Summer 2024. Pesticide product, active
          ingredients, and site lists for filtering were obtained from the PUR
          2022 data release files. The chemical class, use type,
          health/environment impact, and risk category were assigned from a
          category spreadsheet provided by of the Department of Pesticide
          Regulation.
          <br />
          <br />
          Spatial Data (GIS) Spatial data enables users to query data based on
          the following areas, or spatial units:
          <ul>
            <li>
              Census Administrative Boundaries: ACS 2021 and 2020 boundaries,
              via census.gov
            </li>
            <li>Counties Zip codes (ZCTA / Zip Code Tabulation Area)</li>
            <li>Census tracts</li>
            <li>
              School districts: elementary, secondary, and unified school
              districts
            </li>
          </ul>
          <b>Community Data:</b>
          <br />
          <br />
          Community and demographic data allow users to better understand the
          impact of pesticide use on different populations locally and across
          the state. Demographic data available to filter includes:
          <ul>
            <li>
              Percent Black or African American: ACS 2021 data non-hispanic
              black or african american population divided by total population
            </li>
            <li>
              Percent Hispanic or Latino: ACS 2021 data hispanic or latino
              population divided by total population
            </li>
            <li>Median household income: ACS 2021 data</li>
          </ul>
          Additional demographic data include:
          <ul>
            <li>
              Total population: ACS 2021 data, total population of the area
            </li>
            <li>
              {/* pct without high school degree */}
              Percent of population over 25 without a high school degree: ACS
              2021 data
            </li>
            <li>
              {/* pct over 16 working in agriculture */}
              Percent of population over 16 working in agriculture: ACS 2021
              data
            </li>
          </ul>
          Demographic data can be accessed through{" "}
          <a
            href="https://data.census.gov/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Census website
          </a>{" "}
          or tools like
          <a
            href="https://www.census.gov/programs-surveys/acs/data/data-via-api.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Census API
          </a>{" "}
          or{" "}
          <a
            href="https://www.socialexplorer.com/explore-maps"
            target="_blank"
            rel="noopener noreferrer"
          >
            Social Explorer
          </a>
          .
        </Typography>

        <Typography component={"h5"} fontWeight={"bold"}>
          Works Cited
        </Typography>
        <Typography component={"p"} className="bib">
          <ul>
            <li>
              California Department of Pesticide Regulation, 2022. AI Categories
              Table.
            </li>
            <li>
              CalPIP Home - California Pesticide Information Portal [WWW
              Document], 2024. URL{" "}
              <a href="https://calpip.cdpr.ca.gov/main.cfm">
                https://calpip.cdpr.ca.gov/main.cfm
              </a>{" "}
              (accessed 9.5.24).
            </li>
            <li>
              Pesticide Use Reporting [WWW Document], 2022, URL{" "}
              <a href="https://www.cdpr.ca.gov/docs/pur/purmain.htm">
                https://www.cdpr.ca.gov/docs/pur/purmain.htm
              </a>{" "}
              (accessed 9.5.24).
            </li>
            <li>
              Social Explorer - Tables - ACS 2021 (5-Year Estimates) [WWW
              Document], 2021. Social Explorer. URL{" "}
              <a href="https://www.socialexplorer.com/explore-maps">
                https://www.socialexplorer.com/explore-maps
              </a>{" "}
              (accessed 9.5.24).
            </li>
            <li>
              US Census Bureau, 2020. TIGER/Line Shapefiles [WWW Document].
              Census.gov. URL{" "}
              <a href="https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html">
                https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html
              </a>{" "}
              (accessed 9.5.24).
            </li>
          </ul>
        </Typography>
        <Typography component={"h4"} fontWeight="bold">
          Data Processing
        </Typography>
        <Typography component={"p"}>
          Data processing for this tool includes the following steps:
          <ol>
            <li>Data accessed from CalPip via web interface and downloaded</li>
            <li>
              Data converted from <InlineCode>txt</InlineCode> format to Apache
              Parquet with the following columns retained:
              <InlineCode>COMTRS</InlineCode>,{" "}
              <InlineCode>POUNDS_CHEMICAL_APPLIED</InlineCode>,{" "}
              <InlineCode>POUNDS_PRODUCT_APPLIED</InlineCode>,{" "}
              <InlineCode>AERIAL_GROUND_INDICATOR</InlineCode>,{" "}
              <InlineCode>AG_NONAG</InlineCode>,{" "}
              <InlineCode>AMOUNT_PLANTED</InlineCode>,{" "}
              <InlineCode>CHEMICAL_CODE</InlineCode>,{" "}
              <InlineCode>COUNTY_CODE</InlineCode>,{" "}
              <InlineCode>PRODUCT_CHEMICAL_PERCENT</InlineCode>,{" "}
              <InlineCode>PRODUCT_NUMBER</InlineCode>,{" "}
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
          county code and township range identifiers provided in CalPip data.
          <br />
          For census geographic units, additional processing is required to
          connect the PUR data census areas. The data are processed using areal
          interpolation, a method to estimate the proportion of a section that
          falls within each census geography. This method is widely used in
          spatial data analysis to estimate the proportion of an area that falls
          within a specific area of interest; it has been formalized at least 50
          years ago with numerous scholarly publications describing the approach{" "}
          <Reference id="areal-interpolation" />.
          <br />
          <br />A simplified explanation of areal interpolation is described in
          the below diagrams:
          <ArealExplainer />
          {/* section level PUR data was joined to the
          relevant geographic units. This process applied area interpolation to
          calculate the proportion of each section that falls within each
          geographic unit. The following geoprocessing steps were applied:
          <br />
          <ol>
            <li>
              Convert all geospatial data to NAD83 / California Albers
              projection (EPSG:3310)
            </li>
            <li>Calculate original area of each section (roughly 1 sq mi)</li>
            <li>Overlay section areas with census geographies</li>
            <li>
              Calculate the proportion of the section in each census geography
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
          </ol> */}
          <br />
          <i>Technical Notes</i>
          <ul>
            <li>
              Geoprocessing was done in CRS EPSG:3310, California Albers Equal
              Area / NAD83.{" "}
            </li>
            <li>
              As with any data processing, there is inherent uncertainty added.
              Below the section level, we do not have specific data on where
              pesticide application occurs. Additionally, there is a roughly
              ~0.02% data uncertainty added to census tracts and school
              districts from rounding and geometry errors.
            </li>
            <li>
              For Zip Code Tabulation Areas (ZCTAs), around 2% of data are
              missing due to lack of total coverage from ZCTA boundaries.{" "}
            </li>
            <li>
              County, township, and section data are directly mapped to PUR data
              and have effectively no data uncertainty added in our processing.
            </li>
            <li>
              Census demographic data are joined based on relevant geographic
              identifier (GEOID, FIPS, or ZCTA).
            </li>
          </ul>
          <br />
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
            <li>
              Application Method: <InlineCode>aerial_ground</InlineCode> (
              <InlineCode>AERIAL_GROUND_INDICATOR</InlineCode>) equals selected
            </li>
            <li>
              Agricultural use: <InlineCode>usetype</InlineCode> (
              <InlineCode>AG_NONAG</InlineCode>) equals selected
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
        <br />
      </Box>
    </WidgetContainer>
  );
};
