import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import useMediaQuery from "@mui/material/useMediaQuery";
import Popper from "@mui/material/Popper";
import { useTheme, styled } from "@mui/material/styles";
import { VariableSizeList, ListChildComponentProps } from "react-window";
import Typography from "@mui/material/Typography";
import { FilterSpec, FilterState } from "../types/state";
import { useOptions } from "../hooks/useOptions";
import Box from "@mui/material/Box";
import { FilterValue } from "../config/filters";
import { theme } from "../main";
const LISTBOX_PADDING = 8; // px

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const isSelected = dataSet[1].current;
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
    background: isSelected ? theme.palette.secondary.main : "white",
  };

  const { key, ...optionProps } = dataSet[0];

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
      }}
    >
      <Typography
        key={key}
        component="li"
        {...optionProps}
        noWrap
        style={inlineStyle}
      >
        {dataSet[1].label}
        {isSelected && <span style={{ paddingLeft: "0.5rem" }}> &times;</span>}
      </Typography>
    </Box>
  );
}

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

// Adapter for react-window
const ListboxComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
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
  const itemSize = smUp ? 54 : 72;
  const lineLength = 24;
  const longLineLength = 36;
  const lineHeight = 36;

  const getChildSize = (child: React.ReactElement) => {
    if (child.hasOwnProperty("group")) {
      return 48;
    }
    const name = (child as unknown as any)?.[0]?.key || ''
    const _lines = Math.ceil(name.length / lineLength)
    const lines = _lines > 2 ? Math.ceil(name.length / longLineLength) : _lines
    return lines * lineHeight;
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
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </Box>
  );
});

const StyledPopper = styled(Popper)<{width?: number}>(({}) => ({
  '.MuiAutocomplete-listbox': {

    maxHeight: 'none', // Remove max height restriction
    overflow: 'auto', // Enable scrolling if content exceeds viewport height
    '& .MuiAutocomplete-option': {
      // fontSize: "0.75rem",
      lineHeight: 1,
      height: '100px',
      whiteSpace: 'normal', // Allow text to wrap
      wordBreak: 'break-all', // Allow text to wrap
      minHeight: '48px', // Set minimum height for individual options
      margin: '0.5rem 0',

      '&[data-focus="true"]': {
        color: theme.palette.primary.main,
      },
      '&:hover': {
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
  focused?:boolean;
}> = ({ spec, onChange, state, focused }) => {
  const _options = useOptions(spec);
  const value = (state?.value || []) as any[];
  const valueLabels = (state?.valueLabels || []) as any[];
  const [textValue, setTextValue] = React.useState("");

  const [open, setOpen] = React.useState(false);

  const handleClose = (_e: any, reason: any) => {
    if (reason !== "selectOption") {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    // on mount, set text value to the current value if it exists
    setTextValue(valueLabels.join(", "));
  },[]);

  // @ts-ignore
  const valueCol = spec.options.value;
  // @ts-ignore
  const labelCol = spec.options.label;
  const currentOptions = _options
    .filter((o) => value.includes(o.value))
    .map((f) => ({
      ...f,
      current: true,
    }))
    .sort((a, b) =>
      // a.label and b.label text compare
      a.label.localeCompare(b.label)
    );
  const availableOptions = _options
    .filter((o) => !value.includes(o.value))
    .map((f) => ({
      ...f,
      current: false,
    }));

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
      <Autocomplete
        id="virtualize-demo"
        fullWidth
        sx={{ 
          py: 1,
          animation: focused ? 'pulsate 1.5s infinite;' : 'none',
        }}
        defaultValue={value}
        disableListWrap
        onClose={handleClose}
        onFocus={() => {
          setOpen(true);
          setTextValue("");
        }}
        onBlur={() => {
          setTextValue(valueLabels.join(", "));
        }}
        open={open}
        inputValue={textValue}
        onOpen={() => {
          setOpen(true)
          setTimeout(() => {
            // debugger
          }, 1000);
        }}
        PopperComponent={StyledPopper}
        ListboxComponent={ListboxComponent}
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
        onSelect={(e) => {
          e.preventDefault();
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
