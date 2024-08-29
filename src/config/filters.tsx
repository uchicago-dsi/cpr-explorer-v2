import { type FilterSpec } from "../types/state";

export type FilterValue = string | string[] | number | number[] | null;

type FilterSection = {
  title: string;
  defaultOpen: boolean;
  filters: FilterSpec[];
};

const dateSection: FilterSection = {
  title: "Date Range",
  defaultOpen: true,
  filters: [
    {
      queryParam: ["start", "end"],
      label: "Date Range",
      alwaysInclude: true,
      default: ["2022-01", "2022-12"],
      options: {
        type: "static",
        values: [
          {
            value: "2022-12",
            label: "max",
          },
          {
            value: "2017-01",
            label: "min",
          },
        ],
      },
      component: "month-range",
    },
  ],
};

export const ingredientSection: FilterSection = {
  title: "Data Filters",
  defaultOpen: false,
  filters: [
    {
      queryParam: "chemical",
      label: "Active Ingredient (AI)",
      options: {
        type: "dynamic",
        value: "chem_code",
        label: "chem_name",
        // @ts-ignore
        endpoint: `65675fb7b041550008c7b6ba`,
      },
      component: "autocomplete",
    },
    {
      queryParam: "ai_class",
      label: "AI Class",
      options: {
        type: "dynamic",
        value: "ai_class",
        label: "ai_class",
        endpoint: `6567637aaeb11300087fbd82`,
      },
      component: "autocomplete",
    },
    {
      queryParam: "ai_type",
      label: "AI Type",
      options: {
        type: "dynamic",
        value: "ai_type",
        label: "ai_type",
        // @ts-ignore
        endpoint: `6567630eaeb11300087fbd80`,
      },
      component: "autocomplete",
    },
    {
      queryParam: "ai_type_specific",
      label: "AI Type Specific",
      options: {
        type: "dynamic",
        value: "ai_type_specific",
        label: "ai_type_specific",
        // @ts-ignore
        endpoint: `656763b1aeb11300087fbd83`,
      },
      component: "autocomplete",
    },
    {
      queryParam: "product",
      label: "Product",
      options: {
        type: "dynamic",
        value: "product_code",
        label: "product_name",
        // @ts-ignore
        endpoint: `6542775ca570c6000898f983`,
      },
      component: "autocomplete",
    },
    {
      queryParam: "site",
      label: "Site",
      options: {
        type: "dynamic",
        value: "site_code",
        label: "site_name",
        endpoint: "65676456aeb11300087fbd85",
      },
      component: "autocomplete",
    },
    {
      queryParam: "aerial_ground",
      label: "Application Method",
      options: {
        type: "static",
        values: [
          {
            label: "All",
            value: "*",
          },
          {
            value: "A",
            label: "Aerial",
          },
          {
            value: "G",
            label: "Ground",
          },
          {
            value: "F",
            label: "Fumigation",
          },
          {
            value: "O",
            label: "Other",
          },
        ],
      },
      component: "dropdown",
    },
    {
      queryParam: "usetype",
      label: "Agricultural Use",
      options: {
        type: "static",
        values: [
          {
            value: "AG",
            label: "Agricultural",
          },
          {
            value: "NON-AG",
            label: "Non-Agricultural (County only)",
          },
          {
            value: "*",
            label: "Both",
          },
        ],
      },
      component: "dropdown",
    },
  ],
};

