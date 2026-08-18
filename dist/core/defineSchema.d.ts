import type { Primitive, Union, JSON as JsonV } from "@typescript-utils/helpertypes";
import type { SchemaInterface } from "../types";
import { type ValidatorReturnObject } from "./createValidator";
export declare function defineSchema(name: string, schema: SchemaInterface): {
    readonly $name: string;
    readonly $type: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
    readonly $schema: SchemaInterface;
    readonly validate: (value: JsonV | Array<Union<JsonV, Primitive>>) => ValidatorReturnObject;
};
//# sourceMappingURL=defineSchema.d.ts.map