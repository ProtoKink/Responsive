export function getCharacter(memberNumber?: number) {
  return ChatRoomCharacter.find((c) => c.MemberNumber === memberNumber) ?? undefined;
}

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function assertNever(x: never): never {
  throw new Error(`Unexpected case: ${x}`);
}
