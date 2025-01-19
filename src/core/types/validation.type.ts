export interface ValidationOptionsType<Context = NonNullable<unknown>> {
  /**
   * @default false
   */
  strict?: boolean;

  /**
   * @default false
   */
  disableStackTrace?: boolean;

  context?: Context;
}

export interface InternalValidationOptionsType<TContext = unknown>
  extends ValidationOptionsType<TContext> {
  _validating?: boolean;
  originalValue?: unknown;
  field?: string;
  sync?: boolean;
}
