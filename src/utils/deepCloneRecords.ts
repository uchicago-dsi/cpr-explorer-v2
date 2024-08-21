export const deepCloneRecords = (records: Array<Record<string, unknown>>) => {
  const cloned: any[] = [];
  records.forEach((record) => {
    const recordClone: Record<string, unknown> = {};
    for (const key in record) {
      recordClone[key] = record[key];
    }
    cloned.push(recordClone);
  });
  return cloned;
};
