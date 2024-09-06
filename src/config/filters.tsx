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

export const applicationFilters: FilterSection = {
  title: "Pesticide Application",
  defaultOpen: false,
  filters: [
    {
      queryParam: "usetype",
      label: "Agricultural Use",
      default: "AG",
      defaultLabel: "Agricultural",
      alwaysInclude: true,
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
            label: "Both Agricultural and Non-Agricultural",
          },
        ],
      },
      component: "dropdown",
    },
    {
      queryParam: "site",
      label: "Crop or Site",
      options: {
        type: "dynamic",
        value: "site_code",
        label: "site_name",
        endpoint: "66d8a22692868e000864e898",
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
  ],
};

export const pesticideInfoFilters: FilterSection = {
  title: "Chemical and Product Information",
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
        endpoint: `66d88452ae7ce10008a9473f`,
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
        endpoint: `66d8a20a92868e000864e897`,
      },
      component: "autocomplete",
    },
    {
      queryParam: "ai_class",
      label: "Chemical Class",
      options: {
        type: "dynamic",
        value: "ai_class_ID",
        label: "ai_class",
        endpoint: `66d88473ae7ce10008a94740`,
      },
      component: "autocomplete",
    },
    {
      queryParam: "ai_type",
      label: "Use Type",
      options: {
        type: "dynamic",
        value: "ai_type_ID",
        label: "ai_type",
        // @ts-ignore
        endpoint: `66d88483ae7ce10008a94741`,
      },
      component: "autocomplete",
    },
  ]
}

export const impactFilters: FilterSection = {
  title: "Risk and Impact",
  defaultOpen: false,
  filters: [
    {
      queryParam: "health",
      label: "Health/Environmental Impact",
      options: {
        type: "dynamic",
        endpoint: "66d8a25592868e000864e899",
        value: "id",
        label: "label",
      },
      component: "autocomplete",
    },
    {
      queryParam: "risk",
      label: "Risk Category",
      options: {
        type: "static",
        values: [
          {
            label: "All",
            value: "*",
          },
          {
            value: "HIGH",
            label: "High",
          },
          {
            value: "LOW",
            label: "Low",
          },
          {
            value: "OTHER",
            label: "Other",
          },
        ],
      },
      component: "dropdown",
    },
  ]
}

export const timeseriesViews = [
  {
    label: "Use Type",
    filterKeys: ["Date Range", "Agricultural Use", "Use Type", "County"],
    endpoint: "66bd0312a3735500086e76d2",
    dataCol: "lbs_chm_used",
    keyCol: "ai_type",
    dateCol: "monthyear",
    sortKeys: ["monthyear","ai_type"],
    labelMapping: "Use Type",
    defaultFilterOptions: [
      {
        label: "Use Type",
        queryParam: "ai_type",
        value: [4, 0, 5, 2],
        valueLabels: ["Adjuvant", "Fungicide", "Herbicide", "Inseticide"],
      },
    ],
  },

  {
    label: "Chemical Class",
    filterKeys: ["Date Range", "Agricultural Use", "Chemical Class", "County"],
    endpoint: "66a3dcb42bbe320009739fb9",
    dataCol: "lbs_chm_used",
    keyCol: "ai_class",
    dateCol: "monthyear",
    sortKeys: ["monthyear","ai_class"],
    labelMapping: "Chemical Class",
    defaultFilterOptions: [
      {
        label: "Chemical Class",
        queryParam: "ai_class",
        value: ["Microbial", "Organic"],
        valueLabels: ["Microbial", "Organic"],
      },
    ],
  },
  {
    label: "Active Ingredient",
    filterKeys: ["Date Range", "Agricultural Use", "Active Ingredient (AI)", "County"],
    endpoint: "66bd07645c06060008989308",
    dataCol: "lbs_chm_used",
    keyCol: "chem_code",
    dateCol: "monthyear",
    sortKeys: ["monthyear","chem_code"],
    labelMapping: "Active Ingredient (AI)",
  },
  {
    label: "Product",
    filterKeys: ["Date Range", "Agricultural Use", "Product", "County"],
    endpoint: "66bd07e85c06060008989309",
    dataCol: "lbs_prd_used",
    keyCol: "prodno",
    dateCol: "monthyear",
    sortKeys: ["monthyear","prodno"],
    labelMapping: "Product",
  },
  // TODO
  // {
  //   label: "Health Impact",
  //   filterKeys: ["Date Range", "Agricultural Use", "Health/Environmental Impact"],
  //   endpoint: "",
  //   dataCol: "lbs_prd_used",
  //   keyCol: "",
  //   dateCol: "monthyear",
  //   sortKeys: ["monthyear",""]
  // },
  // {
  //   label: "Risk",
  //   filterKeys: ["Date Range", "Agricultural Use", "Risk Category"],
  //   endpoint: "",
  //   dataCol: "lbs_prd_used",
  //   keyCol: "",
  //   dateCol: "monthyear",
  //   sortKeys: ["monthyear",""]
  // },
] as const;

const excludeKeys = ["Date Range", "Agricultural Use", "County"];

export const timeseriesFiltersNotDateRange: any[] = timeseriesViews.map((config) => config.filterKeys)
  .flat().filter((key) => !excludeKeys.includes(key));

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
export const geographyFilters: FilterSection = {
  title: "Geography",
  defaultOpen: false,
  filters: [
    {
      queryParam: "county",
      label: "County",
      options: {
        type: "dynamic",
        value: "CountyCode",
        label: "Name",
        // @ts-ignore
        endpoint: `66db44c7f96f070008c08e39`,
      },
      component: "autocomplete",
    },
  //   {
  //     queryParam: "townshiprange",
  //     label: "Township Range",
  //     options: {
  //       type: "dynamic",
  //       value: "TownshipRange",
  //       label: "TownshipRange",
  //       // @ts-ignore
  //       endpoint: `6569009ee5a32a0008930614`,
  //     },
  //     component: "autocomplete",
  //   },
  //   {
  //     queryParam: "schooldistrict",
  //     label: "School District",
  //     options: {
  //       type: "dynamic",
  //       value: "FIPS",
  //       label: "Area Name",
  //       // @ts-ignore
  //       endpoint: `656789dcb678c50008c54a00`,
  //     },
  //     component: "autocomplete",
  //   },
  //   {
  //     queryParam: "tract",
  //     label: "Census Tract",
  //     options: {
  //       type: "dynamic",
  //       value: "FIPS",
  //       label: "FIPS",
  //       // @ts-ignore
  //       endpoint: `656763f6aeb11300087fbd84`,
  //     },
  //     component: "autocomplete",
  //   },
  ],
};
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
  applicationFilters,
  pesticideInfoFilters,
  impactFilters,
  geographyFilters,
  demographyFilters,
]