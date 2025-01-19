import type { ValidationError } from "../errors/validation.error";

export type Nullable<T> = T | null | undefined;
export type Defined<T> = T extends undefined ? never : T;
export type UnknownErrorFunctionCallback = (
  error: Error,
  value: unknown,
) => void;
export type NextFunctionCallback = (
  error: ValidationError[],
  value: unknown,
) => void;
