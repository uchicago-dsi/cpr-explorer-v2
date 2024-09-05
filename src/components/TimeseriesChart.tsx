import React, { useCallback, useMemo } from "react";
import { Line, LinePath } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { scaleTime, scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { Group } from "@visx/group";
import { LegendOrdinal } from "@visx/legend";
import { timeParse } from "d3-time-format";
import { interpolateSpectral, schemeTableau10 } from "d3-scale-chromatic";
import { scaleOrdinal } from "d3-scale";
import { Tooltip, withTooltip } from "@visx/tooltip";
import { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip";
import localPoint from "@visx/event/lib/localPointGeneric";
import { Typography } from "@mui/material";
import * as d3 from "d3";
import { Grid } from "@visx/grid";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

let tooltipTimeout: number;

const compactFormatter = d3.format(".2s");

type LineChartProps = {
  data: Record<string, any>[];
  minDate: string;
  maxDate: string;
  keyCol: string;
  dataCol: string;
  dateCol: string;
  width: number;
  height: number;
  labelMapping?: Record<string, string>;
};

const parseDate = timeParse("%Y-%m");

const axisLabels = {
  lbs_chm_used: "Pounds of Chemical Used",
  lbs_prd_used: "Pounds of Product Used",
};

export default withTooltip<LineChartProps>(
  ({
    hideTooltip,
    showTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft,
    tooltipTop,
    data,
    minDate,
    maxDate,
    keyCol,
    dataCol,
    dateCol,
    width,
    height,
    labelMapping,
  }: LineChartProps & WithTooltipProvidedProps<any>) => {
    const [currentDataCol, setCurrentDataCol] = React.useState(dataCol);
    const yAxisLabel = axisLabels[currentDataCol as keyof typeof axisLabels];
    const svgRef = React.useRef<SVGSVGElement>(null);
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    const { cleanedData, max, keys } = useMemo(() => {
      const cleanedData: Record<string, Array<Record<string, any>>> = {};
      let max = 0;
      for (const d of data) {
        if (!cleanedData[d[keyCol]]) {
          cleanedData[d[keyCol]] = [];
        }
        cleanedData[d[keyCol]].push(d);
        max = Math.max(max, d[currentDataCol] as number);
      }
      const keys = Object.keys(cleanedData).sort((a, b) =>
        `${a}`.localeCompare(`${b}`)
      );
      return { cleanedData, max, keys };
    }, [data, minDate, maxDate, keyCol, currentDataCol]);
    // Scale
    const xScale = scaleTime({
      range: [0, xMax],
      domain: [parseDate(minDate) as Date, parseDate(maxDate) as Date],
    });

    const yScale = scaleLinear<number>({
      range: [yMax, 0],
      domain: [0, max],
    });
    // Color scale
    const keyLength = keys?.length;
    const range =
      keyLength <= 10
        ? schemeTableau10
        : keys.map((_, i) => interpolateSpectral(i / keyLength));
    const colorScale = scaleOrdinal().domain(keys).range(range);
    const labelScale = scaleOrdinal()
      .domain(keys.map((key) => labelMapping?.[key] || key.replace(/_/g, " ")))
      .range(range);
    // event handlers
    const handleMouseMove = useCallback(
      (event: React.MouseEvent | React.TouchEvent) => {
        if (tooltipTimeout) clearTimeout(tooltipTimeout);
        if (!svgRef.current) return;

        // find the nearest polygon to the current mouse position
        const point = localPoint(svgRef.current, event);
        if (!point) return;
        const x = point.x;
        if (x < 0 || x > xMax) {
          return;
        }
        const nearest = xScale.invert(x);
        const month = nearest.getMonth() + 1;
        const year = nearest.getFullYear();
        const monthyear = `${year}-${month.toString().padStart(2, "0")}`;
        const monthData = data
          .filter((d) => d[dateCol] === monthyear)
          .sort((a, b) => `${a[keyCol]}`.localeCompare(`${b[keyCol]}`))
          .reduce((acc, d) => {
            acc[d[keyCol]] = d[currentDataCol];
            return acc;
          }, {} as Record<string, number>);
        const isOnRightHalf = point.x > width / 2;

        showTooltip({
          tooltipLeft: point.x,
          tooltipTop: point.y,
          tooltipData: {
            isOnRightHalf,
            monthData,
            monthyear,
            date: new Date(monthyear),
          },
        });
      },
      [xScale, yScale, showTooltip]
    );

    const handleMouseLeave = useCallback(() => {
      tooltipTimeout = window.setTimeout(() => {
        hideTooltip();
      }, 300);
    }, [hideTooltip]);

    return (
      <>
        <svg width={width} height={height} ref={svgRef}>
          <rect
            width={width}
            height={height}
            rx={14}
            fill="rgba(0,0,0,0)"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseLeave}
          />
          <Group left={margin.left} top={margin.top} pointerEvents={"none"}>
            <Grid xScale={xScale} yScale={yScale} width={xMax} height={yMax} />
            <AxisBottom
              scale={xScale}
              top={yMax}
              label="Date"
              tickFormat={(value) =>
                (value as Date).toISOString().substring(0, 7)
              }
            />
            <AxisLeft
              scale={yScale}
              label={yAxisLabel}
              tickFormat={compactFormatter}
            />
            {keys.map((key) => (
              <LinePath
                key={key}
                data={cleanedData[key]}
                x={(d) => xScale(parseDate(d[dateCol]) as Date) ?? 0}
                y={(d) => yScale(parseFloat(d[currentDataCol])) ?? 0}
                // @ts-ignore
                stroke={colorScale(key)}
                strokeWidth={2}
                curve={curveMonotoneX}
              />
            ))}
            {tooltipData?.date && tooltipOpen && (
              <Line
                x1={xScale(tooltipData.date)}
                x2={xScale(tooltipData.date)}
                y1={0}
                y2={yMax}
                stroke={"rgba(0,0,0,0.5)"}
                pointerEvents={"none"}
                strokeWidth={1}
              />
            )}
          </Group>
        </svg>
        <LegendOrdinal
          scale={labelScale}
          direction="column"
          itemMargin={0}
          labelMargin={0}
          shapeHeight={8}
          shapeMargin={"0 .25rem 0 0"}
          style={{
            position: "absolute",
            padding: "0.25rem",
            left: margin.left + 24,
            bottom: margin.bottom + 24,
            background: "rgba(255,255,255,0.75)",
            fontFamily: "'Rubik', Arial, sans-serif",
            fontSize: "0.75rem",
            borderRadius: "0.25rem",
            boxShadow: "0 0 1px rgba(0,0,0,0.5)",
          }}
        />

        {tooltipOpen &&
          tooltipData &&
          tooltipLeft != null &&
          tooltipTop != null && (
            <Tooltip
              style={{
                background: "rgba(255,255,255,0.9)",
                color: "black",
                border: "1px solid black",
                borderRadius: "0.25rem",
                padding: "0.5rem",
                width: "fit-content !important",
                maxWidth: "300px !important",
                minWidth: "200px !important",
                left: !tooltipData.isOnRightHalf
                  ? tooltipLeft + 10
                  : tooltipLeft - 10,
                top: tooltipTop + 10,
                position: "absolute",
                transform: tooltipData.isOnRightHalf
                  ? "translateX(-100%)"
                  : "translateX(0)",
              }}
            >
              <Typography component="p" padding={0} fontSize={"md"}>
                <b>{yAxisLabel}</b>
                <br />
                <i>{tooltipData.monthyear}</i>
              </Typography>
              <hr />
              <Typography variant="body1" fontSize={"xs"}>
                {Object.entries(tooltipData.monthData).map(
                  ([key, value], i) => (
                    <Typography component={"p"} fontSize={"xs"} key={i}>
                      <strong>
                        {labelMapping?.[key] || key.replace(/_/g, " ")}:
                      </strong>{" "}
                      {value && !isNaN(value as number)
                        ? value.toLocaleString()
                        : `${value}`}
                    </Typography>
                  )
                )}
              </Typography>
            </Tooltip>
          )}

        <Box 
          position={"absolute"}
          top={0}
          left={margin.left + 5}
          sx={{
            background: 'white',
            p: 1
          }}

          component={"div"}
          >
          <FormControl size="small" sx={{ padding: 0, m: "0.5rem 0" }}>
            <InputLabel
              id="demo-select-small-label"
              sx={{ background: "white", px: 1 }}
            >
              Timeseries Y Axis
            </InputLabel>
            <Select
              labelId="timeseries-select-small-label"
              id="timeseries-select-small"
              value={currentDataCol}
              sx={{
                fontSize: "0.75rem",
                padding: "0",
                borderRadius: "0.25rem",
                width: "100%",
              }}
              label=""
              onChange={(e) => setCurrentDataCol(e.target.value)}
            >
              {Object.keys(axisLabels).map((option, index) => (
                <MenuItem key={index} value={option}>
                  {axisLabels[option as keyof typeof axisLabels]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </>
    );
  }
);
