export type StringBooleanAttribute = 'true' | 'false';

export function isStringBooleanAttribute(value: StringBooleanAttribute): boolean {
  // eslint-disable-next-line eqeqeq
  return value != null && `${value}` !== 'false';
}
