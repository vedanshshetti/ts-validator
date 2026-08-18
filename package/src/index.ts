import { defineSchema } from "./core/defineSchema";
import type { InferSchemaType, SchemaInterface as SchInt } from "./types";
export const tsv = { defineSchema };

export namespace Types {
  export type InferSchema<T extends SchemaInterface> = InferSchemaType<T>;
  export type SchemaInterface = SchInt;
}