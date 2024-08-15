import { useEffect, useRef } from "react";
import { staticData, useStore } from "../state/store";
import { WidgetContainer } from "./WidgetContainer";
import { FilterControls } from "./FilterControls";
import { timeseriesViews } from "../config/filters";
import { useParentSize } from "@visx/responsive";
import TimeseriesChart from "./TimeseriesChart";
import { LoadingStateShade } from "./LoadingShade";
import { FilterListBox } from "./FilterListBox";

export const TimeseriesWidget = () => {
  const executeQuery = useStore((state) => state.executeQuery);
  const filterKeys = useStore((state) => state.filterKeys);
  const shouldQuery = useRef(false);
  const setTimeseriesType = useStore((state) => state.setTimeseriesType);
  const { width, height, parentRef } = useParentSize();
  const uiFilters = useStore((state) => state.uiFilters);
  const dateFilter = uiFilters.find((f) => f.label === "Date Range");
  const timeseriesType = useStore((state) => state.timeseriesType);
  const currentConfig = timeseriesViews.find(
    (view) => view.label === timeseriesType
  );
  const loadingState = useStore((state) => state.loadingState);

  useEffect(() => {
    shouldQuery.current = false;
    setTimeseriesType(timeseriesViews[0].label);
  }, []);

  useEffect(() => {
    if (shouldQuery.current) {
      shouldQuery.current = false;
      executeQuery();
    }
  }, [filterKeys]);

  return (
    <WidgetContainer>
      <FilterControls />
      <div
      //  component="div" padding={2} position={"relative"}
      style={{
        position: "relative",
        padding: "1rem",
        height: "75vh",
        flex: 1
      }}
        ref={parentRef}
      >
        <LoadingStateShade loadingState={loadingState} />
        <TimeseriesChart
          data={staticData}
          width={width}
          height={height}
          // @ts-ignore
          minDate={dateFilter?.value[0] || "2022-01"}
          // @ts-ignore
          maxDate={dateFilter?.value[1] || "2022-12"}
          keyCol={currentConfig?.keyCol || "ai_class"}
          dateCol={currentConfig?.dateCol || "monthyear"}
          dataCol={currentConfig?.dataCol || "lbs_chm_used"}
        />
        <FilterListBox/>
      </div>
    </WidgetContainer>
  );
};