export const timeseriesViews = [
  {
    label: "AI Class",
    filterKeys: ["Date Range", "AI Class"],
    endpoint: "66a3dcb42bbe320009739fb9",
    dataCol: "lbs_chm_used",
    keyCol: "ai_class",
    dateCol: "monthyear",
    defaultFilterOptions: [
      {
        label: "AI Class",
        queryParam: "ai_class",
        value: ["Microbial", "Organic"],
        valueLabels: ["Microbial", "Organic"],
      },
    ],
  },
  {
    label: "AI Type",
    filterKeys: ["Date Range", "AI Type"],
    endpoint: "66bd0312a3735500086e76d2",
    dataCol: "lbs_chm_used",
    keyCol: "ai_type",
    dateCol: "monthyear",
    // defaultFilterOptions: [
    //   {
    //     label: "AI Type",
    //     value: ["Defoliant", "Fumigant", "Insecticide"],
    //     valueLabels: ["Defoliant", "Fumigant", "Insecticide"],
    //   },
    // ],
  },
  {
    label: "AI Type Specific",
    filterKeys: ["Date Range", "AI Type Specific"],
    endpoint: "66bd03bda3735500086e76d3",
    dataCol: "lbs_chm_used",
    keyCol: "ai_type_specific",
    dateCol: "monthyear",
    // defaultFilterOptions: [
    //   {
    //     label: "AI Type Specific",
    //     value: ["Defoliant", "Fumigant", "Insecticide"],
    //     valueLabels: ["Defoliant", "Fumigant", "Insecticide"],
    //   },
    // ],
  },
  {
    label: "Active Ingredient",
    filterKeys: ["Date Range", "Active Ingredient (AI)"],
    endpoint: "66bd07645c06060008989308",
    dataCol: "lbs_chm_used",
    keyCol: "chem_code",
    dateCol: "monthyear",
    // defaultFilterOptions: [
    //   {
    //     label: "Active Ingredient (AI)",
    //     value: [510, 2297, 1685],
    //     valueLabels: ["Pyrethrins", "Lambda-Cyhalothrin", "Acephate"],
    //   },
    // ],
  },
  {
    label: "Product",
    filterKeys: ["Date Range", "Product"],
    endpoint: "66bd07e85c06060008989309",
    dataCol: "lbs_prd_used",
    keyCol: "prodno",
    dateCol: "monthyear",
    // defaultFilterOptions: [
    //   {
    //     label: "Product",
    //     value: [47884, 12723],
    //     valueLabels: ["70% Neem Oil", "1-10 Pyrenone Insect Spray"],
    //   },
    // ],
  },
] as const;

export const timeseriesFiltersNotDateRange: any[] = timeseriesViews.map((config) => config.filterKeys)
  .flat().filter((key) => key !== "Date Range");

export const timeseriesLabelMapping = {
  "Product": {
    filter: "Product"
  },
  "Active Ingredient": {
    filter: "Active Ingredient (AI)"
  }
}


export const timeseriesFilterSpec: FilterSpec = {
  queryParam: "na",
  label: "Filter Type",
  component: "dropdown",
  options: {
    type: 'static',
    values: timeseriesViews.map((config) => ({
      value: config.label!,
      label: config.label!,
    }))
  }
}
// const geographyFilters: FilterSection = {
//   title: "Geography",
//   defaultOpen: false,
//   filters: [
//     {
//       queryParam: "county",
//       label: "County",
//       options: {
//         type: "dynamic",
//         value: "FIPS",
//         label: "Area Name",
//         // @ts-ignore
//         endpoint: `6567683eafda330008b8c256`,
//       },
//       component: "autocomplete",
//     },
//     {
//       queryParam: "townshiprange",
//       label: "Township Range",
//       options: {
//         type: "dynamic",
//         value: "TownshipRange",
//         label: "TownshipRange",
//         // @ts-ignore
//         endpoint: `6569009ee5a32a0008930614`,
//       },
//       component: "autocomplete",
//     },
//     {
//       queryParam: "schooldistrict",
//       label: "School District",
//       options: {
//         type: "dynamic",
//         value: "FIPS",
//         label: "Area Name",
//         // @ts-ignore
//         endpoint: `656789dcb678c50008c54a00`,
//       },
//       component: "autocomplete",
//     },
//     {
//       queryParam: "tract",
//       label: "Census Tract",
//       options: {
//         type: "dynamic",
//         value: "FIPS",
//         label: "FIPS",
//         // @ts-ignore
//         endpoint: `656763f6aeb11300087fbd84`,
//       },
//       component: "autocomplete",
//     },
//   ],
// };
const demographyFilters: FilterSection = {
  title: "Demographics",
  defaultOpen: false,
  filters: [
    {
      queryParam: "pctblack",
      label: "Percent Black or African American",
      subLabel: "(minimum percent of population)",
      options: {
        type: "static",
        values: [
          {
            value: 0,
            label: "0%",
          },
          {
            value: 1,
            label: "100%",
          },
        ],
      },
      component: "range",
    },
    {
      queryParam: "pcthispanic",
      label: "Percent Hispanic or Latino",
      subLabel: "(minimum percent of population)",
      options: {
        type: "static",
        values: [
          {
            value: 0,
            label: "0%",
          },
          {
            value: 1,
            label: "100%",
          },
        ],
      },
      component: "range",
    },
    {
      queryParam: "income",
      label: "Median Household Income",
      subLabel: "(maximum median 2021 household income)",
      options: {
        type: "static",
        values: [
          {
            value: "0",
            label: "0",
          },
          {
            value: "150000",
            label: "150000",
          },
        ],
      },
      component: "range",
    },
  ],
};


export const allFilterSections: FilterSection[] = [
  dateSection,
  ingredientSection,
  // geographyFilters,
  demographyFilters,
]