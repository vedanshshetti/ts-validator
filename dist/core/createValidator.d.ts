import type { JSON as JsonV, Primitive, Union } from "@typescript-utils/helpertypes";
import type { SchemaInterface, TypeofOptions } from "../types";
export interface ValidatorReturnObject {
    valid: boolean;
    errMessage?: string | undefined;
}
export declare const createValidator: (name: string, schemaType: TypeofOptions, schema: SchemaInterface) => (value: JsonV | Array<Union<JsonV, Primitive>>) => ValidatorReturnObject;
//# sourceMappingURL=createValidator.d.ts.map