export const cleanLabel = (label: any): string => {
  // replace _ with space
  // add space around /
  // remove -
  return `${label}`.replace(/_/g, ' ').replace(/\//g, ' / ').replace(/-/g, '');
}