export function isRecord(value: unknown): value is Record<string, unknown> {
  return CommonIsObject(value);
}

export function invalid(label: string): never {
  throw new Error(`Invalid ${label}`);
}

export function asString(value: unknown, label: string): string {
  if (typeof value !== 'string') invalid(label);
  return value;
}

export function asCoercedString(value: unknown, label: string): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value);
  invalid(label);
}

export function asBoolean(value: unknown, label: string): boolean {
  if (typeof value !== 'boolean') invalid(label);
  return value;
}

export function asNumber(value: unknown, label: string, options?: { min?: number; integer?: boolean }): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) invalid(label);
  if (options?.integer && !Number.isInteger(value)) invalid(label);
  if (options?.min !== undefined && value < options.min) invalid(label);
  return value;
}

export function asStringArray(value: unknown, label: string): string[] {
  if (!Array.isArray(value)) invalid(label);
  const result: string[] = [];
  for (const item of value) {
    if (typeof item !== 'string') invalid(label);
    result.push(item);
  }
  return result;
}

export function asArray<T>(value: unknown, parseItem: (item: unknown) => T, label: string): T[] {
  if (!Array.isArray(value)) invalid(label);
  return value.map(parseItem);
}

export type ParseResult<T> = { success: true; data: T } | { success: false; error: Error };

export function safeParse<T>(parse: (input: unknown) => T, input: unknown): ParseResult<T> {
  try {
    return { success: true, data: parse(input) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}
