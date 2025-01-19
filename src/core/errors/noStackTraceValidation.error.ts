import { ValidationError } from "./validation.error";
import { transformToArray } from "../../utils/array.util";

const CLASS_NAME = "VALIDATION_ERROR";

export class NoStackTraceValidationError extends Error {
  name: string;
  message: string;
  value: unknown;
  field?: string;
  type?: string;
  errors: string[];
  inner: ValidationError[];

  constructor({
    errorOrErrors,
    value,
    field,
    type,
  }: {
    errorOrErrors: string | ValidationError | ValidationError[];
    value: unknown;
    field?: string;
    type?: string;
  }) {
    super();

    this.name = CLASS_NAME;
    this.value = value;
    this.field = field;
    this.type = type;
    this.errors = [];
    this.inner = [];

    transformToArray(errorOrErrors).forEach((err) => {
      if (ValidationError.isError(err)) {
        this.errors.push(...err.errors);
        const innerErrors = err.inner.length ? err.inner : [err];
        this.inner.push(...innerErrors);
      } else {
        this.errors.push(err);
      }
    });

    this.message =
      this.errors.length > 1
        ? `${this.errors.length} errors occurred`
        : this.errors[0];
  }
}
