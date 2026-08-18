import { createValidator } from "./createValidator";
export function defineSchema(name, schema) {
    return {
        $name: name,
        $type: typeof schema,
        $schema: schema,
        validate: createValidator(name, typeof schema, schema)
    };
}
//# sourceMappingURL=defineSchema.js.map