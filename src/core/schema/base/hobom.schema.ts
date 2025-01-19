import { ValidationError } from "../../errors/validation.error";

import type {
  HoBomSchemaOptions,
  HoBomSchemaResolveOptions,
  HoBomSchemaSpecType,
  HoBomSchemaType,
} from "../../types/hobom-schema.type";
import type { TypeConstant } from "../../constants/type.constant";
import type { TransformFunction } from "../../types/transform.type";
import type { UnknownSchema } from "../../types/schema.type";
import type {
  NextFunctionCallback,
  UnknownErrorFunctionCallback,
} from "../../types/util.type";
import type {
  InternalValidationOptionsType,
  ValidationOptionsType,
} from "../../types/validation.type";

export abstract class HoBomSchema<SchemaType, Context>
  implements HoBomSchemaType<SchemaType, Context>
{
  protected type: TypeConstant;
  protected spec: HoBomSchemaSpecType;

  private _transforms: TransformFunction<UnknownSchema>[];
  private _isMutated?: boolean;

  _outputType: SchemaType;
  _context: Context;

  protected constructor(options: HoBomSchemaOptions<SchemaType>) {
    this.type = options.type;
    this.spec = {
      ...this.getDefaultSpecs(),
      ...options.spec,
    };
    this._transforms = [];
    this.typeCheck = options.typeCheck;
  }

  // ==================== PUBLIC METHODS ==================== //
  public validate(
    value: unknown,
    validationOptions?: ValidationOptionsType<Context>,
  ) {
    const hobomSchema = this.resolveHoBomSchema();
    const disableStackTrace =
      validationOptions?.disableStackTrace ??
      hobomSchema.spec.disableStackTrace;

    return new Promise((resolve, reject) =>
      hobomSchema._validate(
        value,
        validationOptions,
        (error, parsed) => {
          if (ValidationError.isError(error)) error.value = parsed;
          reject(error);
        },
        (errors, validated) => {
          if (errors.length)
            reject(
              new ValidationError({
                errorOrErrors: errors!,
                value: validated,
                field: undefined,
                type: undefined,
                disableStackTrace: disableStackTrace,
              }),
            );
          else resolve(validated as this["_outputType"]);
        },
      ),
    );
  }

  public resolveHoBomSchema(
    resolveOptions?: HoBomSchemaResolveOptions<Context>,
  ): this {
    return this;
  }
  // ==================== PUBLIC METHODS ==================== //

  // ==================== PROTECTED METHODS ==================== //
  protected clone(
    spec?: Partial<HoBomSchemaSpecType>,
  ): HoBomSchema<SchemaType, Context> {
    if (this._isMutated) {
      if (spec) {
        Object.assign(this.spec, spec);

        return this;
      }
    }

    return this;
  }

  protected isSchemaType(v: unknown): v is SchemaType {
    if (!v) {
      if (v === null && this.spec.nullable) return true;
      return v === undefined && this.spec.optional;
    }

    return this.typeCheck(v);
  }

  protected typeCheck: (v: unknown) => v is NonNullable<SchemaType>;

  protected mutation<T>(fn: (schema: this) => T): T {
    const before: boolean = this._isMutated;
    this._isMutated = true;
    const result: T = fn(this);
    this._isMutated = before;

    return result;
  }

  protected transform(
    fn: TransformFunction<this>,
  ): HoBomSchema<SchemaType, Context> {
    const next = this.clone();
    this._transforms.push(fn as TransformFunction<UnknownSchema>);

    return next;
  }
  // ==================== PROTECTED METHODS ==================== //

  // ==================== PRIVATE METHODS ==================== //
  private getDefaultSpecs(): HoBomSchemaSpecType {
    return {
      nullable: false,
      optional: true,
      enforceable: true,
      strict: false,
    };
  }

  private _validate(
    value: unknown,
    options: InternalValidationOptionsType<Context> = {},
    unknownError: UnknownErrorFunctionCallback,
    nextFn: NextFunctionCallback,
  ): void {}

  private executeTests(): void {}
  // ==================== PRIVATE METHODS ==================== //
}
