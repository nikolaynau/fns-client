export function expectNotEmptyString(actual: unknown) {
  expect(typeof actual).toBe('string');
  expect(actual).not.toBe('');
}

export function expectIsDefined(actual: unknown) {
  expect(actual).toBeDefined();
  expect(actual).not.toBeNull();
}

export function expectIsNumber(actual: unknown) {
  expect(typeof actual).toBe('number');
}
