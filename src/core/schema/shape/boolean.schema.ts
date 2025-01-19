import { HoBomSchema } from "../base/hobom.schema";
import { TypeConstant } from "../../constants/type.constant";

import type { Nullable } from "../../types/util.type";
import type { UnknownObject } from "../../types/object.type";

export class BooleanSchema<
  SchemaType extends Nullable<boolean>,
  Context = Nullable<UnknownObject>,
> extends HoBomSchema<SchemaType, Context> {
  constructor() {
    super({
      type: TypeConstant.BOOLEAN,
      spec: {
        nullable: false,
        optional: true,
        enforceable: false,
        strict: false,
      },
      typeCheck: (v: unknown): v is NonNullable<SchemaType> => {
        if (v instanceof Boolean) {
          v = v.valueOf();
        }

        return typeof v === "boolean";
      },
    });

    this.mutation(() => {
      this.transform((value, _raw, ctx) => {
        if (ctx.spec.enforceable && !ctx.isSchemaType(value)) {
          if (/^(true|1)$/i.test(String(value))) return true;
          if (/^(false|0)$/i.test(String(value))) return false;
        }

        return value;
      });
    });
  }
}
