import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import useMediaQuery from "@mui/material/useMediaQuery";
import Popper from "@mui/material/Popper";
import { useTheme, styled } from "@mui/material/styles";
import { VariableSizeList, ListChildComponentProps } from "react-window";
import Typography from "@mui/material/Typography";
import { FilterSpec, FilterState, OptionLabel } from "../types/state";
import { useOptions } from "../hooks/useOptions";
import Box from "@mui/material/Box";
import { FilterValue } from "../config/filters";
import { theme } from "../main";
import { create, useStore } from "zustand";
import { Button } from "@mui/material";
import { FixedSizeList as List } from 'react-window';

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
      height={"40px"}
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
  console.log("!!!props", props);
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
    const name = (child as unknown as any)?.[0]?.key || "";
    const _lines = Math.ceil(name.length / lineLength);
    const lines = _lines > 2 ? Math.ceil(name.length / longLineLength) : _lines;
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

const fallbackTime = 100;

export const _AutoComplete: React.FC<{
  spec: FilterSpec;
  onChange: (value: FilterValue, valueLabels: FilterValue) => void;
  state?: FilterState;
  focused?: boolean;
}> = ({ spec, onChange, state, focused }) => {
  const _options = useOptions(spec);
  const value = (state?.value || []) as any[];
  const valueLabels = (state?.valueLabels || []) as any[];
  const [textValue, setTextValue] = React.useState("");
  const keyboardfallbackRef = React.useRef<ReturnType<typeof setTimeout>>(null);

  const clearKeyboardFallback = () => {
    if (keyboardfallbackRef.current) {
      clearTimeout(keyboardfallbackRef.current);
    }
  };

  const keyDownListener = React.useRef<any>((e: KeyboardEvent) => {
    clearKeyboardFallback();
    // if e.key is alphanumeric
    if (e.key.length === 1) {
      // @ts-ignore
      keyboardfallbackRef.current = setTimeout(() => {
        if (e.metaKey || e.ctrlKey || e.altKey) {
          return;
        }
        console.log("!!!FALLBACK", textValue, e);
        // setTextValue(textValue => `${textValue}${e.key}`);
      }, fallbackTime);
    }
  });

  const keyDownListenerActive = React.useRef(false);

  const [open, setOpen] = React.useState(false);

  const handleClose = (_e: any, reason: any) => {
    if (reason !== "selectOption") {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    // on mount, set text value to the current value if it exists
    setTextValue(valueLabels.join(", "));
    // add listener for keydown while open
  }, []);

  React.useEffect(() => {
    if (!open) {
      window.removeEventListener("keydown", keyDownListener.current);
      keyDownListenerActive.current = false;
      setTextValue(valueLabels.join(", "));
    } else if (!keyDownListenerActive.current) {
      window.addEventListener("keydown", keyDownListener.current);
      keyDownListenerActive.current = true;
    }
  }, [valueLabels, open]);

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

  const allOptions = [...currentOptions, ...availableOptions].slice(0, 100);

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
        ListboxComponent={ListboxComponent}
        options={allOptions}
        onInputChange={(e, newInputValue) => {
          if (e?.type && e.type !== "click") {
            clearKeyboardFallback();
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
          return (
            <TextField
              {...params}
              label={spec.label}
              onChange={(e) => console.log("!!!TEXT", e)}
            />
          );
        }}
        renderOption={(props, option, state) =>
          [props, option, state.index] as React.ReactNode
        }
        renderGroup={(params) => params as any}
      />
    </>
  );
};

const getAutocompleteState = () =>
  create<{
    isOpen: boolean;
    filterValue: string;
    setfilterValue: (value: string) => void;
    toggleOpen: () => void;
    setOpen: (value: boolean) => void;
  }>((set) => ({
    isOpen: false,
    toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
    setOpen: (value) => set({ isOpen: value }),
    filterValue: "",
    setfilterValue: (value) => set({ filterValue: value }),
  }));

