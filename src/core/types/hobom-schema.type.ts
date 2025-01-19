import type { TypeConstant } from "../constants/type.constant";

export interface HoBomSchemaSpecType {
  nullable: boolean;
  optional: boolean;
  enforceable: boolean;
  strict: boolean;
  disableStackTrace?: boolean;
}

export interface HoBomSchemaOptions<SchemaType> {
  type: TypeConstant;
  spec: HoBomSchemaSpecType;
  typeCheck: (value: unknown) => value is NonNullable<SchemaType>;
}

export interface HoBomSchemaType<SchemaType, Context> {
  _outputType: SchemaType;
  _context: Context;
}

export interface HoBomSchemaResolveOptions<Context> {
  value?: unknown;
  context?: Context;
}
