export const validator_error_messages_english = {
  invalid_type: (expected: string, received: string) =>
    `Schema does not match the passed value (schema:${expected} vs value:${received})`,

  invalid_object: (received: string) =>
    `Schema does not match the passed value (schema:object vs value:${received})`,

  invalid_array: (received: string) =>
    `Schema does not match the passed value (schema:array vs value:${received})`,

  validation_failure: () => 
    `Schema Validation Failed`
};