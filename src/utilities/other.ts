export function getCharacter(memberNumber?: number) {
  return ChatRoomCharacter.find((c) => c.MemberNumber === memberNumber) ?? undefined;
}

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function assertNever(x: never): never {
  throw new Error(`Unexpected case: ${x}`);
}

/** Overshoots then settles — springy / bouncy feel. */
export function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * ((t - 1) ** 3) + c1 * ((t - 1) ** 2);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}