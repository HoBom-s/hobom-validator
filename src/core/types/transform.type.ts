import type { UnknownSchema } from "./schema.type";

export type TransformFunction<T extends UnknownSchema> = (
  this: T,
  value: unknown,
  originalValue: unknown,
  schema: T,
) => unknown;
