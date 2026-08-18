import type { JSON as JsonV, Primitive, Union } from "@typescript-utils/helpertypes";
import type { RawPrimitives, SchemaInterface, TypeofOptions } from "../types";

export interface ValidatorReturnObject  {
    valid: boolean;
    errMessage?: string | undefined;
}


export const createValidator = (name: string,
    schemaType: TypeofOptions,
    schema: SchemaInterface)=> function validate(value: JsonV | Array<Union<JsonV, Primitive>>): ValidatorReturnObject {
    let error: ValidatorReturnObject;
    switch (schemaType) {
      case "string":  error = {
          valid: typeof value === "string",
          errMessage: typeof value === "string" ? undefined : `Schema does not match the passed value (schema:string vs value:${typeof value})`
      }; break;
      case "number": error = {
        valid: typeof value === "number",
        errMessage: typeof value === "number" ? undefined : `Schema does not match the passed value (schema:number vs value:${typeof value})`
      }; break;
      case "boolean": error = {
        valid: typeof value === "boolean",
        errMessage: typeof value === "boolean" ? undefined : `Schema does not match the passed value (schema:boolean vs value:${typeof value})`
      }; break;
      case "symbol": error = {
        valid: typeof value === "symbol",
        errMessage: typeof value === "symbol" ? undefined : `Schema does not match the passed value (schema:symbol vs value:${typeof value})`
      }; break;
      case "bigint": error = {
        valid: typeof value === "bigint",
        errMessage: typeof value === "bigint" ? undefined : `Schema does not match the passed value (schema:bigint vs value:${typeof value})`
      };
      break;
      case "undefined": error = {
        valid: typeof value === "undefined",
        errMessage: typeof value === "undefined" ? undefined : `Schema does not match the passed value (schema:undefined vs value:${typeof value})`
      };
      break;

      case "array":
        const temp = Array.isArray(value) ? value.every(v => validate(v).valid) : false;
        error = {
            valid: temp,
            errMessage: temp ? undefined : `Schema does not match the passed value (schema:array vs value:${typeof value})`
        };
        break;

      case "function":
        error = {
          valid: typeof value === "function",
          errMessage: typeof value === "function"
            ? undefined
            : `Schema does not match the passed value (schema:function vs value:${typeof value})`
        };
        break;

      case "object":
         if (typeof value !== "object" || value === null || Array.isArray(value)) {
           error = {
             valid: false,
             errMessage: `Schema does not match the passed value (schema:object vs value:${typeof value})`
           };
           break;
         }
               // schema is literally the object describing the structure
         const objSchema = schema as { [key: string]: RawPrimitives | SchemaInterface };
        let allValid = true;
         let firstError: string | undefined = undefined;
        for (const key in objSchema) {
           const childSchema = objSchema[key];
                   // Determine child type dynamically
        const childType =
            typeof childSchema === "string"
              ? childSchema
              : Array.isArray(childSchema)
              ? "array"
              : "object";
        const childValidator = createValidator(
          `${name}.${key}`,
          childType as any,
          childSchema as any
        );
                   const result = childValidator((value as any)[key]);
                   if (!result.valid) {
             allValid = false;
             firstError = result.errMessage;
             break;
           }
         }
               error = {
           valid: allValid,
           errMessage: allValid ? undefined : firstError
         };
         break;


      default: error = {valid: false, errMessage: `Schema Validation failed`};
    }   

    return {
        valid: error.valid,
        errMessage: error.valid ? undefined : `[@typescript-utils/ts-validator]: ERROR, ${error.errMessage} on schema "${name}" failed.`
    };
}
