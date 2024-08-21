import { devtools } from "zustand/middleware";

export type WrapperFn = <T extends any>(fn: T) => T;
export const wrapper: WrapperFn =
  process.env.NODE_ENV === "development"
    ? (devtools as WrapperFn)
    : (fn: any) => fn;
