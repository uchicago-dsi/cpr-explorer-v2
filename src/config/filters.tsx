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
      default: ["2021-01", "2021-12"],
      options: {
        type: "static",
        values: [
          {
            value: "2021-12",
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

const ingredientSection: FilterSection = {
  title: "Data Filters",
  defaultOpen: false,
  filters: [
    {
      queryParam: "ai_class",
      label: "Active Ingredient Class",
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
      label: "Active Ingredient Type",
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
      label: "Active Ingredient Type Specific",
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
      queryParam: "chemical",
      label: "Active Ingredient",
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
        endpoint: "65676456aeb11300087fbd85"
      },
      component: "autocomplete",
    }
  ],
};
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
// const demographyFilters: FilterSection = {
//   title: "Demographics",
//   defaultOpen: false,
//   filters: [
//     {
//       queryParam: "pctblack",
//       label: "Percent Black or African American",
//       options: {
//         type: "static",
//         values: [
//           {
//             value: 0,
//             label: "0%",
//           },
//           {
//             value: 100,
//             label: "100%",
//           },
//         ],
//       },
//       component: "range",
//     },
//     {
//       queryParam: "pcthispanic",
//       label: "Percent Hispanic or Latino",
//       options: {
//         type: "static",
//         values: [
//           {
//             value: "0",
//             label: "0%",
//           },
//           {
//             value: "100",
//             label: "100%",
//           },
//         ],
//       },
//       component: "range",
//     },
//     {
//       queryParam: "income",
//       label: "Median Household Income",
//       options: {
//         type: "static",
//         values: [
//           {
//             value: "0",
//             label: "0",
//           },
//           {
//             value: "150000",
//             label: "150000",
//           },
//         ],
//       },
//       component: "range",
//     },
//   ],
// };


export const allFilterSections: FilterSection[] = [
  dateSection,
  ingredientSection,
  // geographyFilters,
  // demographyFilters,
]