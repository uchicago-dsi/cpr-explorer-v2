import React from "react";
import { FilterSpec, OptionLabel } from "../types/state";

export const useOptions = (spec: FilterSpec) => {
  const [options, setOptions] = React.useState<OptionLabel[]>(
    spec.options.type === "static" ? spec.options.values : []
  );

  React.useEffect(() => {
    if (
      spec.options.type === "dynamic" &&
      spec.options.value &&
      spec.options.label
    ) {
      fetch(`${import.meta.env.VITE_DATA_ENDPOINT}${spec.options.endpoint}`)
        .then((response) => response.json())
        .then((data) => {
          const options = data.map((item: any) => ({
            // @ts-ignore
            value: item[spec.options.value],
            // @ts-ignore
            label: item[spec.options.label],
          }));
          setOptions(options);
        });
    }
  }, []);

  return options;
};
