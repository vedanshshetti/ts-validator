# ts-validator

A lightweight TypeScript schema validation library for runtime type checking. Validate JSON data and primitive values against defined schemas with clear error messages.

## Installation

```bash
npm install @typescript-utils/schema-validator
```

or with pnpm:

```bash
pnpm add @typescript-utils/schema-validator
```

## Usage

### Basic Import

```typescript
import { defineSchema } from "@typescript-utils/schema-validator";
```

### Defining a Schema

Use `defineSchema` to create a reusable schema validator:

```typescript
const stringSchema = defineSchema("username", "string");
```

### Validating Values

Each schema returns a validator object with a `validate` method:

```typescript
const result = stringSchema.validate("john_doe");

console.log(result.valid); // true
console.log(result.errMessage); // undefined (no error)
```

### Validation Result

The `validate` method returns a `ValidatorReturnObject`:

```typescript
interface ValidatorReturnObject {
  valid: boolean;           // Whether validation passed
  errMessage?: string;      // Error message if validation failed
}
```

## Schema Types

### Primitive Types

Validate JavaScript primitive types:

```typescript
const schemas = {
  name: defineSchema("name", "string"),
  age: defineSchema("age", "number"),
  isActive: defineSchema("isActive", "boolean"),
  id: defineSchema("id", "bigint"),
  tag: defineSchema("tag", "symbol"),
  optional: defineSchema("optional", "undefined"),
  func: defineSchema("func", "function"),
};
```

### Object Schemas

Define nested object structures:

```typescript
const userSchema = defineSchema("user", {
  name: "string",
  age: "number",
  email: "string",
  isVerified: "boolean"
});

const result = userSchema.validate({
  name: "Alice",
  age: 30,
  email: "alice@example.com",
  isVerified: true
});

console.log(result.valid); // true
```

### Nested Objects

Schemas can be nested for complex data structures:

```typescript
const addressSchema = defineSchema("address", {
  street: "string",
  city: "string",
  zipCode: "string"
});

const profileSchema = defineSchema("profile", {
  user: {
    name: "string",
    age: "number"
  },
  address: {
    street: "string",
    city: "string"
  },
  preferences: {
    theme: "string",
    notifications: "boolean"
  }
});

const result = profileSchema.validate({
  user: { name: "Bob", age: 25 },
  address: { street: "123 Main St", city: "Metropolis" },
  preferences: { theme: "dark", notifications: true }
});
```

### Array Schemas

Validate arrays of values:

```typescript
const tagsSchema = defineSchema("tags", ["string"]);

const result1 = tagsSchema.validate(["typescript", "validation", "schema"]);
console.log(result1.valid); // true

const result2 = tagsSchema.validate(["typescript", 42]);
console.log(result2.valid); // false
console.log(result2.errMessage); // Error message about type mismatch
```

### Array of Objects

```typescript
const usersArraySchema = defineSchema("users", [
  {
    id: "number",
    name: "string"
  }
]);

const validUsers = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];

const result = usersArraySchema.validate(validUsers);
console.log(result.valid); // true
```

## Error Handling

When validation fails, the `errMessage` provides detailed information:

```typescript
const numberSchema = defineSchema("count", "number");

const result = numberSchema.validate("not a number");

console.log(result.valid); // false
console.log(result.errMessage);
// Output: "[@typescript-utils/ts-validator]: ERROR, Schema does not match the passed value (schema:number vs value:string) on schema \"count\" failed."
```

For nested object validation, errors include the path:

```typescript
const userSchema = defineSchema("user", {
  profile: {
    age: "number"
  }
});

const result = userSchema.validate({
  profile: {
    age: "thirty" // string instead of number
  }
});

console.log(result.errMessage);
// Output includes path: "user.profile" with type mismatch details
```

## Schema Definition Properties

The `defineSchema` function returns an object with the following properties:

