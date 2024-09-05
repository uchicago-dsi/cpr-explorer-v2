import { FilterState } from "../types/state";

export const getDateRangeStrings = (dateRange: string[]) => {
  // YYYY-MM
  const [start, end] = dateRange;
  let current = start;
  const dates = [];
  const maxIters = 1000;
  let i = 0;

  while (current <= end) {
    i++;

    if (i > maxIters) {
      break;
    }
    dates.push(current);
    const [year, month] = current.split("-").map((v) => parseInt(v));
    const nextMonth = (month % 12) + 1;
    const nextMonthString = nextMonth.toString().padStart(2, "0");
    let yearString = year.toString();
    if (nextMonth === 1) {
      yearString = (year + 1).toString();
    }
    current = `${yearString}-${nextMonthString}`;
  }
  return dates;
};

const findValueLabel = (value: string, filter: FilterState) => {
  if (typeof filter.value === 'string' && filter.value === value) {
    return filter.valueLabels || filter.value;
  }
  if (Array.isArray(filter.value) && Array.isArray(filter.valueLabels)) {
    const strValues = filter.value.map((v) => v.toString());
    // @ts-ignore
    const index = strValues.indexOf(value);
    if (index !== -1) {
      return filter.valueLabels[index];
    }
  }
  return value;
}

export const infillTimeseries = (
  data: Record<string, any>[],
  config: any,
  dateRange: string[],
  filters: FilterState[]
) => {
  const { keyCol, dataCol, dateCol, labelMapping } = config;
  const labelList = labelMapping ? filters.find((f) => f.label === labelMapping) : null;
  let labelDict: Record<string, string> = {}

  const uniqueKeys = data
    .map((record) => record[keyCol])
    .filter((value, index, self) => self.indexOf(value) === index);
  const dates = getDateRangeStrings(dateRange);

  let dateIndex = 0;
  let entriesInYear: string[] = [];

  const cleanedData = [];
  const columns = data?.length
    ? Object.keys(data[0])
    : [keyCol, dataCol, dateCol];

  for (let i = 0; i < data.length; i++) {
    let record = data[i];
    const key = record[keyCol];
    const date = record[dateCol];
    const rowDateIndex = dates.indexOf(date);

    if (labelList) {
      const labelValue = labelDict[key] || findValueLabel(key, labelList);
      // @ts-ignore
      labelDict[key] = labelValue;
      record = { ...record, [keyCol]: labelValue };
    }



    if (rowDateIndex !== dateIndex) {
      const missingDates = dates.slice(dateIndex, rowDateIndex);
      for (const missingDate of missingDates) {
        const missingEntries = uniqueKeys.filter(
          (key) => !entriesInYear.includes(key)
        );
        entriesInYear = [];
        for (const missingEntry of missingEntries) {
          const newRecord: any = {};
          columns.forEach((col) => {
            if (col === keyCol) {
              newRecord[col] = missingEntry;
            } else if (col === dataCol) {
              newRecord[col] = 0;
            } else if (col === dateCol) {
              newRecord[col] = missingDate
            } else {
              newRecord[col] = null;
            }
          });
          cleanedData.push(newRecord);
        }
      }
    }

    dateIndex = rowDateIndex;
    entriesInYear.push(key);
    cleanedData.push(record);
  }

  return cleanedData;
};