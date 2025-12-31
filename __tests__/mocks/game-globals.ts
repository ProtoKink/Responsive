import { vi } from 'vitest';

export const Player = {
  MemberNumber: 1,
  ArousalSettings: {
    Progress: 50,
  },
} as any;

export const ChatRoomData = {
  Name: 'Test Room',
  Character: [
    { MemberNumber: 1, Nickname: 'Player' },
    { MemberNumber: 2, Nickname: 'Test Character' },
  ],
} as any;

export const ChatRoomCharacter = [
  { MemberNumber: 1, Nickname: 'Player' },
  { MemberNumber: 2, Nickname: 'Test Character' },
] as any;

export const ChatRoomTargetMemberNumber = -1;

let mockTime = 1000000;

export function CommonTime(): number {
  return mockTime;
}

export function setMockTime(time: number): void {
  mockTime = time;
}

export function advanceMockTime(ms: number): void {
  mockTime += ms;
}

export function ChatRoomGetCharacter(spec: string | number): any {
  const memberNumber = typeof spec === 'string' ? parseInt(spec, 10) : spec;
  return ChatRoomCharacter.find((c: any) => c.MemberNumber === memberNumber);
}

export const ChatRoomSendEmote = vi.fn();

export function AssetGetActivity(_asset: string, activityName: string): any {
  return {
    Name: activityName,
    Group: 'TestGroup',
  };
}

export function AssetGroupGet(_asset: string, groupName: string): any {
  return {
    Name: groupName,
  };
}

export const ActivityRun = vi.fn();

export function CharacterPronounDescription(character: any): string {
  return character?.Pronoun || 'She/Her';
}

export function CharacterNickname(character: any): string {
  return character?.Nickname || 'Unknown';
}

export const ElementValue = vi.fn((_id: string, value?: string) => {
  if (value !== undefined) {
    return value;
  }
  return '';
});

export const ChatRoomSendChat = vi.fn();

export const ChatRoomSendChatMessage = vi.fn();

export function CommonKeys(obj: any): string[] {
  return Object.keys(obj);
}

export function CommonGenerateUniqueID(): string {
  return 'unique-id-' + Math.random().toString(36).substr(2, 9);
}