```typescript
const schema = defineSchema("mySchema", {
  field: "string"
});

// Access schema metadata
console.log(schema.$name);    // "mySchema"
console.log(schema.$type);    // "object"
console.log(schema.$schema);  // { field: "string" }

// Use the validator
const result = schema.validate({ field: "value" });
```

## Type Definitions

### SchemaInterface

The schema can be:
- A primitive type string: `"string" | "number" | "boolean" | "bigint" | "symbol" | "undefined" | "null" | "function"`
- An object with string keys and SchemaInterface values
- An array of SchemaInterface items

```typescript
type RawPrimitives = "string" | "number" | "boolean" | "bigint" | "symbol" | "undefined" | "null";

type SchemaInterface =
  | { readonly [key: string]: RawPrimitives | SchemaInterface }
  | SchemaInterface[]
  | RawPrimitives;
```

### ValidatorReturnObject

```typescript
interface ValidatorReturnObject {
  valid: boolean;
  errMessage?: string | undefined;
}
```

## Examples

### Complete Validation Example

```typescript
import { defineSchema } from "@typescript-utils/schema-validator";

// Define a complex schema
const orderSchema = defineSchema("order", {
  orderId: "number",
  customer: {
    name: "string",
    email: "string"
  },
  items: [
    {
      productId: "number",
      quantity: "number",
      price: "number"
    }
  ],
  total: "number",
  isPaid: "boolean"
});

// Valid data
const validOrder = {
  orderId: 12345,
  customer: {
    name: "John Doe",
    email: "john@example.com"
  },
  items: [
    { productId: 1, quantity: 2, price: 19.99 },
    { productId: 2, quantity: 1, price: 9.99 }
  ],
  total: 49.97,
  isPaid: false
};

const result = orderSchema.validate(validOrder);
console.log(result.valid); // true

// Invalid data
const invalidOrder = {
  orderId: "12345", // string instead of number
  customer: {
    name: "Jane Doe",
    email: "jane@example.com"
  },
  items: [
    { productId: 1, quantity: 2, price: 19.99 }
  ],
  total: 49.97,
  isPaid: false
};

const invalidResult = orderSchema.validate(invalidOrder);
console.log(invalidResult.valid); // false
console.log(invalidResult.errMessage); // Detailed error about orderId type mismatch
```

### Reusing Schemas

```typescript
// Define reusable schemas
const userBaseSchema = {
  id: "number",
  createdAt: "string",
  updatedAt: "string"
};

const adminSchema = defineSchema("admin", {
  ...userBaseSchema,
  role: "string",
  permissions: ["string"]
});

const standardUserSchema = defineSchema("user", {
  ...userBaseSchema,
  role: "string"
});
```

## API Reference

### `defineSchema(name, schema)`

Creates a new schema validator.

**Parameters:**
- `name` (string): A unique name for the schema (used in error messages)
- `schema` (SchemaInterface): The schema definition

**Returns:** An object with:
- `$name`: The schema name
- `$type`: The schema type (derived from the schema definition)
- `$schema`: The original schema definition
- `validate(value)`: A function that validates values against the schema

### `validate(value)`

Validates a value against the schema.

**Parameters:**
- `value`: The value to validate (can be any JSON-compatible value or primitive)

**Returns:** `ValidatorReturnObject` with `valid` and `errMessage` properties

## Supported Types

| Type | Schema String | Description |
|------|---------------|-------------|
| String | `"string"` | Primitive string type |
| Number | `"number"` | Primitive number type |
| Boolean | `"boolean"` | Primitive boolean type |
| BigInt | `"bigint"` | BigInt type |
| Symbol | `"symbol"` | Symbol type |
| Undefined | `"undefined"` | Undefined type |
| Null | `"null"` | Null type |
| Function | `"function"` | Function type |
| Object | `{ key: type }` | Object with typed properties |
| Array | `[type]` | Array of items with specified type |

## License

Apache-2.0

## Repository

https://github.com/vedanshshetti/ts-validator

## Issues

Report issues at: https://github.com/vedanshshetti/ts-validator/issues