export const ListComponent: React.FC<{
  autocompleteState: ReturnType<typeof getAutocompleteState>;
  textFieldRef: React.RefObject<HTMLInputElement>;
  listBoxRef: React.RefObject<HTMLUListElement>;
  spec: FilterSpec;
  value?: FilterValue;
  handleChange: (newValue: any, newLabel: any) => void;
  handlePopperClick: (event: any) => void;
}> = ({
  autocompleteState,
  spec,
  value,
  handleChange,
  textFieldRef,
  handlePopperClick,
  listBoxRef,
}) => {
  const isOpen = autocompleteState((state) => state.isOpen);
  const filterValue = autocompleteState((state) => state.filterValue);
  const _options = useOptions(spec);

  const handleClick = (e: MouseEvent) => {
    console.log("!!!click", e);
    e.preventDefault();
    e.stopPropagation();
    // Re-focus the text field manually
    if (textFieldRef.current) {
      console.log("!!! textfield focus");
      textFieldRef.current.focus();
    }
  };

  React.useLayoutEffect(() => {
    console.log("!!! listbox instantiate", listBoxRef);
    // on click in listBoxRef set focus to textFieldRef
    if (isOpen) {
      document.addEventListener("click", handleClick);
    } else {
      document.removeEventListener("click", handleClick);
    }
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isOpen]);

  // @ts-ignore
  const valueCol = spec.options.value;
  // @ts-ignore
  const labelCol = spec.options.label;
  const allOptions = React.useMemo(() => {
    const currentOptions = !Array.isArray(value)
      ? []
      : value
          .map((o) => ({
            ...(_options.find((f) => f.value === o)! || {}),
            current: true,
          }))
          .sort((a, b) =>
            // a.label and b.label text compare
            a.label.localeCompare(b.label)
          );

    const lowerCaseFilterValue = filterValue.toLowerCase();

    const availableOptions =
      !Array.isArray(value) && !`${value}`?.length
        ? _options
        : _options
            .filter(
              (o) =>
                // @ts-ignore
                !value?.includes(o.value) &&
                o.label.toLowerCase().includes(lowerCaseFilterValue)
            )
            .map((f) => ({
              ...f,
              current: false,
            }));

    return [...currentOptions, ...availableOptions];
  }, [value, _options, filterValue]);

  const Row = ({ index, key }: any) => {
    const f = allOptions[index] as OptionLabel & { current: boolean };
    return (
      <Button
        key={key}
        variant="text"
        sx={{
          textTransform: "none",
          display: "block",
          textAlign: "left",
          width: "100%",
          p: 2,
          borderRadius: 0,
          background: f.current ? theme.palette.secondary.main : "white",
          color: f.current ? "white" : "black",
        }}
        onClick={(e) => {
          handleClick(e);
          handleChange(f.value, f.label);
        }}
      >
        {f.label}
        <span style={{ float: "right", marginRight: "1rem" }}>
          {f.current ? "✓" : ""}
        </span>
      </Button>
    );
  };

  return (
    <Box
      position="relative"
      width="100%"
      display={isOpen ? "block" : "none"}
      sx={{
        border: "1px solid gray",
        height: "40vh",
        overflowY: "auto",
        transform: "translateY(0.25rem)",
      }}
      boxShadow={4}
      ref={listBoxRef}
    >
      {!!isOpen && (
        
        
      <OuterElementContext.Provider>
      <VariableSizeList
        itemData={allOptions}
        height={ 2 * LISTBOX_PADDING}
        width="100%"
        outerElementType={OuterElementType}
        innerElementType="ul"
        itemSize={(index) => 40}
        overscanCount={5}
        itemCount={allOptions.length}
      >
      {Row}
      </VariableSizeList>
    </OuterElementContext.Provider>
      )}
      {!!(isOpen && !allOptions.length) && (
        <Typography sx={{ p: 2 }}>No results found</Typography>
      )}
    </Box>
  );
};

export const AutoComplete: React.FC<{
  spec: FilterSpec;
  onChange: (value: FilterValue, valueLabels: FilterValue) => void;
  state?: FilterState;
  focused?: boolean;
}> = ({ spec, onChange, state, focused }) => {
  const isFocused = React.useRef(false);
  const textFieldRef = React.useRef<HTMLInputElement>(null);
  const listBoxRef = React.useRef<HTMLUListElement>(null);

  const autoCompleteState = React.useRef(getAutocompleteState());
  const setOpen = autoCompleteState.current((state) => state.setOpen);
  const setTextValue = autoCompleteState.current(
    (state) => state.setfilterValue
  );

  const textValue = autoCompleteState.current((state) => state.filterValue);
  const value = (state?.value || []) as any[];
  const valueLabels = (state?.valueLabels || []) as any[];

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

  const handlePopperClick = (event: any) => {
    // Prevent the popper's click from causing the text field to lose focus
    event.stopPropagation();
    // Re-focus the text field manually
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  };

  const handleBlur = (event: any) => {
    // check if event is within the listbox
    // if not, close the listbox
    const clickInListbox = listBoxRef.current?.contains(event.relatedTarget);
    if (clickInListbox) {
      event.preventDefault();
      event.stopPropagation();
      if (textFieldRef.current) {
        const inputElement = textFieldRef.current?.querySelector("input");
        inputElement?.focus();
      }
    } else {
      console.log("!!!blurred out", valueLabels.join(", "));
      isFocused.current = false;
      setTextValue(valueLabels.join(", "));
      setOpen(false);
    }
  };

  const handleFocus = () => {
    if (!isFocused.current) {
      setOpen(true);
      setTextValue("");
      isFocused.current = true;
    } else {
    }
  };

  return (
    <Box position="relative" sx={{ my: 2 }}>
      <TextField
        ref={textFieldRef}
        fullWidth
        label={spec.label}
        autoComplete="off"
        onFocus={handleFocus}
        value={textValue}
        onBlur={handleBlur}
        onChange={(e) => setTextValue(e.target.value)}
        sx={{
          position: "relative",
        }}
      />
      <ListComponent
        autocompleteState={autoCompleteState.current}
        spec={spec}
        value={state?.value}
        textFieldRef={textFieldRef}
        handleChange={handleChange}
        handlePopperClick={handlePopperClick}
        listBoxRef={listBoxRef}
      />
    </Box>
  );
};

