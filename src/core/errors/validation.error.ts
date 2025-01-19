import { NoStackTraceValidationError } from "./noStackTraceValidation.error";

export class ValidationError extends Error {
  name: string;
  message: string;
  value: unknown;
  field?: string;
  type?: string;
  errors: string[] = [];
  inner: ValidationError[] = [];

  constructor({
    errorOrErrors,
    value,
    field,
    type,
    disableStackTrace,
  }: {
    errorOrErrors: string | ValidationError | ValidationError[];
    value: unknown;
    field?: string;
    type?: string;
    disableStackTrace?: boolean;
  }) {
    super();

    const noStackTraceValidationError = new NoStackTraceValidationError({
      errorOrErrors,
      type,
      field,
      value,
    });

    if (disableStackTrace) {
      return noStackTraceValidationError;
    }

    this.name = noStackTraceValidationError.name;
    this.message = noStackTraceValidationError.message;
    this.type = noStackTraceValidationError.type;
    this.value = noStackTraceValidationError.value;
    this.field = noStackTraceValidationError.field;
    this.errors = noStackTraceValidationError.errors;
    this.inner = noStackTraceValidationError.inner;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }

  public static isError(err: unknown): err is ValidationError {
    return err && (err as Error).name === "ValidationError";
  }
}
