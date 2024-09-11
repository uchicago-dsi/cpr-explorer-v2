import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import useMediaQuery from "@mui/material/useMediaQuery";
import Popper from "@mui/material/Popper";
import { useTheme, styled } from "@mui/material/styles";
import { VariableSizeList, ListChildComponentProps } from "react-window";
import Typography from "@mui/material/Typography";
import { FilterSpec, FilterState, OptionFilterSpec } from "../types/state";
import { useOptions } from "../hooks/useOptions";
import Box from "@mui/material/Box";
import { FilterValue } from "../config/filters";
import { theme } from "../main";
import { Slider } from "@mui/material";
const LISTBOX_PADDING = 8; // px

const getRenderRow = (spec: FilterSpec) => {
  return function renderRow(props: ListChildComponentProps) {
    const { data, index, style } = props;
    const dataSet = data[index];
    const isSelected = dataSet[1].current;
    const inlineStyle = {
      ...style,
      top: (style.top as number) + LISTBOX_PADDING,
      background: isSelected ? theme.palette.secondary.main : "white",
      display: "flex",
      flexDirection: "column",
      // align left
      justifyContent: "flex-start",
      alignItems: "flex-start",
      textAlign: "left",
    };

    const { key, ...optionProps } = dataSet[0];

    return (
      <Box component="div">
        <Typography
          key={key}
          component="li"
          {...optionProps}
          // noWrap
          style={inlineStyle}
        >
          <Typography sx={{pb:0,mb:0}}>
            {dataSet[1].label}
          </Typography>
          <br />
          {spec.subcolumn && dataSet[1][spec.subcolumn] && (
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                p:0,
                m:0,
                transform: "translateY(-1rem)"
              }}
            >
              {Math.round(dataSet[1][spec.subcolumn])?.toLocaleString()} lbs
            </Typography>
          )}
          {isSelected && (
            <span style={{ paddingLeft: "0.5rem" }}> &times;</span>
          )}
        </Typography>
      </Box>
    );
  };
};

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <Box component="div" ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data: any) {
  const ref = React.useRef<VariableSizeList>(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

const handleFilter = (row: any, filter: OptionFilterSpec) => {
  switch (filter.type) {
    case ">":
      return row[filter.column] > filter.value;
    case "<":
      return row[filter.column] < filter.value;
    case "=":
      return row[filter.column] === filter.value;
    case "in":
      return filter.value.includes(row[filter.column]);
    case "not in":
      return !filter.value.includes(row[filter.column]);
    default:
      return false;
  }
};

const filterOptions = (
  options: any[],
  filters: OptionFilterSpec[],
  current: boolean
) => {
  let selectedOptions = [];
  for (let i = 0; i < options.length; i++) {
    const isSelected = filters.every((f) => handleFilter(options[i], f));
    if (isSelected) {
      selectedOptions.push({
        ...options[i],
        current,
      });
    }
  }
  return selectedOptions;
};

const getListbox = (spec: FilterSpec) => {
  // Adapter for react-window
  return React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
    function ListboxComponent(props, ref) {
      const { children, ...other } = props;
      const itemData: React.ReactElement[] = [];
      (children as React.ReactElement[]).forEach(
        (item: React.ReactElement & { children?: React.ReactElement[] }) => {
          itemData.push(item);
          itemData.push(...(item.children || []));
        }
      );

      const theme = useTheme();
      const smUp = useMediaQuery(theme.breakpoints.up("sm"), {
        noSsr: true,
      });
      const itemCount = itemData.length;
      let itemSize = smUp ? 54 : 72;
      spec.subcolumn && (itemSize += 24);
      const lineLength = 30;
      const lineHeight = 36;

      const getChildSize = (child: React.ReactElement) => {
        if (child.hasOwnProperty("group")) {
          return 48;
        }
        const name = (child as unknown as any)?.[0]?.key || "";
        const lines = Math.ceil(name.length / lineLength);
        return lines * lineHeight + (spec.subcolumn ? 24 : 0);
      };

      const getHeight = () => {
        if (itemCount > 8) {
          return 8 * itemSize;
        }
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
      };

      const gridRef = useResetCache(itemCount);

      return (
        <Box ref={ref} component="div">
          <OuterElementContext.Provider value={other}>
            <VariableSizeList
              itemData={itemData}
              height={getHeight() + 2 * LISTBOX_PADDING}
              width="100%"
              ref={gridRef}
              outerElementType={OuterElementType}
              innerElementType="ul"
              itemSize={(index) => getChildSize(itemData[index])}
              overscanCount={5}
              itemCount={itemCount}
            >
              {getRenderRow(spec)}
            </VariableSizeList>
          </OuterElementContext.Provider>
        </Box>
      );
    }
  );
};

const StyledPopper = styled(Popper)<{ width?: number }>(({}) => ({
  ".MuiAutocomplete-listbox": {
    maxHeight: "none", // Remove max height restriction
    overflow: "auto", // Enable scrolling if content exceeds viewport height
    "& .MuiAutocomplete-option": {
      // fontSize: "0.75rem",
      lineHeight: 1,
      height: "100px",
      whiteSpace: "normal", // Allow text to wrap
      wordBreak: "break-all", // Allow text to wrap
      minHeight: "48px", // Set minimum height for individual options
      margin: "0.5rem 0",

      '&[data-focus="true"]': {
        color: theme.palette.primary.main,
      },
      "&:hover": {
        color: theme.palette.primary.main,
      },
    },
  },
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
}));

export const AutoComplete: React.FC<{
  spec: FilterSpec;
  onChange: (value: FilterValue, valueLabels: FilterValue) => void;
  state?: FilterState;
  focused?: boolean;
}> = ({ spec, onChange, state, focused }) => {
  const _options = useOptions(spec);
  const value = (state?.value || []) as any[];
  const valueLabels = (state?.valueLabels || []) as any[];
  const [textValue, setTextValue] = React.useState("");
  const [optionFilterValue, setOptionFilterValue] = React.useState<any>(null);

  const [open, setOpen] = React.useState(false);

  const handleClose = (_e: any, reason: any) => {
    if (reason !== "selectOption") {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    // on mount, set text value to the current value if it exists
    setTextValue(valueLabels.join(", "));
  }, []);

  React.useEffect(() => {
    if (!open) {
      setTextValue(valueLabels.join(", "));
    }
  }, [valueLabels, open]);

  // @ts-ignore
  const valueCol = spec.options.value;
  // @ts-ignore
  const labelCol = spec.options.label;
  const currentValueFilter: OptionFilterSpec = {
    column: "value",
    type: "in",
    value: value,
  };
  const currentOptions = filterOptions(_options, [currentValueFilter], true);

  const availableOptionsFilters: OptionFilterSpec[] = [
    {
      ...currentValueFilter,
      type: "not in",
    },
  ];
  if (spec.optionFilter && optionFilterValue !== null) {
    availableOptionsFilters.push({
      column: spec.optionFilter.column,
      type: spec.optionFilter.type,
      value: optionFilterValue,
    });
  }

  const availableOptions = filterOptions(
    _options,
    availableOptionsFilters,
    false
  );

  const allOptions = [...currentOptions, ...availableOptions];

  if (!allOptions.length) {
    return null;
  }
  const handleChange = (newValue: any, newLabel: any) => {
    if (typeof newValue !== "number" && !newValue.trim().length) {
      return;
    }

    if (value.includes(newValue)) {
      const index = value.indexOf(newValue);
      const newValueList = value
        .slice(0, index)
        .concat(value.slice(index + 1)) as any;
      const newLabelList = valueLabels
        .slice(0, index)
        .concat(valueLabels.slice(index + 1)) as any;
      onChange(newValueList, newLabelList);
    } else {
      onChange(
        [...(value || []), newValue],
        [...(valueLabels || []), newLabel]
      );
    }
  };

  return (
    <>
      {/* {value?.length > 0 && <Box component="div"
  sx={{
    maxWidth: "100%",
    overflowX: 'auto'
  }}
  > */}
      {/* <Box component="div" sx={{
      maxWidth: 'none',
      width: 'fit-content',
    }}> */}
      {/* {currentOptions.map((v) => {
      return <Button variant="text"
        sx={{
          textTransform: "none",
          display: 'inline',
          mr: 0.25,
          mb: 0.25,
          padding: '0.125rem'
        }}
        size="small"
        color="error"
      startIcon={<CloseIcon
        sx={{
          p:0,
          m:0,
          transform: "translateY(.25rem)",
          marginRight:0
        }}
      />} onClick={() => handleChange(v.value)}>
      {v.label}        
</Button>
    })}</Box></Box>} */}
      {!!spec.optionFilter && (
        <OptionFilter
          spec={spec.optionFilter}
          value={optionFilterValue}
          setValue={setOptionFilterValue}
        />
      )}
      <Autocomplete
        id="virtualize-demo"
        disableClearable={true}
        fullWidth
        sx={{
          py: 1,
          animation: focused ? "pulsate 1.5s infinite;" : "none",
        }}
        defaultValue={value}
        disableListWrap
        onClose={handleClose}
        onFocus={() => {
          setOpen(true);
          setTextValue("");
        }}
        onBlur={() => {
          setOpen(false);
        }}
        open={open}
        inputValue={textValue}
        onOpen={() => {
          setOpen(true);
        }}
        PopperComponent={StyledPopper}
        ListboxComponent={getListbox(spec)}
        options={allOptions}
        onInputChange={(e, newInputValue) => {
          if (e?.type && e.type !== "click") {
            setTextValue(newInputValue);
          }
        }}
        onChange={(e, newValue, reason) => {
          if (reason === "selectOption") {
            e.preventDefault(); // Prevent the dropdown from closing
            handleChange(
              (newValue?.value as string) ?? "",
              (newValue?.label as string) ?? ""
            );
          }
        }}
        renderInput={(params) => {
          return <TextField {...params} label={spec.label} />;
        }}
        renderOption={(props, option, state) =>
          [props, option, state.index] as React.ReactNode
        }
        renderGroup={(params) => params as any}
      />
    </>
  );
};

export const OptionFilter: React.FC<{
  spec: FilterSpec["optionFilter"];
  value: any;
  setValue: (value: any) => void;
}> = ({ spec, value, setValue }) => {
  if (!spec) {
    return null;
  }

  switch (spec.interface) {
    case "slider":
      const [min, max] = spec.range || [0, 100];
      return (
        <Box sx={{ width: "100%", boxSizing: "border-box" }}>
          <Slider
            value={value}
            title={spec.title}
            onChange={(_e, newValue) => setValue(newValue)}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${v}`}
            min={min}
            max={max}
          />
        </Box>
      );
    default:
      return null;
  }
};
