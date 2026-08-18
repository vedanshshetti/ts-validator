export type RawPrimitives = "string" | "number" | "boolean" | "bigint" | "symbol" | "undefined" | "null";
export type SchemaInterface = 
    | { readonly [key: string]: RawPrimitives | SchemaInterface }
    | SchemaInterface[]
    | RawPrimitives;

export type TypeofOptions = 
    | "string" 
    | "number" 
    | "boolean" 
    | "symbol" 
    | "bigint" 
    | "object" 
    | "array" 
    | "undefined" 
    | "function";

export type InferSchemaType<T extends SchemaInterface> = T;