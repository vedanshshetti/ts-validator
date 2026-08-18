export const validator_error_messages_german = {
  invalid_type: (expected: string, received: string) =>
    `Schema stimmt nicht mit dem übergebenen Wert überein (schema:${expected} vs value:${received})`,

  invalid_object: (received: string) =>
    `Schema stimmt nicht mit dem übergebenen Wert überein (schema:object vs value:${received})`,

  invalid_array: (received: string) =>
    `Schema stimmt nicht mit dem übergebenen Wert überein (schema:array vs value:${received})`,

  validation_failure: () => 
    `Schemavalidierung fehlgeschlagen`
};