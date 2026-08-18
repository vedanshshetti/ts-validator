import type { Primitive, Union, JSON as JsonV } from "@typescript-utils/helpertypes";
import type { SchemaInterface, TypeofOptions } from "../types";
import { createValidator, type ValidatorReturnObject } from "./createValidator";


interface SchemaDefinerReturnValue {
    $name: string,
    $type: TypeofOptions,
    $schema: SchemaInterface,
    validate: (value: JsonV | Array<Union<JsonV, Primitive>>) => ValidatorReturnObject;
} 

/**
 * Creates a new schema
 * @param {string} name 
 * @param {SchemaInterface} schema 
 * @returns {SchemaDefinerReturnValue}
 */

export function defineSchema(name: string, schema: SchemaInterface): SchemaDefinerReturnValue {
    return {
        $name: name,
        $type: typeof schema,
        $schema: schema,
        validate: createValidator(name, typeof schema, schema)
    } as const;
}