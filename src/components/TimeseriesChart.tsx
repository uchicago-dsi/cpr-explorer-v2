import React, { useMemo } from "react";
import { LinePath } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { scaleTime, scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { Group } from "@visx/group";
import { LegendOrdinal } from "@visx/legend";
import { timeParse } from "d3-time-format";
import { schemeCategory10 } from "d3-scale-chromatic";
import { scaleOrdinal } from "d3-scale";
import { compactFormatter } from "./MapLegend";
// import { theme } from "../main";

type LineChartProps = {
  data: Record<string, any>[];
  minDate: string;
  maxDate: string;
  keyCol: string;
  dataCol: string;
  dateCol: string;
  width: number;
  height: number;
  yAxisLabel?: string;
};

const parseDate = timeParse("%Y-%m");

export const TimeseriesChart: React.FC<LineChartProps> = ({
  data,
  minDate,
  maxDate,
  keyCol,
  dataCol,
  dateCol,
  width,
  height,
  yAxisLabel = "Pounds of Chemical Used",
}) => {
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
      max = Math.max(max, d[dataCol] as number);
    }
    const keys = Object.keys(cleanedData);
    return { cleanedData, max, keys };
  }, [data, minDate, maxDate, keyCol, dataCol]);

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
  const colorScale = scaleOrdinal().domain(keys).range(schemeCategory10);

  return (
    <>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
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
              y={(d) => yScale(parseFloat(d[dataCol])) ?? 0}
              // @ts-ignore
              stroke={colorScale(key)}
              strokeWidth={2}
              curve={curveMonotoneX}
            />
          ))}
        </Group>
      </svg>
      <LegendOrdinal
        scale={colorScale}
        direction="column"
        itemMargin={0}
        labelMargin={0}
        shapeHeight={8}
        shapeMargin={"0 .25rem 0 0"}
        style={{  position: "absolute",
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
    </>
  );
};
