import type { JSON as JsonV, Primitive, Union } from "@typescript-utils/helpertypes";
import type { RawPrimitives, SchemaInterface, TypeofOptions } from "../types/index";
import { validator_error_messages_english } from "../locales/validator/en";
import { validator_error_messages_german } from "../locales/validator/de";

export interface ValidatorReturnObject  {
    valid: boolean;
    errMessage?: string | undefined;
}

function resolveType(value: any): TypeofOptions {
  if (Array.isArray(value)) return "array";
  if (value === null) return "undefined"; // or "null" if you want to support it
  return typeof value as TypeofOptions;
}



export const createValidator = 
  ( 
    schemaType: TypeofOptions,
    schema: SchemaInterface,
    options: {
      name: string,
      language?: "english" | "german" | undefined
    }
  )=> function validate(value: JsonV | Array<Union<JsonV, Primitive>>): ValidatorReturnObject {
    let error: ValidatorReturnObject;
    let name = options.name;
    let vem = options.language === "english" ? validator_error_messages_english : options.language==="german" ? validator_error_messages_german : validator_error_messages_english;;
    let tv: TypeofOptions = resolveType(value);
    switch (schemaType) {
      case "string":  error = {
          valid: tv === "string",
          errMessage: tv === "string" ? undefined : vem.invalid_type("string", tv)
      }; break;
      case "number": error = {
        valid: tv === "number",
        errMessage: tv === "number" ? undefined : vem.invalid_type("number", tv)
      }; break;
      case "boolean": error = {
        valid: tv === "boolean",
        errMessage: tv === "boolean" ? undefined : vem.invalid_type("boolean", tv)
      }; break;
      case "symbol": error = {
        valid: tv === "symbol",
        errMessage: tv === "symbol" ? undefined : vem.invalid_type("symbol", tv)
      }; break;
      case "bigint": error = {
        valid: tv === "bigint",
        errMessage: tv === "bigint" ? undefined : vem.invalid_type("bigint", tv)
      };
      break;
      case "undefined": error = {
        valid: tv === "undefined",
        errMessage: tv === "undefined" ? undefined : vem.invalid_type("undefined", tv)
      };
      break;

      case "array":
        const temp = Array.isArray(value) ? value.every(v => validate(v).valid) : false;
        error = {
            valid: temp,
            errMessage: temp ? undefined : vem.invalid_array(tv)
        };
        break;

      case "function":
        error = {
          valid: tv === "function",
          errMessage: tv === "function"
            ? undefined
            : vem.invalid_type("function", tv)
        };
        break;

      case "object":
         if (tv !== "object" || value === null || Array.isArray(value)) {
           error = {
             valid: false,
             errMessage: vem.invalid_object(tv)
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
          childType as TypeofOptions,
          childSchema as SchemaInterface,
          {
            language: options.language ?? undefined,
            name: `${name}.${key}`
          }
        );
                   const result = childValidator((value as any)[key]);

                   if (!result.valid) {
             allValid = false;
             // Extract the error message without the duplicate prefix and "ERROR, "
             firstError = result.errMessage?.replace(/^\[@typescript-utils\/schema-validator\]: ERROR, /, '');
             break;
           }
         }
               error = {
           valid: allValid,
           errMessage: allValid ? undefined : firstError
         };
         break;


      default: error = {valid: false, errMessage: vem.validation_failure()};
    }   

    return {
        valid: error.valid,
        errMessage: error.valid ? undefined : `[@typescript-utils/schema-validator]: ERROR, ${error.errMessage} on schema "${name}" failed.`
    };
}
