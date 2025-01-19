import type { Nullable } from "../core/types/util.type";

export const transformToArray = <T>(v?: Nullable<T> | Nullable<T[]>): T[] => {
  if (!v) {
    return [];
  }

  if (Array.isArray(v)) {
    return v;
  }

  return [].concat(v);
};
